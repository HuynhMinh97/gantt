import { AitAutocompleteMasterDataModule } from './../ait-autocomplete-master-data/ait-autocomplete-master-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitGroupSearchComponent } from './ait-group-search.component';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitInputTextModule } from '../ait-input-text/ait-input-text.module';
import { AitSpaceModule } from '../ait-space/ait-space.module';
import { AitDatepickerModule } from '../ait-datepicker/ait-datepicker.module';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NB_MODULES } from '../../@theme/theme.module';
import { AitButtonTableModule } from '../ait-button-setting-table/ait-button-setting-table.module';

@NgModule({
  declarations: [AitGroupSearchComponent],
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
    Ng2SmartTableModule,
    AitButtonTableModule,
    ...NB_MODULES,
  ],
  exports: [AitGroupSearchComponent]
})
export class AitGroupSearchModule { }
