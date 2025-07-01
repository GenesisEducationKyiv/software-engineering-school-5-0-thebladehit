import { SubscriptionType } from '@prisma/client';

export class SendConfirmationMailDto {
  email: string;
  token: string;
  city: string;
  frequency: SubscriptionType;
}
