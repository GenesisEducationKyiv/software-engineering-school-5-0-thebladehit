import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionType } from '@prisma/client';
import { config as loadEnv } from 'dotenv';
import * as request from 'supertest';

loadEnv({ path: '.env.test' });
import { AbstractMailService } from '../../src/modules/mail/abstracts/mail.service.abstract';
import { CityOpenWeatherService } from '../../src/modules/open-weather/city-open-weather.service';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { SubscriptionsModule } from '../../src/modules/subscriptions/subscriptions.module';
import { CityWeatherApiService } from '../../src/modules/weather-api/city-weather-api.service';

describe('Subscriptions endpoints (Integration tests)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cityWeatherApiService: jest.Mocked<CityWeatherApiService>;
  let cityOpenWeatherService: jest.Mocked<CityOpenWeatherService>;

  const mockedMailService = {
    sendSubscriptionConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SubscriptionsModule],
    })
      .overrideProvider(AbstractMailService)
      .useValue(mockedMailService)
      .overrideProvider(CityWeatherApiService)
      .useValue({
        isCityExists: jest.fn(),
      })
      .overrideProvider(CityOpenWeatherService)
      .useValue({
        isCityExists: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();

    prisma = app.get(PrismaService);
    cityWeatherApiService = app.get(CityWeatherApiService);
    cityOpenWeatherService = app.get(CityOpenWeatherService);
  });

  afterEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.city.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/subscribe (POST)', () => {
    it('should create subscription', async () => {
      cityWeatherApiService.isCityExists.mockResolvedValue(true);

      const payload = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'DAILY',
      };

      const response = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('should return 409 status due to duplicate subscription', async () => {
      cityWeatherApiService.isCityExists.mockResolvedValue(true);

      const payload = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'DAILY',
      };

      const successResponse = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(200);

      expect(successResponse.body).toEqual({});

      const failedResponse = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(409);

      expect(failedResponse.body.message).toEqual(
        'You already subscribed to this city.'
      );
    });

    it('should return BadRequest due to incorrect payload ', async () => {
      const invalidPayload = {
        email: 'not-an-email',
        city: '',
        frequency: 'invalid',
      };

      const response = await request(app.getHttpServer())
        .post('/subscribe')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return BadRequest due to incorrect city ', async () => {
      cityWeatherApiService.isCityExists.mockResolvedValue(false);
      cityOpenWeatherService.isCityExists.mockResolvedValue(false);

      const payload = {
        email: 'test@example.com',
        city: 'fdsfdsfsfs',
        frequency: 'DAILY',
      };

      const response = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(404);

      expect(response.body.message).toEqual(`City ${payload.city} not found`);
    });
  });

  describe('/confirm/:token (GET)', () => {
    it('should create and confirm subscription', async () => {
      cityWeatherApiService.isCityExists.mockResolvedValue(true);

      const payload = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'DAILY',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(200);

      expect(createResponse.body).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: {
          user: {
            email: payload.email,
          },
          city: {
            name: payload.city,
          },
          type: payload.frequency as SubscriptionType,
        },
        select: {
          id: true,
        },
      });

      const confirmResponse = await request(app.getHttpServer())
        .get(`/confirm/${subscription.id}`)
        .expect(200);

      expect(confirmResponse.body).toEqual({
        status: 'ok',
        message: 'Subscription confirmed successfully',
      });
    });

    it('should return 404 if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/confirm/invalidToken}')
        .expect(404);

      expect(response.body.message).toEqual(
        'Subscription with such id does not exist'
      );
    });

    it('should return BadRequest if subscription is confirmed', async () => {
      cityOpenWeatherService.isCityExists.mockResolvedValue(true);

      const payload = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'DAILY',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(200);

      expect(createResponse.body).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: {
          user: {
            email: payload.email,
          },
          city: {
            name: payload.city,
          },
          type: payload.frequency as SubscriptionType,
        },
        select: {
          id: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/confirm/${subscription.id}`)
        .expect(200);

      const failedResponse = await request(app.getHttpServer())
        .get(`/confirm/${subscription.id}`)
        .expect(400);

      expect(failedResponse.body.message).toEqual(
        'You have already confirm this subscriptions'
      );
    });
  });

  describe('/unsubscribe/:token (GET)', () => {
    it('should create and delete(unsubscribe) subscription', async () => {
      cityOpenWeatherService.isCityExists.mockResolvedValue(true);

      const payload = {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'DAILY',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/subscribe')
        .send(payload)
        .expect(200);

      expect(createResponse.body).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: {
          user: {
            email: payload.email,
          },
          city: {
            name: payload.city,
          },
          type: payload.frequency as SubscriptionType,
        },
        select: {
          id: true,
        },
      });

      const unsubscribeResponse = await request(app.getHttpServer())
        .get(`/unsubscribe/${subscription.id}`)
        .expect(200);

      expect(unsubscribeResponse.body).toEqual({
        status: 'ok',
        message: 'Unsubscribed successfully',
      });
    });

    it('should return 404 if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/unsubscribe/invalidToken}')
        .expect(404);

      expect(response.body.message).toEqual(
        'Subscription with such id does not exist'
      );
    });
  });
});
