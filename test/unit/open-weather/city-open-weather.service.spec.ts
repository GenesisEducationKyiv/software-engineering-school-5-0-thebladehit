import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { CityOpenWeatherService } from '../../../apps/subscriptions/src/modules/open-weather/city-open-weather.service';

describe('CityOpenWeatherService', () => {
  let service: CityOpenWeatherService;

  const mockedConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
    get: jest.fn().mockReturnValue('http://fake-weather-api.com'),
  };

  const mockedHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityOpenWeatherService,
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

    service = module.get(CityOpenWeatherService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if city exists', async () => {
    mockedHttpService.get.mockReturnValue(of({ data: {} }));
    const result = await service.isCityExists('Kyiv');
    expect(result).toBe(true);
  });

  it('should return false if city not found (404)', async () => {
    const axiosError = {
      response: { data: { cod: 404 } },
    };
    mockedHttpService.get.mockReturnValue(throwError(() => axiosError));

    const result = await service.isCityExists('NoSuchCity');
    expect(result).toBe(false);
  });

  it('should throw InternalServerErrorException on other errors', async () => {
    const axiosError = {
      response: { data: { cod: 500 } },
    };
    mockedHttpService.get.mockReturnValue(throwError(() => axiosError));

    await expect(service.isCityExists('AnyCity')).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
