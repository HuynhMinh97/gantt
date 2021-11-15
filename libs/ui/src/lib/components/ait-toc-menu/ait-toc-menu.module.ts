import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTocMenuComponent } from './ait-toc-menu.component';
import { NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [AitTocMenuComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, NbTooltipModule],
  exports: [AitTocMenuComponent],
  providers: [],
})
export class AitTocMenuModule { }
