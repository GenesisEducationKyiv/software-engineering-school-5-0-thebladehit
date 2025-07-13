import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { CreateSubscriptionDto, StatusResponseDto } from '@app/common/types';

@Injectable()
export class SubscriptionsService {
  private readonly subscriptionUrl: string;
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.subscriptionUrl = this.configService.get('SUBSCRIPTION_URL');
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<void> {
    try {
      const url = `${this.subscriptionUrl}/subscribe`;
      await firstValueFrom(this.httpService.post(url, dto));
      return;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          this.logger.error('Subscription service in not reachable');
        } else if (err.status >= 400 && err.status < 500) {
          throw new HttpException(err.response?.data, err.status);
        }
      }
      throw err;
    }
  }

  async confirmSubscription(token: string): Promise<StatusResponseDto> {
    try {
      const url = `${this.subscriptionUrl}/confirm/${token}`;
      const response = await firstValueFrom(
        this.httpService.get<StatusResponseDto>(url)
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          this.logger.error('Subscription service in not reachable');
        } else if (err.status >= 400 && err.status < 500) {
          throw new HttpException(err.response?.data, err.status);
        }
      }
      throw err;
    }
  }

  async unsubscribeSubscription(token: string): Promise<StatusResponseDto> {
    try {
      const url = `${this.subscriptionUrl}/unsubscribe/${token}`;
      const response = await firstValueFrom(
        this.httpService.get<StatusResponseDto>(url)
      );
      return response.data;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          this.logger.error('Subscription service in not reachable');
        } else if (err.status >= 400 && err.status < 500) {
          throw new HttpException(err.response?.data, err.status);
        }
      }
      throw err;
    }
  }
}
