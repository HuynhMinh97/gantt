import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTocMenuComponent } from './ait-toc-menu.component';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [AitTocMenuComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule],
  exports: [AitTocMenuComponent],
  providers: [],
})
export class AitTocMenuModule { }
