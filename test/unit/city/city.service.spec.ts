import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AbstractCityApiService } from '../../../src/abstracts/city-api.abstract';
import { AbstractCityRepository } from '../../../src/modules/city/abstracts/city.repository.abstract';
import { CityService } from '../../../src/modules/city/city.service';

describe('WeatherNotificationService', () => {
  let service: CityService;

  const mockedCityRepository = {
    createCity: jest.fn(),
    getCity: jest.fn(),
  };

  const mockedCityApiService = {
    isCityExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: AbstractCityRepository,
          useValue: mockedCityRepository,
        },
        {
          provide: AbstractCityApiService,
          useValue: mockedCityApiService,
        },
      ],
    }).compile();
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCity', () => {
    const cityId = 'cityId';

    it('should return cityId if it is in db', async () => {
      mockedCityRepository.getCity.mockResolvedValue({ id: cityId });

      const res = await service.getCityId('city name');

      expect(res).toBe(cityId);
    });

    it('should return cityId and make API call if city is valid and not in db', async () => {
      mockedCityRepository.getCity.mockResolvedValue(undefined);
      mockedCityRepository.createCity.mockResolvedValue({ id: cityId });
      mockedCityApiService.isCityExists.mockResolvedValue(true);

      const res = await service.getCityId('city name');

      expect(res).toBe(cityId);
      expect(mockedCityApiService.isCityExists).toHaveBeenCalled();
    });

    it('should throw error if provided invalid city name', async () => {
      mockedCityRepository.getCity.mockResolvedValue(undefined);
      mockedCityApiService.isCityExists.mockResolvedValue(false);

      await expect(service.getCityId('invalid city name')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
