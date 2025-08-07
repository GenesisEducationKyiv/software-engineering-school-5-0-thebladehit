import { join } from 'path';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { WEATHER_PACKAGE_NAME } from '@app/common/proto/weather';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: WEATHER_PACKAGE_NAME,
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('WEATHER_GRPC_URL'),
            package: WEATHER_PACKAGE_NAME,
            protoPath: join(
              __dirname,
              '..',
              '..',
              'libs/common/src/proto/weather.proto'
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
