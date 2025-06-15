import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';

import { WeatherAPIErrorDto } from './dto/weatherAPI.error.dto';

@Injectable()
export class CityApiService implements AbstractCityApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_BASE_URL');
  }

  async isCityExists(name: string): Promise<boolean> {
    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(name)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody: WeatherAPIErrorDto = await response.json();
      if (errorBody.error.code === 1006) {
        return false;
      }
      throw new InternalServerErrorException();
    }
    return true;
  }
}
