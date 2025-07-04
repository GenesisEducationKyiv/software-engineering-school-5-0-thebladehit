import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';
import { MetricsModule } from '../metrics/metrics.module';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { WeatherApiModule } from '../weather-api/weather-api.module';

import { AbstractWeatherCacheService } from './abstracts/weather-cache.service.abstract';
import { OpenWeatherProvider } from './chain-providers/open-weather.provider';
import { WeatherApiProvider } from './chain-providers/weather-api.provider';
import { WeatherApiChainService } from './weather-api-chain.service';
import { WeatherCacheService } from './weather-cache.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv(
            `${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`
          ),
        ],
      }),
      inject: [ConfigService],
    }),
    WeatherApiModule,
    OpenWeatherModule,
    MetricsModule,
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherApiProvider,
    OpenWeatherProvider,
    {
      provide: AbstractWeatherApiService,
      useClass: WeatherApiChainService,
    },
    {
      provide: AbstractWeatherCacheService,
      useClass: WeatherCacheService,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
