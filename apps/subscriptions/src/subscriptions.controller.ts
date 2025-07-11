import { Controller, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  getHello(): string {
    return this.subscriptionsService.getHello();
  }
}
