export class SendHourlyForecastMailDto {
  email: string;
  city: string;
  temp: number;
  description: string;
  feelsLikeTemp: number;
  humidity: number;
  chance_of_rain: number;
}
