import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { CityOpenWeatherProvider } from '../../apps/subscriptions/src/modules/city/chain-providers/city-open-weather.provider';
import { CityWeatherApiProvider } from '../../apps/subscriptions/src/modules/city/chain-providers/city-weather-api.provider';
import { CityApiChainService } from '../../apps/subscriptions/src/modules/city/city-api-chain.service';
import { CityOpenWeatherService } from '../../apps/subscriptions/src/modules/open-weather/city-open-weather.service';
import { CityWeatherApiService } from '../../apps/subscriptions/src/modules/weather-api/city-weather-api.service';

const mockedConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test-api-key'),
  get: jest.fn().mockReturnValue('http://fake-weather-api.com'),
};

const mockedHttpService = {
  get: jest.fn(),
};

const city = 'fake city';

describe('CityApiChainService', () => {
  let service: CityApiChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityApiChainService,
        CityWeatherApiProvider,
        CityOpenWeatherProvider,
        CityWeatherApiService,
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

    service = module.get(CityApiChainService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isCityExists', () => {
    it('should return true from first provider if city exists', async () => {
      const mockResponse = {
        data: {},
      };

      mockedHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.isCityExists(city);

      expect(result).toBe(true);
      expect(mockedHttpService.get).toHaveBeenCalled();
    });

    it('should return true from second provider if city exists', async () => {
      const axiosError = {
        response: {
          data: {
            error: { code: 1006 },
          },
        },
      };

      mockedHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      mockedHttpService.get.mockReturnValue(of({ data: {} }));

      const result = await service.isCityExists(city);

      expect(result).toBe(true);
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should return false when city does not exist', async () => {
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: {
            data: {
              error: { code: 1006 },
            },
          },
        }))
      );
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { cod: 404 } },
        }))
      );

      const result = await service.isCityExists('InvalidCity');
      expect(result).toBe(false);
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });
  });
});
