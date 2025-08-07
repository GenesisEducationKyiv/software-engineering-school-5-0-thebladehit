import { Test, TestingModule } from '@nestjs/testing';
import { Subscription, SubscriptionType } from '@prisma/client';

import {
  DuplicateSubscriptionException,
  SubscriptionConfirmedException,
  SubscriptionNotFoundException,
} from '@app/common/errors';
import {
  AbstractEventBus,
  SubscriptionCreatedEvent,
} from '@app/common/event-bus';

import { CityService } from '../../../apps/subscriptions/src/modules/city/city.service';
import { AbstractSubscriptionRepository } from '../../../apps/subscriptions/src/modules/subscriptions/abstracts/subscription.repository.abstract';
import { SubscriptionsService } from '../../../apps/subscriptions/src/modules/subscriptions/subscriptions.service';

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

  const mockedEventBus = {
    publish: jest.fn(),
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
          provide: AbstractEventBus,
          useValue: mockedEventBus,
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
        DuplicateSubscriptionException
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
      expect(mockedEventBus.publish).toHaveBeenCalledWith(
        new SubscriptionCreatedEvent({
          email: dto.email,
          city: dto.city,
          frequency: dto.frequency,
          token: id,
        })
      );
    });
  });

  describe('confirmSubscription', () => {
    const token = 'fake-token';

    it('should throw NotFoundException if subscriptions does not exist', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue(
        null
      );

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        SubscriptionNotFoundException
      );
    });

    it('should throw BadRequestException if subscriptions already confirmed', async () => {
      mockedSubscriptionRepository.findSubscriptionByToken.mockResolvedValue({
        isConfirmed: true,
        id: token,
      } as Subscription);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        SubscriptionConfirmedException
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
        SubscriptionNotFoundException
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
