import { Module } from '@nestjs/common';

import { CityModule } from '../city/city.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [PrismaModule, CityModule, NotificationsModule],
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
