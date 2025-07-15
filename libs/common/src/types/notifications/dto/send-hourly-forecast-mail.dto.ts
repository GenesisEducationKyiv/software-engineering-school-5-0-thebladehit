export class SendHourlyForecastMailDto {
  email: string;
  city: string;
  temp: number;
  description: string;
  feelsLikeTemp: number;
  humidity: number;
  chanceOfRain: number;
}
