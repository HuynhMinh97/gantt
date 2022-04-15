import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitCardContentComponent } from './ait-card-content.component';
import { AitTranslationService } from '../../services';
import { AitTranslatePipe } from '../../@theme/pipes/ait-translate.pipe';
import { NbIconModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [AitCardContentComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, NbSpinnerModule, NbTooltipModule],
  exports: [AitCardContentComponent],
  providers: [AitTranslationService, AitTranslatePipe],
})
export class AitCardContentModule { }
