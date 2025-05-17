export class HourlyForecastAPIDto {
  forecast: {
    forecastday: {
      hour: {
        temp_c: number;
        condition: {
          text: string;
        };
        feelslike_c: number;
        humidity: number;
        chance_of_rain: number;
      }[];
    }[];
  }
}
