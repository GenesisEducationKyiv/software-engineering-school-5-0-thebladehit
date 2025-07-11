import { AbstractWeatherApiChainService } from '../abstracts/weather-api-chain.abstract';
import { WeatherDailyForecastDto } from '../dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../dto/weather-response.dto';

export abstract class BaseWeatherProvider
  implements AbstractWeatherApiChainService
{
  private next: AbstractWeatherApiChainService;

  setNext(
    next: AbstractWeatherApiChainService
  ): AbstractWeatherApiChainService {
    this.next = next;
    return next;
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    try {
      return await this.handleDailyForecast(city);
    } catch (err) {
      if (this.next) {
        return this.next.getDailyForecast(city);
      }
      throw err;
    }
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    try {
      const [result] = await Promise.all([this.handleHourlyForecast(city)]);
      return result;
    } catch (err) {
      if (this.next) {
        return this.next.getHourlyForecast(city);
      }
      throw err;
    }
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      return await this.handleWeather(city);
    } catch (err) {
      if (this.next) {
        return this.next.getWeather(city);
      }
      throw err;
    }
  }

  protected abstract handleDailyForecast(
    city: string
  ): Promise<WeatherDailyForecastDto>;
  protected abstract handleHourlyForecast(
    city: string
  ): Promise<WeatherHourlyForecastDto>;
  protected abstract handleWeather(city: string): Promise<WeatherResponseDto>;
}
