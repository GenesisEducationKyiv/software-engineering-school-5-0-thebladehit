import { IsEmail, IsNumber, IsString } from 'class-validator';

export class SendDailyForecastMailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsNumber()
  maxTemp: number;

  @IsNumber()
  minTemp: number;

  @IsNumber()
  avgTemp: number;

  @IsNumber()
  avgHumidity: number;

  @IsNumber()
  chanceOfRain: number;

  @IsString()
  description: string;

  @IsNumber()
  sunrise: string;

  @IsNumber()
  sunset: string;
}
