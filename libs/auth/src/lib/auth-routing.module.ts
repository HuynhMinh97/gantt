import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitLoginComponent } from './pages/auth/ait-login/ait-login.component';
import { AitAuthGuardService, AitAuthScreenService } from '@ait/ui';
import { AitSignUpComponent } from './pages/auth/ait-signup/ait-signup.component';
import { AitChangePwdComponent } from './pages/auth/ait-change-password/ait-change-password.component';
import { Ait403Component } from './pages/auth/ait-403/ait-403.component';
import { Ait404Component } from './pages/auth/ait-404/ait-404.component';


// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'sign-in',
    component: AitLoginComponent,
    canActivate: [AitAuthScreenService],
  },
  {
    path: 'sign-up',
    component: AitSignUpComponent,
    canActivate: [AitAuthScreenService],
  },
  {
    path: 'change-password',
    component: AitChangePwdComponent,
    canActivate: [AitAuthGuardService],
  },
  {
    path: '403',
    component: Ait403Component
  },
  {
    path: '404',
    component: Ait404Component
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  },
];

const config: ExtraOptions = {
  useHash: true,
  relativeLinkResolution: 'legacy',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AitAuthRoutingModule { }