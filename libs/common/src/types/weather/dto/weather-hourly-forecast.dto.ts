export interface WeatherHourlyForecastDto {
  temp: number;
  description: string;
  feelsLikeTemp: number;
  humidity: number;
  chance_of_rain: number;
}

export interface CitiesHourlyForecastDto {
  [city: string]: WeatherHourlyForecastDto;
}
