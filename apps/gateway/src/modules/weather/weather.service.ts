import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { WeatherResponseDto } from '@app/common/types';

@Injectable()
export class WeatherService {
  private readonly weatherUrl: string;
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.weatherUrl = this.configService.get('WEATHER_URL');
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      const url = `${this.weatherUrl}?city=${city}`;
      const response = await firstValueFrom(
        this.httpService.get<WeatherResponseDto>(url)
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
