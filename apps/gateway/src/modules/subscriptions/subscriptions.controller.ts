import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateSubscriptionDto, StatusResponseDto } from '@app/common/types';

import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Post('/subscribe')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<void> {
    return this.service.createSubscription(dto);
  }

  @Get('/confirm/:token')
  confirmSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    return this.service.confirmSubscription(token);
  }

  @Get('/unsubscribe/:token')
  unsubscribeSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    return this.service.unsubscribeSubscription(token);
  }
}
