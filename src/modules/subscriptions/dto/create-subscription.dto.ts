import { SubscriptionType } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

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
