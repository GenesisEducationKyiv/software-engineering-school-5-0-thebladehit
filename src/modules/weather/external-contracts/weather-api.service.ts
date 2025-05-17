import { WeatherCurrentDto } from '../dto/weather-current.dto';
import { WeatherDailyForecastDto } from '../dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../dto/weather-hourly-forecast.dto';

export abstract class WeatherApiService {
  abstract getWeather(city: string): Promise<WeatherCurrentDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}