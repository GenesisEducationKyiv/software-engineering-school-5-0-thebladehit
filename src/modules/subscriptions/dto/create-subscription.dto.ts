import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(3)
  city: string;

  @IsEnum(SubscriptionType)
  frequency: SubscriptionType;
}
