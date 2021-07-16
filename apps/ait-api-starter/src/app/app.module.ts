import { AitCoreModule, AitAuthModule } from '@ait/core';
import { HttpModule, Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { ExampleResolver } from './example-graphql/example.resolver';
import { ExampleRestController } from './example-rest/example-rest.controller';
import { UserController } from './user/user.controller';

const RESOLVERS = [
  ExampleResolver,
  {
  provide: 'ENVIRONMENT',
  useValue: environment
  }
  ];
@Module({
  imports: [
    HttpModule,
    AitCoreModule.forRoot(environment),
    AitAuthModule.forRoot(environment)
  ],
  controllers: [ExampleRestController,],
  providers: [...RESOLVERS, {
    provide: 'ENVIRONMENT',
    useValue: environment
  }],
})
export class AppModule { }
