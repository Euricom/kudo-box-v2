import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configSwagger from './config/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configSwagger(app);
  
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({origin: process.env.CLIENT_URL});

  await app.listen(3030);
}
bootstrap();
