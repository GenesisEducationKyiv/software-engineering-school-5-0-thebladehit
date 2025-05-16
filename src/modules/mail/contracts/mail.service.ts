import { SendMailDto } from '../dto/send-mail.dto';

export abstract class MailService {
  abstract sendSubscriptionConfirmation(dto: SendMailDto): Promise<void>;
}
