import { CityNotFoundException, UnexpectedError } from '@app/common/errors';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractCityApiService } from '../../abstracts/city-api.abstract';
import { AbstractSubscriptionMetricsService } from '../metrics/abstracts/metrics.service.abstract';

import { ErrorResponseDto } from './dto/error-response.dto';

const providerName = 'OpenWeather.com';

@Injectable()
export class CityOpenWeatherService implements AbstractCityApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(CityOpenWeatherService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly metricsService: AbstractSubscriptionMetricsService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('OPEN_WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('OPEN_WEATHER_BASE_URL');
  }

  async isCityExists(name: string): Promise<boolean> {
    try {
      const url = `${this.baseURL}/weather?appid=${this.apiKey}&q=${encodeURIComponent(name)}`;
      this.metricsService.incExternalRequest(providerName);
      const result = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError<ErrorResponseDto>) => {
            this.logger.warn(error.response?.data);
            const errorCode = error.response?.data?.cod;
            if (Number(errorCode) === 404) {
              throw new CityNotFoundException(name);
            }
            throw new UnexpectedError();
          })
        )
      );
      this.logger.log(JSON.stringify(result.data));
      return true;
    } catch (err) {
      if (err instanceof CityNotFoundException) {
        return false;
      }
      throw err;
    }
  }
}
