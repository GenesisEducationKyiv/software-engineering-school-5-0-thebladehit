export class SendDailyForecastMailDto {
  email: string;
  city: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  avgHumidity: number;
  chanceOfRain: number;
  description: string;
  sunrise: string;
  sunset: string;
}
