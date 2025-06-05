import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

import { SubscriptionRepository } from './contracts/subscription.repository';
import { SubscriptionRepositoryImpl } from './subscription.repositoryImpl';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [MailModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    PrismaService,
    {
      provide: SubscriptionRepository,
      useClass: SubscriptionRepositoryImpl,
    },
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
