export class DuplicateSubscriptionException extends Error {
  constructor(city: string, frequency: string) {
    super(`You have already subscribed to ${frequency} (${city})`);
  }
}
