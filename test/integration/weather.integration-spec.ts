import { execSync } from 'child_process';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { AppModule } from '../../src/modules/app.module';
import { AbstractMailService } from '../../src/modules/mail/abstracts/mail.service.abstract';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

jest.setTimeout(30000);

describe('Weather endpoints (Integration tests)', () => {
  // let container: StartedTestContainer;
  let app: INestApplication;
  // let prisma: PrismaService;

  // const mockedMailService = {
  //   sendSubscriptionConfirmation: jest.fn(),
  // };

  // beforeAll(async () => {
  //   container = await new GenericContainer('postgres')
  //     .withEnvironment({
  //       POSTGRES_USER: 'test',
  //       POSTGRES_PASSWORD: 'test',
  //       POSTGRES_DB: 'test',
  //     })
  //     .withExposedPorts(5432)
  //     .start();
  //
  //   process.env.DATABASE_URL = `postgresql://test:test@${container.getHost()}:${container.getMappedPort(5432)}/test`;
  //
  //   execSync('npm run prisma:migrate:deploy', {
  //     env: process.env,
  //   });
  // });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();

    // prisma = app.get(PrismaService);
  });

  // afterEach(async () => {
  //   await prisma.subscription.deleteMany();
  //   await prisma.city.deleteMany();
  //   await prisma.user.deleteMany();
  // });

  afterAll(async () => {
    await app.close();
    // await prisma.$disconnect();
    // await container.stop();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/weather (GET)', () => {
    it('should return weather data for a valid city', async () => {
      const response = await request(app.getHttpServer())
        .get('/weather')
        .query({ city: 'Kyiv' })
        .expect(200);

      expect(response.body).toHaveProperty('temperature');
      expect(response.body).toHaveProperty('humidity');
      expect(response.body).toHaveProperty('description');
    });
  });

  it('should return 400 for missing city param', async () => {
    const response = await request(app.getHttpServer())
      .get('/weather')
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('should return 404 for invalid city value', async () => {
    const response = await request(app.getHttpServer())
      .get('/weather')
      .query({ city: 'fffffdaf' })
      .expect(404);

    expect(response.body.message).toBeDefined();
  });
});
