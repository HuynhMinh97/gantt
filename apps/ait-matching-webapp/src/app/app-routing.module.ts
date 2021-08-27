import { UserOnboardingComponent } from './pages/aureole-v/user/user-onboarding/user-onboarding.component';
import { UserLanguageComponent } from './pages/aureole-v/user/user-language/user-language.component';
import { UserEducationComponent } from './pages/aureole-v/user/user-education/user-education.component';
import { UserExperienceComponent } from './pages/aureole-v/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService, AitAppUtils } from '@ait/ui';
import { RecommencedComponent } from './pages/aureole-v/recommenced-user/recommenced-user.component';
import { AddComponent } from './user/add/add.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'recommenced-user',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component : RecommencedComponent
  },
  {
    path: 'user-experience',
    canActivate: [AitAuthGuardService],
    component : UserExperienceComponent
  },
  {
    path: 'user-experience/:id',
    canActivate: [AitAuthGuardService],
    component : UserExperienceComponent
  },
  {
    path: 'user-education',
    canActivate: [AitAuthGuardService],
    component : UserEducationComponent
  },
  {
    path: 'user-education/:id',
    canActivate: [AitAuthGuardService],
    component : UserEducationComponent
  },
  {
    path: 'user-language',
    canActivate: [AitAuthGuardService],
    component : UserLanguageComponent
  },
  {
    path: 'user-language/:id',
    canActivate: [AitAuthGuardService],
    component : UserLanguageComponent
  },
  {
    path: 'user-onboarding',
    canActivate: [AitAuthGuardService],
    component : UserOnboardingComponent
  },
  {
    path: 'user-onboarding/:id',
    canActivate: [AitAuthGuardService],
    component : UserOnboardingComponent
  },
  {
    path: 'user/:id',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component : AddComponent
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
