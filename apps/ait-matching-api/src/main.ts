/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import { Logger } from '@nestjs/common';
 import { NestFactory } from '@nestjs/core';
 
 import { AppModule } from './app/app.module';
 import { environment } from './environments/environment';
 
 async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   const globalPrefix = environment.APP.API_PREFIX;
   app.setGlobalPrefix(globalPrefix);
   const port = environment.APP.PORT || 3000;
   await app.listen(port, () => {
     Logger.log('Listening at http://localhost:' + port + globalPrefix);
   });
   setInterval(() => {
     Logger.log('Create log');
   }, 86400000);
 }
 
 bootstrap();
 