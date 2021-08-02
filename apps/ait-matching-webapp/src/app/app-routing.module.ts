import { UserExperienceComponent } from './pages/aureole-v/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService, AitAppUtils } from '@ait/ui';
import { RecommencedComponent } from './pages/aureole-v/recommenced-user/recommenced-user.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'recommenced-user',
    //canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    component : RecommencedComponent
  },
  {
    path: 'user-experience',
    component : UserExperienceComponent
  },
  {
    path: 'user-experience/:id',
    component : UserExperienceComponent
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
