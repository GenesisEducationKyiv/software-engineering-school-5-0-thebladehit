export class SubscriptionNotFoundException extends Error {
  constructor(token: string) {
    super(`Subscription with token: "${token}" not found`);
  }
}
