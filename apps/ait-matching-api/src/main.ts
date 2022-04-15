/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import { Logger } from '@nestjs/common';
 import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
 
 import { AppModule } from './app/app.module';
 import { environment } from './environments/environment';
 
 async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'rest-api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  const port = environment.APP.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
 
 bootstrap();
 