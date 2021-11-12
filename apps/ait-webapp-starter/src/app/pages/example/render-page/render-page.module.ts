import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitGroupSearchModule } from '@ait/ui';
import { RenderPageComponent } from './render-page.component';



@NgModule({
  declarations: [RenderPageComponent],
  imports: [
    CommonModule,
    AitGroupSearchModule
  ]
})
export class RenderPageModule { }
