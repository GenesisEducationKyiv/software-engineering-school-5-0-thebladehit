import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';

import { ErrorResponse } from './dto/error-response';

@Injectable()
export class CityWeatherApiService implements AbstractCityApiService {
  private readonly baseURL: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_BASE_URL');
  }

  async isCityExists(name: string): Promise<boolean> {
    const url = `${this.baseURL}/current.json?key=${this.apiKey}&q=${encodeURIComponent(name)}`;
    try {
      await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError<ErrorResponse>) => {
            const errorCode = error.response?.data?.error?.code;
            if (errorCode === 1006) {
              throw new NotFoundException();
            }
            throw new InternalServerErrorException();
          })
        )
      );
      return true;
    } catch (err) {
      if (err instanceof NotFoundException) {
        return false;
      }
      throw err;
    }
  }
}
