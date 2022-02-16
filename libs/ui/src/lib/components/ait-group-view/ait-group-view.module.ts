import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitGroupViewComponent } from './ait-group-view.component';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';
import { AitAutocompleteMasterDataModule } from '../ait-autocomplete-master-data/ait-autocomplete-master-data.module';
import { AitInputTextModule } from '../ait-input-text/ait-input-text.module';
import { AitDatepickerModule } from '../ait-datepicker/ait-datepicker.module';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitSpaceModule } from '../ait-space/ait-space.module';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitCardContentModule } from '../ait-card-content/ait-card-content.module';
import { NB_MODULES } from '../../@theme/theme.module';
import { AitOutputTextModule } from '../ait-output-text/ait-output-text.module';



@NgModule({
  declarations: [
    AitGroupViewComponent
  ],
  imports: [
    CommonModule,
    NbIconModule,
    NbEvaIconsModule,
    AitTextGradientModule,
    AitAutocompleteMasterDataModule,
    AitInputTextModule,
    AitDatepickerModule,
    AitErrorMessageModule,
    AitSpaceModule,
    AitButtonModule,
    AitCardContentModule,
    AitOutputTextModule,
    ...NB_MODULES,
  ],
  exports: [
    AitGroupViewComponent
  ]
})
export class AitGroupViewModule { }
