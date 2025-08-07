import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { UnexpectedError } from '@app/common/errors';

import { MetricsModule } from '../../../apps/subscriptions/src/modules/metrics/metrics.module';
import { CityWeatherApiService } from '../../../apps/subscriptions/src/modules/weather-api/city-weather-api.service';

describe('CityWeatherApiService', () => {
  let service: CityWeatherApiService;

  const mockedConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
    get: jest.fn().mockReturnValue('http://fake-weather-api.com'),
  };

  const mockedHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
      providers: [
        CityWeatherApiService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: HttpService,
          useValue: mockedHttpService,
        },
      ],
    }).compile();

    service = module.get(CityWeatherApiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when city exists', async () => {
    const mockResponse = {
      data: {},
    };

    mockedHttpService.get.mockReturnValue(of(mockResponse));

    const result = await service.isCityExists('Kyiv');

    expect(result).toBe(true);
    expect(mockedHttpService.get).toHaveBeenCalled();
  });

  it('should return false when city does not exist', async () => {
    const axiosError = {
      response: {
        data: {
          error: { code: 1006 },
        },
      },
    };
    mockedHttpService.get.mockReturnValue(throwError(() => axiosError));

    const result = await service.isCityExists('InvalidCity');

    expect(result).toBe(false);
  });

  it('should throw InternalServerErrorException on other error codes', async () => {
    const axiosError = {
      response: {
        data: {
          error: { code: 9999 },
        },
      },
    };

    mockedHttpService.get.mockReturnValue(throwError(() => axiosError));

    await expect(service.isCityExists('SomeCity')).rejects.toThrow(
      UnexpectedError
    );
  });
});
