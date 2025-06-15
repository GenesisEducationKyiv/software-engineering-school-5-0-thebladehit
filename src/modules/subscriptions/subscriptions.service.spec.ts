import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Subscription, SubscriptionType } from '@prisma/client';

import { CityService } from '../city/city.service';
import { AbstractMailService } from '../mail/abstracts/mail.service.abstract';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionWithUserAndCity } from './types/subscription-with-user-city';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: jest.Mocked<AbstractSubscriptionRepository>;
  let mailService: jest.Mocked<AbstractMailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: AbstractSubscriptionRepository,
          useValue: {
            isDuplicateSubscription: jest.fn(),
            createSubscription: jest.fn(),
            getSubscriptions: jest.fn(),
            findSubscriptionByToken: jest.fn(),
            confirmSubscription: jest.fn(),
            deleteSubscription: jest.fn(),
          },
        },
        {
          provide: AbstractMailService,
          useValue: {
            sendSubscriptionConfirmation: jest.fn(),
          },
        },
        {
          provide: CityService,
          useValue: {
            validateCity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
    repository = module.get(AbstractSubscriptionRepository);
    mailService = module.get(AbstractMailService);
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
      repository.isDuplicateSubscription.mockResolvedValue(true);

      await expect(service.createSubscription(dto)).rejects.toThrow(
        ConflictException
      );
    });

    it('should create subscriptions and send confirmation email', async () => {
      repository.isDuplicateSubscription.mockResolvedValue(false);
      repository.createSubscription.mockResolvedValue({
        id: 'token123',
      } as Subscription);

      await service.createSubscription(dto);

      expect(repository.createSubscription).toHaveBeenCalledWith(dto);
      expect(mailService.sendSubscriptionConfirmation).toHaveBeenCalledWith({
        email: dto.email,
        city: dto.city,
        frequency: dto.frequency,
        token: 'token123',
      });
    });
  });

  describe('confirmSubscription', () => {
    const token = 'fake-token';

    it('should throw NotFoundException if subscriptions does not exist', async () => {
      repository.findSubscriptionByToken.mockResolvedValue(null);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if subscriptions already confirmed', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        isConfirmed: true,
        id: token,
      } as Subscription);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should confirm subscriptions', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.confirmSubscription(token);

      expect(repository.confirmSubscription).toHaveBeenCalledWith(token);
    });
  });

  describe('unsubscribeSubscription', () => {
    const token = 'fake-token';

    it('should throw NotFoundException if subscriptions does not exist', async () => {
      repository.findSubscriptionByToken.mockResolvedValue(null);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should delete subscriptions', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.unsubscribeSubscription(token);

      expect(repository.deleteSubscription).toHaveBeenCalledWith(token);
    });
  });

  describe('deleteSubscription', () => {
    const token = 'fake-token';

    it('should delete subscriptions', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.deleteSubscription(token);

      expect(repository.deleteSubscription).toHaveBeenCalledWith(token);
    });
  });

  describe('getDailySubscribers', () => {
    it('should call repository with SubscriptionType.DAILY and return daily subscriptions', async () => {
      const mockSubscriptions: SubscriptionWithUserAndCity[] = [
        {
          id: '1',
          city: {
            name: 'city',
          },
          type: SubscriptionType.DAILY,
          isConfirmed: true,
          user: {
            email: 'email',
          },
          createdAt: new Date(),
          cityId: '1',
          userId: '1',
        },
      ];

      repository.getSubscriptions.mockResolvedValue(mockSubscriptions);

      const result = await service.getDailySubscribers();

      expect(repository.getSubscriptions).toHaveBeenCalledWith(
        SubscriptionType.DAILY
      );
      expect(result).toEqual(mockSubscriptions);
    });
  });

  describe('getHourlySubscribers', () => {
    it('should call repository with SubscriptionType.HOURLY and return hourly subscriptions', async () => {
      const mockSubscriptions: SubscriptionWithUserAndCity[] = [
        {
          id: '1',
          city: {
            name: 'city',
          },
          type: SubscriptionType.DAILY,
          isConfirmed: true,
          user: {
            email: 'email',
          },
          createdAt: new Date(),
          cityId: '1',
          userId: '1',
        },
      ];

      repository.getSubscriptions.mockResolvedValue(mockSubscriptions);

      const result = await service.getHourlySubscribers();

      expect(repository.getSubscriptions).toHaveBeenCalledWith(
        SubscriptionType.HOURLY
      );
      expect(result).toEqual(mockSubscriptions);
    });
  });
});
