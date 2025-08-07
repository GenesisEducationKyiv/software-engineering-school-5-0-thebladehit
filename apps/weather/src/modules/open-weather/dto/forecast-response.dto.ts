import { CurrentWeatherDto } from './weather-response.dto';

export interface ForecastResponseDto {
  list: CurrentWeatherDto[];
  city: City;
}

export interface City {
  name: string;
  sunrise: number;
  sunset: number;
}
