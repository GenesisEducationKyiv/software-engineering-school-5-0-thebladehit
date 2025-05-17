import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRepository } from './contracts/subscription.repository';
import { SubscriptionRepositoryImpl } from './subscription.repositoryImpl';
import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

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
