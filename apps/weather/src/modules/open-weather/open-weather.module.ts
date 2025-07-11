import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OpenWeatherService } from './open-weather.service';

@Module({
  imports: [HttpModule],
  providers: [OpenWeatherService],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
