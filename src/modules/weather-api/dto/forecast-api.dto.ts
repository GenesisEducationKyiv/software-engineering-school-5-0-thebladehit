export interface ForecastResponseDto {
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: CurrentDay;
  astro: Astro;
  hour: HourForecast[];
}

export interface CurrentDay {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  condition: {
    text: string;
  };
}

export interface Astro {
  sunrise: string;
  sunset: string;
}

export interface HourForecast {
  temp_c: number;
  condition: {
    text: string;
  };
  feelslike_c: number;
  humidity: number;
  chance_of_rain: number;
}
