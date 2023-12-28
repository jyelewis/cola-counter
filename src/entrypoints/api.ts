import { NestFactory } from '@nestjs/core';
import { ApiModule } from '../modules/api/api.module.js';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  await app.listen(3000);
}
bootstrap().catch(console.error);
