import { WeatherApiService } from '../external-contracts/weather-api.service';
import { WeatherCurrentDto } from '../dto/weather-current.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherAPIDto } from '../dto/external/weatherAPI.dto';
import { WeatherAPIErrorDto } from '../dto/external/weatherAPI.error.dto';
import { InvalidCityException } from '../errors/invalid-city.exception';
import { WeatherDailyForecastDto } from '../dto/weather-daily-forecast.dto';
import { DailyForecastAPIDto } from '../dto/external/daily-forecastAPI.dto';

// this service implementation use WeatherAPI.com
@Injectable()
export class WeatherAPIImplService implements WeatherApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly cacheTTL: number;
  private cache = new Map<string, { data: WeatherCurrentDto; timestamp: number }>();

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.cacheTTL = this.configService.get<number>(
      'WEATHER_CACHE_TTL',
      10 * 1000 * 60
    );
    this.baseURL = this.configService.get<string>('WEATHER_BASE_URL');
  }

  async getWeather(city: string): Promise<WeatherCurrentDto> {
    const cached = this.cache.get(city);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    const response = await this.fetchWeatherDataFromAPI<WeatherAPIDto>(url);
    const data = {
      temperature: response.current.temp_c,
      humidity: response.current.humidity,
      description: response.current.condition.text,
    };
    this.cache.set(city, { data, timestamp: Date.now() });
    return data;
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    const url = `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&days=1`;
    const response =
      await this.fetchWeatherDataFromAPI<DailyForecastAPIDto>(url);
    return {
      maxTemp: response.forecast.forecastday[0].day.maxtemp_c,
      minTemp: response.forecast.forecastday[0].day.mintemp_c,
      avgTemp: response.forecast.forecastday[0].day.avgtemp_c,
      avgHumidity: response.forecast.forecastday[0].day.avghumidity,
      chanceOfRain: response.forecast.forecastday[0].day.daily_chance_of_rain,
      description: response.forecast.forecastday[0].day.condition.text,
      sunrise: response.forecast.forecastday[0].astro.sunrise,
      sunset: response.forecast.forecastday[0].astro.sunset,
    };
  }

  private async fetchWeatherDataFromAPI<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody: WeatherAPIErrorDto = await response.json();
      if (errorBody.error.code === 1006) {
        throw new InvalidCityException(errorBody.error.message);
      } else {
        throw new Error('Internal application error');
      }
    }
    return response.json();
  }
}
