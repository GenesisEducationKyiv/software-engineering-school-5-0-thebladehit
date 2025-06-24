import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum SubscriptionType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
}

export class CreateSubscriptionDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.toLowerCase())
  city: string;

  @IsEnum(SubscriptionType)
  frequency: SubscriptionType;
}
