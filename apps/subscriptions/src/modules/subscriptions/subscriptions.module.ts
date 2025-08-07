import { EventBusModule } from '@app/common/event-bus';
import { MetricsModule } from '@app/common/metrics';
import { Module } from '@nestjs/common';

import { CityModule } from '../city/city.module';
import { PrismaModule } from '../prisma/prisma.module';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [PrismaModule, CityModule, EventBusModule, MetricsModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    {
      provide: AbstractSubscriptionRepository,
      useClass: SubscriptionRepository,
    },
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
