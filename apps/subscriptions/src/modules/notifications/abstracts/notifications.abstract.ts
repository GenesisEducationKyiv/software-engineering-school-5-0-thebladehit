import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';

export abstract class AbstractNotificationsService {
  abstract sendSubscriptionConfirmation(
    dto: SendConfirmationMailDto
  ): Promise<void>;
  abstract sendDailyForecast(dto: SendDailyForecastMailDto): Promise<void>;
  abstract sendHourlyForecast(dto: SendHourlyForecastMailDto): Promise<void>;
}
