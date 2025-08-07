import { Event, EventTypes } from '@app/common/event-bus';
import { SendHourlyForecastMailDto } from '@app/common/types';

export class HourlyForecastEvent implements Event {
  readonly type = EventTypes.HOURLY_FORECAST;
  readonly payload: SendHourlyForecastMailDto;

  constructor(payload: SendHourlyForecastMailDto) {
    this.payload = payload;
  }
}
