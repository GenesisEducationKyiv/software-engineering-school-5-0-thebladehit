import { NestFactory } from '@nestjs/core';
import { SubscriptionsModule } from './subscriptions.module';

async function bootstrap() {
  const app = await NestFactory.create(SubscriptionsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
