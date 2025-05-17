export class DailyForecastAPIDto {
  forecast: {
    forecastday: {
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        avghumidity: number;
        daily_chance_of_rain: number;
        condition: {
          text: string;
        };
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
    }[];
  };
}
