import { UserSkillResolver } from './user/user-skill/user-skill.resolver';
import { UserOnboardingInfoResolver } from './user/user-onboarding/user-onboarding.resolver';
import { UserLanguageInfoResolver } from './user/user-language/user-language.resolver';
import { UserEducationInfoResolver } from './user/user-education/user-education.resolver';
import { AitCoreModule, AitAuthModule } from '@ait/core';
import { HttpModule, Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { UserExperienceInfoResolver } from './user/user-experience/user-experience.resolver';

const RESOLVERS = [
  UserExperienceInfoResolver,
  UserEducationInfoResolver,
  UserLanguageInfoResolver,
  UserOnboardingInfoResolver,
  UserSkillResolver,
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
