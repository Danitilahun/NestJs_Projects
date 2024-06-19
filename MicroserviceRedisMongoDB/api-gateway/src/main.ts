/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// For redis docker

// docker pull redis
// docker run --name redis -p 6379:6379 -d redis
// docker exec -it redis redis-cli
