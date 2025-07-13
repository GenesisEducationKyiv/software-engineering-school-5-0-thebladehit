import {
  CitiesDailyForecastDto,
  CitiesHourlyForecastDto,
} from '@app/common/types';

export abstract class AbstractWeatherService {
  abstract getDailyForecasts(cities: string[]): Promise<CitiesDailyForecastDto>;

  abstract getHourlyForecasts(
    cities: string[]
  ): Promise<CitiesHourlyForecastDto>;
}
