import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ait404Component } from './ait-404.component';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [Ait404Component],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule],
  exports: [Ait404Component],
  providers: [],
})
export class Ait404Module { }
