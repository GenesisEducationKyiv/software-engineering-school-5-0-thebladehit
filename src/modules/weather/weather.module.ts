import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { WeatherApiModule } from '../weather-api/weather-api.module';

import { OpenWeatherProvider } from './chain-providers/open-weather.provider';
import { WeatherApiProvider } from './chain-providers/weather-api.provider';
import { WeatherApiChainService } from './weather-api-chain.service';
import { WeatherCacheService } from './weather-cache.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [CacheModule.register(), WeatherApiModule, OpenWeatherModule],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherCacheService,
    WeatherApiProvider,
    OpenWeatherProvider,
    {
      provide: AbstractWeatherApiService,
      useClass: WeatherApiChainService,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
