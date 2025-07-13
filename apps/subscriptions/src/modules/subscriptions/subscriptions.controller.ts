import { CreateSubscriptionDto, StatusResponseDto } from '@app/common/types';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/subscribe')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<void> {
    return this.subscriptionsService.createSubscription(dto);
  }

  @Get('/confirm/:token')
  async confirmSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    await this.subscriptionsService.confirmSubscription(token);
    return { status: 'ok', message: 'Subscription confirmed successfully' };
  }

  @Get('/unsubscribe/:token')
  async unsubscribeSubscription(
    @Param('token') token: string
  ): Promise<StatusResponseDto> {
    await this.subscriptionsService.unsubscribeSubscription(token);
    return { status: 'ok', message: 'Unsubscribed successfully' };
  }
}
