import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitAutoCompleteMasterDataComponent } from './ait-autocomplete-master-data.component';
import { NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';

@NgModule({
  declarations: [AitAutoCompleteMasterDataComponent],
  imports: [ CommonModule,NbInputModule,NbCheckboxModule,NbTooltipModule,NbIconModule ],
  exports: [AitAutoCompleteMasterDataComponent],
  providers: [],
})
export class AitAutocompleteMasterDataModule {}
