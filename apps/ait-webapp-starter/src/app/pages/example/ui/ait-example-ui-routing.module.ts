import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { AitAuthGuardService } from '@ait/ui';
import { AitUiComponent } from './ait-example-ui.component';
import { AitAuthGuardService } from '@ait/ui';

// Push your routes here one by one 🎉

export const routes: Routes = [
  {
    path: 'ui',
    component: AitUiComponent,
    canActivate: [AitAuthGuardService], // must have this line for auth guard on this page
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ui'
  },
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
export class AitUiRoutingModule { }
