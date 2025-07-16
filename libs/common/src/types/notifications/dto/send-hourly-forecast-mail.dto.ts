import { IsEmail, IsNumber, IsString } from 'class-validator';

export class SendHourlyForecastMailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsNumber()
  temp: number;

  @IsString()
  description: string;

  @IsNumber()
  feelsLikeTemp: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  chanceOfRain: number;
}
