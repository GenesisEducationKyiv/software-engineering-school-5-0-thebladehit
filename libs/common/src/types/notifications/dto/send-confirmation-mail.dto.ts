import { IsEmail, IsString } from 'class-validator';

export type SubscriptionFrequency = 'HOURLY' | 'DAILY';

export class SendConfirmationMailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  city: string;

  @IsString()
  frequency: SubscriptionFrequency;
}
