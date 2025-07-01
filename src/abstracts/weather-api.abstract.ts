import { WeatherDailyForecastDto } from '../modules/weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../modules/weather/dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../modules/weather/dto/weather.dto';

export abstract class AbstractWeatherApiService {
  abstract getWeather(city: string): Promise<WeatherResponseDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}
