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

import { AbstractCityApiChainService } from '../abstracts/city-api-chain.abstract';

import { ErrorResponse } from './dto/error-response';

@Injectable()
export class CityWeatherApiService implements AbstractCityApiChainService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(CityWeatherApiService.name);

  protected next?: AbstractCityApiChainService;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('WEATHER_API_BASE_URL');
  }

  setNext(next: AbstractCityApiChainService): void {
    this.next = next;
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
      this.logger.log(`City exists ${name}`);
      return true;
    } catch (err) {
      this.logger.error(err);
      if (this.next) {
        return this.next.isCityExists(name);
      }
      if (err instanceof NotFoundException) {
        return false;
      }
      throw err;
    }
  }
}
