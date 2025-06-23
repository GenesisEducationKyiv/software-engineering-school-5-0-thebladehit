import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { WeatherAPIService } from '../weather-api/weather-api.service';

import { WeatherApiChainService } from './weather-api-chain.service';
import { WeatherCacheService } from './weather-cache.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule.register({
      timeout: 2000,
    }),
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherCacheService,
    WeatherAPIService,
    OpenWeatherService,
    {
      provide: AbstractWeatherApiService,
      useFactory: (
        weatherApiService: WeatherAPIService,
        openWeatherService: OpenWeatherService
      ): AbstractWeatherApiService => {
        return new WeatherApiChainService(
          weatherApiService,
          openWeatherService
        );
      },
      inject: [WeatherAPIService, OpenWeatherService],
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
