import { WeatherApiService } from '../external-contracts/weather-api.service';
import { WeatherDto } from '../dto/weather.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherAPIDto } from '../dto/weatherAPI.dto';
import { WeatherAPIErrorDto } from '../dto/weatherAPI.error.dto';
import { InvalidCityException } from '../errors/invalid-city.exception';

// this service implementation use WeatherAPI.com
@Injectable()
export class WeatherAPIImplService implements WeatherApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly cacheTTL: number;
  private cache = new Map<string, { data: WeatherDto; timestamp: number }>();

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.cacheTTL = this.configService.get<number>(
      'WEATHER_CACHE_TTL',
      10 * 1000 * 60
    );
    this.baseURL = this.configService.get<string>('WEATHER_BASE_URL');
  }

  async getWeather(city: string): Promise<WeatherDto> {
    const cached = this.cache.get(city);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const data = await this.fetchWeatherFromAPI(city);
    this.cache.set(city, { data, timestamp: Date.now() });
    return data;
  }

  private async fetchWeatherFromAPI(city: string): Promise<WeatherDto> {
    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody: WeatherAPIErrorDto = await response.json();
      if (errorBody.error.code === 1006) {
        throw new InvalidCityException(errorBody.error.message);
      } else {
        throw new Error('Internal application error');
      }
    }
    const data: WeatherAPIDto = await response.json();
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}
