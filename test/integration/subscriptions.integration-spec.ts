import { execSync } from 'child_process';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionType } from '@prisma/client';
import * as request from 'supertest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { AppModule } from '../../src/modules/app.module';
import { AbstractMailService } from '../../src/modules/mail/abstracts/mail.service.abstract';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

jest.setTimeout(30000);

describe('Subscriptions endpoints (Integration tests)', () => {
  let container: StartedTestContainer;
  let app: INestApplication;
  let prisma: PrismaService;

  const mockedMailService = {
    sendSubscriptionConfirmation: jest.fn(),
  };

  beforeAll(async () => {
    container = await new GenericContainer('postgres')
      .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'test',
      })
      .withExposedPorts(5432)
      .start();

    process.env.DATABASE_URL = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;

    execSync('npm run prisma:migrate:deploy', {
      env: process.env,
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AbstractMailService)
      .useValue(mockedMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.city.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    await container.stop();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/subscribe (POST)', () => {
    it('should create subscription', async () => {
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
