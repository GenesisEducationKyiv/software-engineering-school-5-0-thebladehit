export abstract class MailService {
  abstract sendSubscriptionConfirmation(token: string, email: string): Promise<void>;
}
