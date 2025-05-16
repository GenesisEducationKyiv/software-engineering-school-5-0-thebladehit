import { SubscriptionType } from '@prisma/client';

export class SendMailDto {
  email: string;
  token: string;
  city: string;
  frequency: SubscriptionType;
}
