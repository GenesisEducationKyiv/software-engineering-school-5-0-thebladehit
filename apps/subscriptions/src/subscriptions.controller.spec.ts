import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsController', () => {
  let subscriptionsController: SubscriptionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [SubscriptionsService],
    }).compile();

    subscriptionsController = app.get<SubscriptionsController>(SubscriptionsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(subscriptionsController.getHello()).toBe('Hello World!');
    });
  });
});
