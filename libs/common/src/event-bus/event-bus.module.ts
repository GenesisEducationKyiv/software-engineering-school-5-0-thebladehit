import { Module } from '@nestjs/common';

import { AbstractEventBus } from '@app/common/event-bus/abstracts';
import { RabbitmqEventBusService } from '@app/common/event-bus/rabbitmq-event-bus.service';

@Module({
  providers: [
    {
      provide: AbstractEventBus,
      useClass: RabbitmqEventBusService,
    },
  ],
  exports: [AbstractEventBus],
})
export class EventBusModule {}
