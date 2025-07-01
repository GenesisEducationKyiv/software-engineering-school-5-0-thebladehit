import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Subscription, SubscriptionType } from '@prisma/client';

import { CityService } from '../../../src/modules/city/city.service';
import { AbstractMailService } from '../../../src/modules/mail/abstracts/mail.service.abstract';
import { AbstractSubscriptionRepository } from '../../../src/modules/subscriptions/abstracts/subscription.repository.abstract';
import { SubscriptionsService } from '../../../src/modules/subscriptions/subscriptions.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  const mockedSubscriptionRepository = {
    isDuplicateSubscription: jest.fn(),
    createSubscription: jest.fn(),
    getSubscriptions: jest.fn(),
    findSubscriptionByToken: jest.fn(),
    confirmSubscription: jest.fn(),
    deleteSubscription: jest.fn(),
  };

  const mockedMailService = {
    sendSubscriptionConfirmation: jest.fn(),
  };

  const mockedCityService = {
    getCityId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: AbstractSubscriptionRepository,
          useValue: mockedSubscriptionRepository,
        },
        {
          provide: AbstractMailService,
          useValue: mockedMailService,
        },
        {
          provide: CityService,
          useValue: mockedCityService,
        },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscription', () => {
    const dto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: SubscriptionType.DAILY,
    };

    it('should throw ConflictException if subscriptions already exists', async () => {
      mockedSubscriptionRepository.isDuplicateSubscription.mockResolvedValue(
        true
      );

      await expect(service.createSubscription(dto)).rejects.toThrow(
        ConflictException
      );
    });

    it('should create subscriptions and send confirmation email', async () => {
      const id = 'id-123';

      mockedSubscriptionRepository.isDuplicateSubscription.mockResolvedValue(
        false
      );
      mockedSubscriptionRepository.createSubscription.mockResolvedValue({
        id,
      } as Subscription);
      mockedCityService.getCityId.mockResolvedValue('cityId');

      await service.createSubscription(dto);

      expect(
        mockedSubscriptionRepository.createSubscription
      ).toHaveBeenCalledWith(dto, 'cityId');
      expect(
        mockedMailService.sendSubscriptionConfirmation
      ).toHaveBeenCalledWith({
        email: dto.email,
        city: dto.city,
        frequency: dto.frequency,
        token: id,
      });
    });
  });

  describe('confirmSubscription', () => {
    const token = 'fake-token';

    it('should throw NotFoundException if subscriptions does not exist', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue(
        null
      );

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if subscriptions already confirmed', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue({
        isConfirmed: true,
        id: token,
      } as Subscription);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should confirm subscriptions', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.confirmSubscription(token);

      expect(
        mockedSubscriptionRepository.confirmSubscription
      ).toHaveBeenCalledWith(token);
    });
  });

  describe('unsubscribeSubscription', () => {
    const token = 'fake-token';

    it('should throw NotFoundException if subscriptions does not exist', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue(
        null
      );

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should delete subscriptions', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.unsubscribeSubscription(token);

      expect(
        mockedSubscriptionRepository.deleteSubscription
      ).toHaveBeenCalledWith(token);
    });
  });
});
