import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/subscribe')
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto);
  }

  @Get('/confirm/:token')
  async confirmSubscription(@Param('token') token: string) {
    await this.subscriptionsService.confirmSubscription(token);
    return 'Subscription confirmed successfully';
  }

  @Get('/unsubscribe/:token')
  async unsubscribeSubscription(@Param('token') token: string) {
    await this.subscriptionsService.unsubscribeSubscription(token);
    return 'Unsubscribed successfully';
  }
}
