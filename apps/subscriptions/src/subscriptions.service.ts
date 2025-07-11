import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
