import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AitAuthGuardService } from '@ait/ui';
import { AitGraphqlComponent } from './ait-example-graphql.component';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: '',
    component: AitGraphqlComponent,
    // canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'graphql'
  // },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AitGraphQLRoutingModule { }
