import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherApiService } from './external-contracts/weather-api.service';
import { WeatherAPIImplService } from './external-providers/weatherAPIImpl.service';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: WeatherApiService,
      useClass: WeatherAPIImplService,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
