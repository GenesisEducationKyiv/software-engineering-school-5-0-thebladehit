import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';
import { WeatherAPIService } from '../weather-api/weather-api.service';

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
    {
      provide: AbstractWeatherApiService,
      useClass: WeatherAPIService,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
