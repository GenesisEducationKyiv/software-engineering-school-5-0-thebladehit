import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AbstractWeatherService } from './abstracts/weather.abstract';
import { WeatherHttpService } from './weather.http-service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: AbstractWeatherService,
      useClass: WeatherHttpService,
    },
  ],
  exports: [AbstractWeatherService],
})
export class WeatherModule {}
