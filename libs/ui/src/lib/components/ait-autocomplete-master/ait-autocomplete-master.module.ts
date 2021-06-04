import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitAutoCompleteMasterComponent } from './ait-autocomplete-master.component';
import { NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitChipModule } from '../ait-chip/ait-chip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AitAutoCompleteMasterComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, AitChipModule, NbInputModule, FormsModule, ReactiveFormsModule],
  exports: [AitAutoCompleteMasterComponent],
  providers: [],
})
export class AitAutocompleteMasterModule { }
