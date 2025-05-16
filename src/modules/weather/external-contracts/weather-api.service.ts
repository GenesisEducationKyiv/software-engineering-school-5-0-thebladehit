import { WeatherDto } from '../dto/weather.dto';

export abstract class WeatherApiService {
  abstract getWeather(city: string): Promise<WeatherDto>;
}