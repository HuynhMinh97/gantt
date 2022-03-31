import { GroupRoleListResolver } from './group-role/group-role-list/group-role-list.resolver';
import { UserSkillResolver } from './user/user-skill/user-skill.resolver';
import { UserOnboardingInfoResolver } from './user/user-onboarding/user-onboarding.resolver';
import { UserLanguageInfoResolver } from './user/user-language/user-language.resolver';
import { UserEducationInfoResolver } from './user/user-education/user-education.resolver';
import { AitCoreModule, AitAuthModule } from '@ait/core';
import { HttpModule, Module } from '@nestjs/common';
import { environment } from '../environments/environment';
import { UserExperienceInfoResolver } from './user/user-experience/user-experience.resolver';
import { CourseResolver } from './user/user-course/user_course.resolver';
import { UserCertificateResolver } from './user/user-certificate/user_certificate.resolver';
import { UserProjectResolver } from './user/user-project/user-project.resolver';
import { ReorderSkillResolver } from './user/user-reorder-skills/reorder-skill.resolver';
import { UserProfileResolver } from './user/user-profile/user-profile.resolver';
import { UserJobAlertResolver } from './user/user-job-alert/user_job_alert.resolver';
import { SkillListResolver } from './list/skillList/skill-List/skill_list.resolver';
import { SkillRegisterResolver } from './list/skillList/add-skill/add-skill.resolver';
import { ProjectListResolver } from './list/projectList/project-list.resolver';
import { LanguageListResolver } from './list/language-list.ts/language-list.resolver';
import { EducationListResolver } from './list/education-list/education-list.resolver';
import { CertificateResolver } from './list/certificate-list/certificate-list.resolver';
import { GetEmployeeResolver } from './group-role/add-role/add-role.resolver';

const RESOLVERS = [
  UserExperienceInfoResolver,
  UserEducationInfoResolver,
  UserLanguageInfoResolver,
  UserOnboardingInfoResolver,
  UserSkillResolver,
  UserProjectResolver,
  UserCertificateResolver,
  CourseResolver,
  ReorderSkillResolver,
  UserProfileResolver,
  UserJobAlertResolver,
  SkillListResolver,
  SkillRegisterResolver,
  ProjectListResolver,
  LanguageListResolver,
  EducationListResolver,
  CertificateResolver,
  GetEmployeeResolver,
  GroupRoleListResolver,
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
