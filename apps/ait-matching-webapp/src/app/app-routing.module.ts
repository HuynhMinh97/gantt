import { UserOnboardingComponent } from './pages/aureole-v/user/user-onboarding/user-onboarding.component';
import { UserLanguageComponent } from './pages/aureole-v/user/user-language/user-language.component';
import { UserEducationComponent } from './pages/aureole-v/user/user-education/user-education.component';
import { UserExperienceComponent } from './pages/aureole-v/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService, AitAppUtils } from '@ait/ui';
import { RecommencedComponent } from './pages/aureole-v/recommenced-user/recommenced-user.component';
import { UserCourseComponent } from './pages/aureole-v/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/aureole-v/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/aureole-v/user/user-skills/user-skills.component';
import { UserReorderSkillsComponent } from './pages/aureole-v/user/user-reorder-skills/user-reorder-skills.component';
import { UserProfileComponent } from './pages/aureole-v/user/user-profile/user-profile.component';
import { UserJobAlertComponent } from './pages/aureole-v/user/user-job-alert/user-job-alert.component';
import { UserLanguageDetailComponent } from './pages/aureole-v/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/aureole-v/user/user-education-detail/user-education-detail.component';
import { UserCourseDetailComponent } from './pages/aureole-v/user/user-course-detail/user-course-detail.component';
import { UserCertificateDetailComponent } from './pages/aureole-v/user/user-certificate-detail/user-certificate-detail.component';
import { UserExperienceDetailComponent } from './pages/aureole-v/user/user-experience-detail/user-experience-detail.component';
import { UserProjectDetailComponent } from './pages/aureole-v/user/user-project-detail/user-project-detail.component';
import { UserOnboardingDetailComponent } from './pages/aureole-v/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/aureole-v/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/aureole-v/user/user-project/user-project.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'recommenced-user',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: RecommencedComponent
  }, 
  {
    path: 'user-onboarding',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent
  },
  {
    path: 'user-skills',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserSkillsComponent
  },
  // {
  //   path: 'user-onboarding/:id',
  //   canActivate: [AitAuthGuardService],
  //   component: UserOnboardingComponent
  // },
  // {
  //   path: 'user-onboarding-detail/:id',
  //   canActivate: [AitAuthGuardService],
  //   component: UserOnboardingDetailComponent
  // },
 
  {
    path: 'user-profile',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserProfileComponent
  },
  {
    path: 'user-profile/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserProfileComponent
  },
  {
    path: 'user-job-alert',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserJobAlertComponent
  },
  {
    path: 'user-job-alert/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserJobAlertComponent
  },
  {
    path: 'user-job-alert-detail/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component: UserJobAlertDetailComponent
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
export class AureoleRoutingModule { }
