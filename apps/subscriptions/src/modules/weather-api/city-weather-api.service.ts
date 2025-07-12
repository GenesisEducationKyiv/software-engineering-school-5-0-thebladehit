import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractCityApiService } from '../../abstracts/city-api.abstract';

import { ErrorResponse } from './dto/error-response';

@Injectable()
export class CityWeatherApiService implements AbstractCityApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(CityWeatherApiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_API_BASE_URL');
  }

  async isCityExists(name: string): Promise<boolean> {
    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(name)}`;
    try {
      const result = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError<ErrorResponse>) => {
            this.logger.error(error.response?.data);
            const errorCode = error.response?.data?.error?.code;
            if (errorCode === 1006) {
              throw new NotFoundException();
            }
            throw new InternalServerErrorException();
          })
        )
      );
      this.logger.log(result.data);
      return true;
    } catch (err) {
      if (err instanceof NotFoundException) {
        return false;
      }
      throw err;
    }
  }
}
