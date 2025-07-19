import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import {
  AbstractEventBus,
  DailyForecastEvent,
  Event,
  EventTypes,
  HourlyForecastEvent,
  SubscriptionCreatedEvent,
} from '@app/common/event-bus';
import {
  SendConfirmationMailDto,
  SendDailyForecastMailDto,
  SendHourlyForecastMailDto,
} from '@app/common/types';

import { MailService } from '../../apps/notifications/src/mail.service';
import { NotificationModule } from '../../apps/notifications/src/notification.module';

const mockedMailerService = {
  sendMail: jest.fn(),
};

const mockedEventBusService = {
  subscribers: new Map<string, (event: Event) => Promise<void>>(),
  publish: function (event: Event): void {
    const handler = this.subscribers.get(event.type);
    handler(event);
  },
  subscribe: function (
    eventType: EventTypes,
    fn: (event: Event) => Promise<void>
  ): void {
    this.subscribers.set(eventType, fn);
  },
};

describe('NotificationsModule events consumption', () => {
  let service: MailService;
  let mailerService: jest.Mocked<MailerService>;
  let eventBus: jest.Mocked<AbstractEventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    })
      .overrideProvider(MailerService)
      .useValue(mockedMailerService)
      .overrideProvider(AbstractEventBus)
      .useValue(mockedEventBusService)
      .compile();

    service = module.get(MailerService);
    mailerService = module.get(MailerService);
    eventBus = module.get(AbstractEventBus);

    module.init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SubscriptionCreatedEvent', () => {
    it('should consume event and send email', async () => {
      const mockedData = {
        email: 'fakeemail@ggg.com',
        city: 'fake-city',
        frequency: 'HOURLY',
        token: 'fake-token',
      } as SendConfirmationMailDto;

      eventBus.publish(new SubscriptionCreatedEvent(mockedData));

      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('DailyForecastEvent', () => {
    it('should consume event and send email', async () => {
      const mockedData = {
        email: 'fakeemail@ggg.com',
      } as SendDailyForecastMailDto;

      eventBus.publish(new DailyForecastEvent(mockedData));

      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });

  describe('HourlyForecastEvent', () => {
    it('should consume event and send email', async () => {
      const mockedData = {
        email: 'fakeemail@ggg.com',
      } as SendHourlyForecastMailDto;

      eventBus.publish(new HourlyForecastEvent(mockedData));

      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });
});
