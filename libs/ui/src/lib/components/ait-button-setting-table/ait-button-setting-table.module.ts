import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbTooltipModule } from '@nebular/theme';
import { AitAutocompleteMasterDataModule } from '../ait-autocomplete-master-data/ait-autocomplete-master-data.module';
import { AitButtonTableComponent } from './ait-button-setting-table.component';

@NgModule({
    declarations: [AitButtonTableComponent],
    imports: [
      AitAutocompleteMasterDataModule,
      CommonModule,
      NbTooltipModule,
    ],
    exports: [AitButtonTableComponent]
  })
  export class AitButtonTableModule { }