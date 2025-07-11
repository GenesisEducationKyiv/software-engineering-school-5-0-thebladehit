export interface CurrentWeatherDto {
  weather: WeatherInfo[];

  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };

  pop?: number;
}

export interface WeatherInfo {
  description: string;
}
