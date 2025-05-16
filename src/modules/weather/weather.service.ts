import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WeatherApiService } from './external-contracts/weather-api.service';
import { WeatherDto } from './dto/weather.dto';
import { InvalidCityException } from './errors/invalid-city.exception';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiService: WeatherApiService) {}

  async getWeather(city: string): Promise<WeatherDto> {
    try {
      return await this.weatherApiService.getWeather(city);
    } catch (error) {
      if (error instanceof InvalidCityException) {
        throw new NotFoundException(`City: ${city} not found`);
      }
      throw new BadRequestException(error.message);
    }
  }
}
