import { AitCoreModule, AitAuthModule } from '@ait/core';
import { HttpModule, Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { UserExperienceInfoResolver } from './user/user-experience/user-experience.resolver';

const RESOLVERS = [
  UserExperienceInfoResolver,
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
  controllers: [],
  providers: [...RESOLVERS, {
    provide: 'ENVIRONMENT',
    useValue: environment
  }],
})
export class AppModule { }
