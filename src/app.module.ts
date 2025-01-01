import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from '@nestjs/config';
import { StoresModule } from './stores/stores.module';

const typeOrmModuleOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: 'postgres',
      password: 'admin',
      database: process.env.DB_NAME,
      synchronize: true, // set 'false' in production
      autoLoadEntities: true,
      logging: true, // set 'false' in production
      keepConnectionAlive: true,
    };
  },
};

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRootAsync(typeOrmModuleOptions), StoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
