import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

describe('Weather endpoints (Integration tests)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
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
