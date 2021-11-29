import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService, AitAppUtils } from '@ait/ui';
import { RenderPageComponent } from './render-page/render-page.component';
import { RenderInputComponent } from './render-input/render-input.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'example',
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
    children: [
      {
        path: 'ui',
        loadChildren: () => import('./ui/ait-example-ui-routing.module').then(m => m.AitUiRoutingModule),
        // canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
      },
      {
        path: 'graphql',
        loadChildren: () => import('./graphql/ait-example-graphql-routing.module').then(m => m.AitGraphQLRoutingModule),
        // canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AitAppUtils.isLogined() ? 'ui' : 'sign-in'
      },
    ]
  },
  {
    path: 'master',
    component: RenderPageComponent,
  },
  {
    path: 'input',
    component: RenderInputComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('access_token') ? 'example' : 'sign-in'
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AitExampleRoutingModule { }
