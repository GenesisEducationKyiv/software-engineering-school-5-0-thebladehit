import { SubscriptionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

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
