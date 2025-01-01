import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { HttpApiExceptionsFilter } from './common/filters/http-api-exception.filter';

export class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string | boolean | RegExp | (string | RegExp)[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;

    if (!process.env.SECRET_KEY) this.logger.error('setting SECRET_KEY environment');

    this.DEV_MODE = process.env.NODE_ENV === 'development';
    this.PORT = this.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : true;
    this.ADMIN_USER = process.env.ADMIN_USER;
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.ADMIN_USER]: this.ADMIN_PASSWORD,
        },
      })
    );
  }

  private setUpOpenAPIMiddleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('Can I Pay - API')
          .setDescription('TypeORM In Nest')
          .setVersion('0.0.1')
          .addBearerAuth(
            {
              type: 'http',
              scheme: 'bearer',
              name: 'JWT',
              in: 'header',
            },
            'access-token'
          )
          .build()
      )
    );
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      })
    );

    // 해당 Interceptor를 통해 exclude 데코레이터가 붙은 필드는 조회 결과에서 제외됨
    this.server.useGlobalInterceptors(new ClassSerializerInterceptor(this.server.get(Reflector)));
    this.server.useGlobalFilters(new HttpApiExceptionsFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);

  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
