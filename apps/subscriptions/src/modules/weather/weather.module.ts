import { join } from 'path';

import { WEATHER_PACKAGE_NAME } from '@app/common/proto/weather';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { AbstractWeatherService } from './abstracts/weather.abstract';
import { WeatherGrpcService } from './weather.grpc-service';

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
  providers: [
    {
      provide: AbstractWeatherService,
      useClass: WeatherGrpcService,
    },
  ],
  exports: [AbstractWeatherService],
})
export class WeatherModule {}
