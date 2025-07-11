import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  getHello(): string {
    return 'Hello World!';
  }
}
