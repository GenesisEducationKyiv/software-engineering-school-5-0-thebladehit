import { Event, EventTypes } from '@app/common/event-bus';
import { SendDailyForecastMailDto } from '@app/common/types';

export class DailyForecastEvent implements Event {
  readonly type = EventTypes.DAILY_FORECAST;
  readonly payload: SendDailyForecastMailDto;

  constructor(payload: SendDailyForecastMailDto) {
    this.payload = payload;
  }
}
