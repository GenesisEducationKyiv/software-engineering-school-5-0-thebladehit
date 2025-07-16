import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  SUBSCRIPTIONS_PACKAGE_NAME,
  SUBSCRIPTIONS_SERVICE_NAME,
  SubscriptionsServiceClient,
} from '@app/common/proto/subscriptions';
import { CreateSubscriptionDto, StatusResponseDto } from '@app/common/types';

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionsService.name);
  private subscriptionGrpcService: SubscriptionsServiceClient;

  constructor(
    @Inject(SUBSCRIPTIONS_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit(): void {
    this.subscriptionGrpcService =
      this.client.getService<SubscriptionsServiceClient>(
        SUBSCRIPTIONS_SERVICE_NAME
      );
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<void> {
    await firstValueFrom(this.subscriptionGrpcService.createSubscription(dto));
    return;
  }

  async confirmSubscription(token: string): Promise<StatusResponseDto> {
    await firstValueFrom(
      this.subscriptionGrpcService.confirmSubscription({ token })
    );
    return { status: 'ok', message: 'Subscription confirmed' };
  }

  async unsubscribeSubscription(token: string): Promise<StatusResponseDto> {
    await firstValueFrom(
      this.subscriptionGrpcService.unsubscribeSubscription({ token })
    );
    return { status: 'ok', message: 'Subscription unsubscribed' };
  }
}
