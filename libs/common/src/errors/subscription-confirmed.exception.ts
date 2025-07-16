export class SubscriptionConfirmedException extends Error {
  constructor(token: string) {
    super(`Subscription with token: "${token}" already confirmed`);
  }
}
