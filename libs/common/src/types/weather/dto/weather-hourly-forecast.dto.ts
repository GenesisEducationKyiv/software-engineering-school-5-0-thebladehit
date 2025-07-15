export interface WeatherHourlyForecastDto {
  temp: number;
  description: string;
  feelsLikeTemp: number;
  humidity: number;
  chanceOfRain: number;
}

export interface CitiesHourlyForecastDto {
  [city: string]: WeatherHourlyForecastDto;
}
