import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

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
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        WEATHER_API_KEY: Joi.string().required(),
        WEATHER_API_BASE_URL: Joi.string().required(),
        OPEN_WEATHER_API_KEY: Joi.string().required(),
        OPEN_WEATHER_BASE_URL: Joi.string().required(),
        WEATHER_CACHE_TTL: Joi.number().integer().required(),
        DAILY_FORECAST_CACHE_TTL: Joi.number().integer().required(),
        HOURLY_FORECAST_CACHE_TTL: Joi.number().integer().required(),
      }),
    }),
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
})
export class WeatherModule {}
