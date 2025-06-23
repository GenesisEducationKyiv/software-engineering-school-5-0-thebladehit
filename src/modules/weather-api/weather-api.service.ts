import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';

import { AbstractWeatherApiChainService } from '../abstracts/weather-api-chain.abstract';
import { WeatherDailyForecastDto } from '../weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../weather/dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../weather/dto/weather.dto';

import { ErrorResponse } from './dto/error-response';
import { ForecastResponseDto } from './dto/forecast-response.dto';
import { WeatherAPIDto } from './dto/weather-response.dto';

// this service implementation use WeatherAPI.com
@Injectable()
export class WeatherAPIService implements AbstractWeatherApiChainService {
  private readonly baseURL: string;
  private readonly apiKey: string;

  private next?: AbstractWeatherApiChainService;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_API_BASE_URL');
  }

  setNext(next: AbstractWeatherApiChainService): void {
    this.next = next;
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
      const response = await this.fetchWeatherDataFromAPI<WeatherAPIDto>(url);
      return {
        temperature: response.current.temp_c,
        humidity: response.current.humidity,
        description: response.current.condition.text,
      };
    } catch (err) {
      if (!this.next) {
        throw err;
      }
      return this.next.getWeather(city);
    }
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    try {
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
    } catch (err) {
      if (!this.next) {
        throw err;
      }
      return this.next.getDailyForecast(city);
    }
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    try {
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
    } catch (err) {
      if (!this.next) {
        throw err;
      }
      return this.next.getHourlyForecast(city);
    }
  }

  private async fetchWeatherDataFromAPI<T>(url: string): Promise<T> {
    return firstValueFrom(
      this.httpService.get<T>(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          const data = error?.response?.data as ErrorResponse;
          if (data?.error?.code === 1006) {
            throw new NotFoundException();
          }
          throw new InternalServerErrorException();
        })
      )
    );
  }
}
