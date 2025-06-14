import { WeatherCurrentDto } from '../weather/dto/weather-current.dto';
import { WeatherDailyForecastDto } from '../weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../weather/dto/weather-hourly-forecast.dto';

export abstract class AbstractWeatherApiService {
  abstract getWeather(city: string): Promise<WeatherCurrentDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}
