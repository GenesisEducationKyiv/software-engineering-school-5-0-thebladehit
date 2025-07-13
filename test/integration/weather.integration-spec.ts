import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { OpenWeatherService } from '../../apps/weather/src/modules/open-weather/open-weather.service';
import { WeatherModule } from '../../apps/weather/src/modules/weather/weather.module';
import { WeatherAPIService } from '../../apps/weather/src/modules/weather-api/weather-api.service';

describe('Weather endpoints (Integration tests)', () => {
  let app: INestApplication;
  let weatherApiService: jest.Mocked<WeatherAPIService>;
  let openWeatherService: jest.Mocked<OpenWeatherService>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    })
      .overrideProvider(WeatherAPIService)
      .useValue({
        getWeather: jest.fn(),
      })
      .overrideProvider(OpenWeatherService)
      .useValue({
        getWeather: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();

    weatherApiService = app.get(WeatherAPIService);
    openWeatherService = app.get(OpenWeatherService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/weather (GET)', () => {
    it('should return weather data for a valid city', async () => {
      weatherApiService.getWeather.mockResolvedValue({
        temperature: 10,
        humidity: 10,
        description: 'Sunny',
      });

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
    weatherApiService.getWeather.mockRejectedValue(new NotFoundException());
    openWeatherService.getWeather.mockRejectedValue(new NotFoundException());

    const response = await request(app.getHttpServer())
      .get('/weather')
      .query({ city: 'invalidCity' })
      .expect(404);

    expect(response.body.message).toBeDefined();
  });

  it('should return data from cache if in cache', async () => {
    weatherApiService.getWeather.mockResolvedValueOnce({
      temperature: 10,
      humidity: 10,
      description: 'Sunny',
    });

    await request(app.getHttpServer())
      .get('/weather')
      .query({ city: 'Kyiv' })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/weather')
      .query({ city: 'Kyiv' })
      .expect(200);

    expect(response.body).toHaveProperty('temperature');
    expect(response.body).toHaveProperty('humidity');
    expect(response.body).toHaveProperty('description');
  });
});
