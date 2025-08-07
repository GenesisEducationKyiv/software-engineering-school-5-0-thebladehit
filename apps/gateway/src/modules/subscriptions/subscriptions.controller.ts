import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateSubscriptionDto, StatusResponseDto } from '@app/common/types';
import { mapGrpcToHttpError } from '@app/common/utils';

import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Post('/subscribe')
  async createSubscription(@Body() dto: CreateSubscriptionDto): Promise<void> {
    try {
      return await this.service.createSubscription(dto);
    } catch (err) {
      mapGrpcToHttpError(err);
    }
  }

  @Get('/confirm/:token')
  async confirmSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    try {
      return await this.service.confirmSubscription(token);
    } catch (err) {
      mapGrpcToHttpError(err);
    }
  }

  @Get('/unsubscribe/:token')
  async unsubscribeSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    try {
      return await this.service.unsubscribeSubscription(token);
    } catch (err) {
      mapGrpcToHttpError(err);
    }
  }
}
