import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';

import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';
import { WeatherDailyForecastDto } from '../weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../weather/dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../weather/dto/weather.dto';

import { ForecastResponseDto } from './dto/forecast-api.dto';
import { WeatherAPIDto } from './dto/weatherAPI.dto';
import { WeatherAPIErrorDto } from './dto/weatherAPI.error.dto';

// this service implementation use WeatherAPI.com
@Injectable()
export class WeatherAPIService implements AbstractWeatherApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_BASE_URL');
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    const response = await this.fetchWeatherDataFromAPI<WeatherAPIDto>(url);
    return {
      temperature: response.current.temp_c,
      humidity: response.current.humidity,
      description: response.current.condition.text,
    };
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    const url = `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&days=1`;
    const response =
      await this.fetchWeatherDataFromAPI<ForecastResponseDto>(url);
    const dayForecast = response.forecast.forecastday[0];
    if (!dayForecast) {
      throw new InternalServerErrorException();
    }
    return {
      maxTemp: dayForecast.day.maxtemp_c,
      minTemp: dayForecast.day.mintemp_c,
      avgTemp: dayForecast.day.avgtemp_c,
      avgHumidity: dayForecast.day.avghumidity,
      chanceOfRain: dayForecast.day.daily_chance_of_rain,
      description: dayForecast.day.condition.text,
      sunrise: dayForecast.astro.sunrise,
      sunset: dayForecast.astro.sunset,
    };
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    const now = new Date();
    const url = `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&hour=${now.getHours()}`;
    const response =
      await this.fetchWeatherDataFromAPI<ForecastResponseDto>(url);
    const dayForecast = response.forecast.forecastday[0];
    if (!dayForecast || !dayForecast.hour[0]) {
      throw new InternalServerErrorException();
    }
    const hourForecast = dayForecast.hour[0];
    return {
      temp: hourForecast.temp_c,
      description: hourForecast.condition.text,
      feelsLikeTemp: hourForecast.feelslike_c,
      humidity: hourForecast.humidity,
      chance_of_rain: hourForecast.chance_of_rain,
    };
  }

  private async fetchWeatherDataFromAPI<T>(url: string): Promise<T> {
    return firstValueFrom(
      this.httpService.get<T>(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          const data = error?.response?.data as WeatherAPIErrorDto;
          if (data?.error?.code === 1006) {
            throw new NotFoundException();
          }
          throw new InternalServerErrorException();
        })
      )
    );
  }
}
