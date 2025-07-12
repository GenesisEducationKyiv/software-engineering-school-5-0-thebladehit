export type SubscriptionFrequency = 'HOURLY' | 'DAILY';

export class SendConfirmationMailDto {
  email: string;
  token: string;
  city: string;
  frequency: SubscriptionFrequency;
}
