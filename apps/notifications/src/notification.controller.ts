import { Controller, Get } from '@nestjs/common';

import { AbstractNotificationService } from './abstracts/notification.service.abstract';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: AbstractNotificationService
  ) {}

  @Get()
  hello(): string {
    return 'hello';
  }
}
