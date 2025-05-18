import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionRepository } from './contracts/subscription.repository';
import { MailService } from '../mail/contracts/mail.service';
import { Subscription, SubscriptionType } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: jest.Mocked<SubscriptionRepository>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: SubscriptionRepository,
          useValue: {
            findDuplicateSubscription: jest.fn(),
            createSubscription: jest.fn(),
            getSubscription: jest.fn(),
            findSubscriptionByToken: jest.fn(),
            confirmSubscription: jest.fn(),
            deleteSubscription: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendSubscriptionConfirmation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
    repository = module.get(SubscriptionRepository);
    mailService = module.get(MailService);
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

    it('should throw ConflictException if subscription already exists', async () => {
      repository.findDuplicateSubscription.mockResolvedValue({
        id: '123',
      } as any);

      await expect(service.createSubscription(dto)).rejects.toThrow(
        ConflictException
      );
    });

    it('should create subscription and send confirmation email', async () => {
      repository.findDuplicateSubscription.mockResolvedValue(null);
      repository.createSubscription.mockResolvedValue({
        id: 'token123',
      } as any);

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

    it('should throw NotFoundException if subscription does not exist', async () => {
      repository.findSubscriptionByToken.mockResolvedValue(null);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if subscription already confirmed', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        isConfirmed: true,
        id: token,
      } as Subscription);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should confirm subscription', async () => {
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

    it('should throw NotFoundException if subscription does not exist', async () => {
      repository.findSubscriptionByToken.mockResolvedValue(null);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should delete subscription', async () => {
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

    it('should delete subscription', async () => {
      repository.findSubscriptionByToken.mockResolvedValue({
        id: token,
        isConfirmed: false,
      } as Subscription);

      await service.deleteSubscription(token);

      expect(repository.deleteSubscription).toHaveBeenCalledWith(token);
    });
  });

  describe('getDailySubscribers', () => {
    it('should call repository with SubscriptionType.DAILY and return daily subscription', async () => {
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          city: 'Kyiv',
          type: SubscriptionType.DAILY,
          isConfirmed: true,
          userId: 'u1',
          createdAt: new Date(),
        },
      ];

      repository.getSubscription.mockResolvedValue(mockSubscriptions);

      const result = await service.getDailySubscribers();

      expect(repository.getSubscription).toHaveBeenCalledWith(
        SubscriptionType.DAILY
      );
      expect(result).toEqual(mockSubscriptions);
    });
  });

  describe('getHourlySubscribers', () => {
    it('should call repository with SubscriptionType.HOURLY and return hourly subscription', async () => {
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          city: 'Kyiv',
          type: SubscriptionType.HOURLY,
          isConfirmed: true,
          userId: 'u1',
          createdAt: new Date(),
        },
      ];

      repository.getSubscription.mockResolvedValue(mockSubscriptions);

      const result = await service.getHourlySubscribers();

      expect(repository.getSubscription).toHaveBeenCalledWith(
        SubscriptionType.HOURLY
      );
      expect(result).toEqual(mockSubscriptions);
    });
  });
});
