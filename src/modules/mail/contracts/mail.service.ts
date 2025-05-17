import { SendConfirmationMailDto } from '../dto/send-confirmation-mail.dto';
import { SendDailyForecastMailDto } from '../dto/send-daily-forecast-mail.dto';
import { SendHourlyForecastMailDto } from '../dto/send-hourly-forecast-mail.dto';

export abstract class MailService {
  abstract sendSubscriptionConfirmation(dto: SendConfirmationMailDto): Promise<void>;
  abstract sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void>;
  abstract sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void>;
}
