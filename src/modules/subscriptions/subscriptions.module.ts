import { Module } from '@nestjs/common';

import { MailModule } from '../mail/mail.module';

import { SubscriptionRepository } from './contracts/subscription.repository';
import { SubscriptionRepositoryImpl } from './subscription.repositoryImpl';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MailModule, PrismaModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    {
      provide: SubscriptionRepository,
      useClass: SubscriptionRepositoryImpl,
    },
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
