import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('T_MAP_API_URL'),
        headers: {
          appKey: configService.get<string>('T_MAP_APP_KEY'),
        },
      }),
    }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
