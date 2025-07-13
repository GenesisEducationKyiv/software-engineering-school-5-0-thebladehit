import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AbstractNotificationsService } from './abstracts/notifications.abstract';
import { NotificationsHttpService } from './notifications.http-service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: AbstractNotificationsService,
      useClass: NotificationsHttpService,
    },
  ],
  exports: [AbstractNotificationsService],
})
export class NotificationsModule {}
