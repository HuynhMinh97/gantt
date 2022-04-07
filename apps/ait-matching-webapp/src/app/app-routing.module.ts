import { GroupRoleListComponent } from './pages/group-role/group-role-list/group-role-list.component';
import { GroupRoleRegisterComponent } from './pages/group-role/group-role-register/group-role-register.component';
import { UserOnboardingComponent } from './pages/user/user-onboarding/user-onboarding.component';
import { UserLanguageComponent } from './pages/user/user-language/user-language.component';
import { UserEducationComponent } from './pages/user/user-education/user-education.component';
import { UserExperienceComponent } from './pages/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService } from '@ait/ui';
import { RecommencedUserComponent } from './pages/recommenced-user/recommenced-user.component';
import { UserCourseComponent } from './pages/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/user/user-skills/user-skills.component';
import { UserReorderSkillsComponent } from './pages/user/user-reorder-skills/user-reorder-skills.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { UserJobAlertComponent } from './pages/user/user-job-alert/user-job-alert.component';
import { UserLanguageDetailComponent } from './pages/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/user/user-education-detail/user-education-detail.component';
import { UserExperienceDetailComponent } from './pages/user/user-experience-detail/user-experience-detail.component';
import { UserOnboardingDetailComponent } from './pages/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/user/user-project/user-project.component';
import { ProjectListComponent } from './pages/list/project-list/project-list.component';
import { SkillListViewComponent } from './pages/list/skill-list/skill-list-view/skill-list-view.component';
import { CertificateListComponent } from './pages/list/certificate-list/certificate-list.component';
import { EducationListComponent } from './pages/list/education-list/education-list.component';
import { UserCertificateDetailComponent } from './pages/user/user-certificate-detail/user-certificate-detail.component';
import { UserProjectDetailComponent } from './pages/user/user-project-detail/user-project-detail.component';
import { UserCourseDetailComponent } from './pages/user/user-course-detail/user-course-detail.component';
import { LanguageListComponent } from './pages/list/language-list/language-list.component';
import { RecommencedJobComponent } from './pages/recommenced/recommenced-job/recommenced-job.component';
import { AddRoleComponent } from './pages/group-role/add-role/add-role.component';
import { MyProjectQueriesComponent } from './pages/my-project-queries/my-project-queries.component';


// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'recommenced-user',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: RecommencedUserComponent
  }, 
  {
    path: 'recommenced-job',
    canActivate: [AitAuthGuardService],
    component: RecommencedJobComponent
  },
  {
    path: 'user',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent
  },
  {
    path: 'user-skills',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserSkillsComponent
  },
  {
    path: 'user/:id',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent
  },
  {
    path: 'user-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingDetailComponent
  },
  {
    path: 'user-course',
    canActivate: [AitAuthGuardService], 
    component: UserCourseComponent
  },
  {
    path: 'user-course/:id',
    canActivate: [AitAuthGuardService], 
    component: UserCourseComponent
  },
  {
    path: 'user-course-detail/:id',
    canActivate: [AitAuthGuardService], 
    component: UserCourseDetailComponent
  },
  {
    path: 'user-certificate-award',
    canActivate: [AitAuthGuardService], 
    component: UserCertificateComponent
  },
  {
    path: 'user-certificate-award/:id',
    canActivate: [AitAuthGuardService], 
    component: UserCertificateComponent
  },
  {
    path: 'user-certificate-award-detail/:id',
    canActivate: [AitAuthGuardService], 
    component: UserCertificateDetailComponent
  },
  {
    path: 'user-project',
    canActivate: [AitAuthGuardService], 
    component: UserProjectComponent
  },
  {
    path: 'user-project/:id',
    canActivate: [AitAuthGuardService], 
    component: UserProjectComponent
  },
  {
    path: 'user-project-detail/:id',
    canActivate: [AitAuthGuardService], 
    component: UserProjectDetailComponent
  },
  {
    path: 'user-skills-reorder',
    canActivate: [AitAuthGuardService], 
    component: UserReorderSkillsComponent
  },
  {
    path: 'user-skills',
    canActivate: [AitAuthGuardService], 
    component: UserSkillsComponent
  },
  {
    path: 'user-profile',
    canActivate: [AitAuthGuardService],
    component: UserProfileComponent
  },
  {
    path: 'user-profile/:id',
    canActivate: [AitAuthGuardService],
    component: UserProfileComponent
  },
  {
    path: 'user-experience',
    canActivate: [AitAuthGuardService],
    component: UserExperienceComponent
  },
  {
    path: 'user-experience/:id',
    canActivate: [AitAuthGuardService],
    component: UserExperienceComponent
  },
  {
    path: 'user-experience-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserExperienceDetailComponent
  },
  {
    path: 'user-education',
    canActivate: [AitAuthGuardService],
    component: UserEducationComponent
  },
  {
    path: 'user-education/:id',
    canActivate: [AitAuthGuardService],
    component: UserEducationComponent
  },
  {
    path: 'user-education-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserEducationDetailComponent
  },
  {
    path: 'user-language',
    canActivate: [AitAuthGuardService],
    component: UserLanguageComponent
  },{
    path: 'user-language-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserLanguageDetailComponent
  },
  {
    path: 'user-language/:id',
    canActivate: [AitAuthGuardService],
    component: UserLanguageComponent
  },
  {
    path: 'user-job-alert',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertComponent
  },
  {
    path: 'user-job-alert/:id',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertComponent
  },
  {
    path: 'user-job-alert-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertDetailComponent
  },
  {
    path: 'skill-list',
    canActivate: [AitAuthGuardService], 
    component: SkillListViewComponent
  },
  {
    path: 'language-list',
    canActivate: [AitAuthGuardService], 
    component: LanguageListComponent
  },
  {
    path: 'project-list',
    canActivate: [AitAuthGuardService],
    component: ProjectListComponent
  },
  {
    path: 'certificate-list',
    canActivate: [AitAuthGuardService], 
    component: CertificateListComponent
  },
  {
    path: 'education-list',
    canActivate: [AitAuthGuardService], 
    component: EducationListComponent
  },
  {
    path: 'my-project-queries',
    canActivate: [AitAuthGuardService], 
    component: MyProjectQueriesComponent
  },
  {
    path: 'role',
    canActivate: [AitAuthGuardService], 
    component: AddRoleComponent
  },
  {
    path: 'group-role',
    canActivate: [AitAuthGuardService], 
    component: GroupRoleRegisterComponent
  },
  {
    path: 'group-role-list',
    canActivate: [AitAuthGuardService], 
    component: GroupRoleListComponent
  },
  
  {
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('access_token') ? 'recommenced-user' : 'sign-in'
  },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
