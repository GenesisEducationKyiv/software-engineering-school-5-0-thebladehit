import {
  CreateSubscriptionRequest,
  Empty,
  SubscriptionsServiceController,
  SubscriptionsServiceControllerMethods,
  TokenRequest,
} from '@app/common/proto/subscriptions';
import { CreateSubscriptionDto } from '@app/common/types';
import { mapGrpcError, validateAndGetDto } from '@app/common/utils';
import { Controller } from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';

@Controller()
@SubscriptionsServiceControllerMethods()
export class SubscriptionsController implements SubscriptionsServiceController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async createSubscription(query: CreateSubscriptionRequest): Promise<Empty> {
    try {
      const dto = await validateAndGetDto(CreateSubscriptionDto, query);
      await this.subscriptionsService.createSubscription(dto);
      return {};
    } catch (err) {
      mapGrpcError(err);
    }
  }

  async confirmSubscription(query: TokenRequest): Promise<Empty> {
    try {
      await this.subscriptionsService.confirmSubscription(query.token);
      return {};
    } catch (err) {
      mapGrpcError(err);
    }
  }

  async unsubscribeSubscription(query: TokenRequest): Promise<Empty> {
    try {
      await this.subscriptionsService.unsubscribeSubscription(query.token);
      return {};
    } catch (err) {
      mapGrpcError(err);
    }
  }
}
