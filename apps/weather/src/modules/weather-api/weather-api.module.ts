import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WeatherAPIService } from './weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherAPIService],
  exports: [WeatherAPIService],
})
export class WeatherApiModule {}
