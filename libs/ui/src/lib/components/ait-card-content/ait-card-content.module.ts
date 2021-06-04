import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitCardContentComponent } from './ait-card-content.component';
import { AitTranslationService } from '../../services';
import { AitTranslatePipe } from '../../@theme/pipes/ait-translate.pipe';
import { NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTextGradientComponent } from '../ait-text-gradient/ait-text-gradient.component';

@NgModule({
  declarations: [AitCardContentComponent, AitTextGradientComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, NbSpinnerModule],
  exports: [AitCardContentComponent],
  providers: [AitTranslationService, AitTranslatePipe],
})
export class AitCardContentModule { }
