import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';

import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';

import { ErrorResponseDto } from './dto/error-response.dto';
import { ForecastResponseDto } from './dto/forecast-response.dto';
import { CurrentWeatherDto } from './dto/weather-response.dto';

// this service implementation use openweathermap.com
@Injectable()
export class OpenWeatherService implements AbstractWeatherApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(OpenWeatherService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('OPEN_WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('OPEN_WEATHER_BASE_URL');
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    const url = `${this.baseURL}/weather?appid=${this.apiKey}&q=${encodeURIComponent(city)}&units=metric`;
    const response = await this.fetchWeatherDataFromAPI<CurrentWeatherDto>(url);
    this.logger.log(response);
    const weatherInfo = response.weather[0];
    if (!weatherInfo) {
      throw new InternalServerErrorException();
    }
    return {
      temperature: response.main.temp,
      humidity: response.main.humidity,
      description: weatherInfo.description,
    };
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    const url = `${this.baseURL}/forecast?appid=${this.apiKey}&q=${encodeURIComponent(city)}&units=metric&cnt=8`;
    const response =
      await this.fetchWeatherDataFromAPI<ForecastResponseDto>(url);
    this.logger.log(response);
    const hourForecasts = response.list;
    if (hourForecasts.length === 0) {
      throw new InternalServerErrorException();
    }
    const weatherInfo = hourForecasts[0].weather[0];
    if (!weatherInfo) {
      throw new InternalServerErrorException();
    }
    return {
      maxTemp: this.getMaxTemp(hourForecasts),
      minTemp: this.getMinTemp(hourForecasts),
      avgTemp: this.getAvgTemp(hourForecasts),
      avgHumidity: this.getAvgHumidity(hourForecasts),
      chanceOfRain: this.getDailyChanceOfRain(hourForecasts),
      description: weatherInfo.description,
      sunrise: new Date(response.city.sunrise).toISOString(),
      sunset: new Date(response.city.sunset).toISOString(),
    };
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    const url = `${this.baseURL}/forecast?appid=${this.apiKey}&q=${encodeURIComponent(city)}&cnt=1&units=metric`;
    const response =
      await this.fetchWeatherDataFromAPI<ForecastResponseDto>(url);
    this.logger.log(response);
    const hourForecast = response.list[0];
    if (!hourForecast) {
      throw new InternalServerErrorException();
    }
    const weatherInfo = hourForecast.weather[0];
    if (!weatherInfo) {
      throw new InternalServerErrorException();
    }
    return {
      temp: hourForecast.main.temp,
      description: weatherInfo.description,
      feelsLikeTemp: hourForecast.main.feels_like,
      humidity: hourForecast.main.humidity,
      chance_of_rain: hourForecast.pop,
    };
  }

  private async fetchWeatherDataFromAPI<T>(url: string): Promise<T> {
    return firstValueFrom(
      this.httpService.get<T>(url).pipe(
        map((response) => response.data),
        catchError((error) => {
          const data = error?.response?.data as ErrorResponseDto;
          if (Number(data.cod) === 404) {
            throw new NotFoundException();
          }
          throw new InternalServerErrorException();
        })
      )
    );
  }

  private getMaxTemp(forecasts: CurrentWeatherDto[]): number {
    let maxTemp = 0;
    for (const forecast of forecasts) {
      const curTemp = forecast.main.temp;
      if (curTemp > maxTemp) {
        maxTemp = curTemp;
      }
    }
    return maxTemp;
  }

  private getMinTemp(forecasts: CurrentWeatherDto[]): number {
    let minTemp = Infinity;
    for (const forecast of forecasts) {
      const curTemp = forecast.main.temp;
      if (curTemp < minTemp) {
        minTemp = curTemp;
      }
    }
    return minTemp;
  }

  private getAvgTemp(forecasts: CurrentWeatherDto[]): number {
    let avgTemp = 0;
    for (const forecast of forecasts) {
      avgTemp += forecast.main.temp;
    }
    return avgTemp / forecasts.length;
  }

  private getAvgHumidity(forecasts: CurrentWeatherDto[]): number {
    let avgHumidity = 0;
    for (const forecast of forecasts) {
      avgHumidity += forecast.main.humidity;
    }
    return avgHumidity / forecasts.length;
  }

  private getDailyChanceOfRain(forecasts: CurrentWeatherDto[]): number {
    let chanceOfNoRain = 1;
    for (const forecast of forecasts) {
      chanceOfNoRain *= 1 - forecast.pop;
    }
    return 1 - chanceOfNoRain;
  }
}
