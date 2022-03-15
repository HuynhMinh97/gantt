import { UserOnboardingComponent } from './pages/user/user-onboarding/user-onboarding.component';
import { UserLanguageComponent } from './pages/user/user-language/user-language.component';
import { UserEducationComponent } from './pages/user/user-education/user-education.component';
import { UserExperienceComponent } from './pages/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService, AitAppUtils } from '@ait/ui';
import { RecommencedComponent } from './pages/recommenced-user/recommenced-user.component';
import { UserCourseComponent } from './pages/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/user/user-skills/user-skills.component';
import { UserReorderSkillsComponent } from './pages/user/user-reorder-skills/user-reorder-skills.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { UserJobAlertComponent } from './pages/user/user-job-alert/user-job-alert.component';
import { UserLanguageDetailComponent } from './pages/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/user/user-education-detail/user-education-detail.component';
import { UserCourseDetailComponent } from './pages/user/user-course-detail/user-course-detail.component';
import { UserCertificateDetailComponent } from './pages/user/user-certificate-detail/user-certificate-detail.component';
import { UserExperienceDetailComponent } from './pages/user/user-experience-detail/user-experience-detail.component';
import { UserProjectDetailComponent } from './pages/user/user-project-detail/user-project-detail.component';
import { UserOnboardingDetailComponent } from './pages/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/user/user-project/user-project.component';

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
  {
    path: 'user-onboarding/:id',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent
  },
  {
    path: 'user-onboarding-detail/:id',
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
    path: 'user-certificate',
    canActivate: [AitAuthGuardService], 
    component: UserCertificateComponent
  },
  {
    path: 'user-certificate/:id',
    canActivate: [AitAuthGuardService], 
    component: UserCertificateComponent
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
    path: 'user-reorder-skills',
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
    path: 'user-language',
    canActivate: [AitAuthGuardService],
    component: UserLanguageComponent
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
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('access_token') ? 'user-profile' : 'sign-in'
  },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AureoleRoutingModule { }
