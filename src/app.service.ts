import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
