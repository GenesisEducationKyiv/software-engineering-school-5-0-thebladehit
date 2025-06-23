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

import { ErrorResponseDto } from './dto/error-response.dto';

@Injectable()
export class CityOpenWeatherService implements AbstractCityApiChainService {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(CityOpenWeatherService.name);

  protected next?: AbstractCityApiChainService;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.configService.getOrThrow<string>('OPEN_WEATHER_API_KEY');
    this.baseURL = this.configService.get<string>('OPEN_WEATHER_BASE_URL');
  }

  setNext(next: AbstractCityApiChainService): void {
    this.next = next;
  }

  async isCityExists(name: string): Promise<boolean> {
    try {
      const url = `${this.baseURL}/weather?appid=${this.apiKey}&q=${encodeURIComponent(name)}`;
      await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError<ErrorResponseDto>) => {
            const errorCode = error.response?.data?.cod;
            if (Number(errorCode) === 404) {
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
