import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { AitSpaceModule } from './../ait-space/ait-space.module';
import { AitTemplatePageComponent } from './ait-template-page.component';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';

@NgModule({
  declarations: [AitTemplatePageComponent],
  imports: [CommonModule, AitTextGradientModule, AitSpaceModule, NbIconModule],
  exports: [AitTemplatePageComponent],
  providers: [],
})
export class AitTemplatePageModule {}
