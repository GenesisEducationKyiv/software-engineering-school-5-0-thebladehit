import { Module } from '@nestjs/common';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';
import { WeatherAPIService } from '../weather-api/weather-api.service';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: AbstractWeatherApiService,
      useClass: WeatherAPIService,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
