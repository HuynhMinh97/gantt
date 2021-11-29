import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitGroupInputComponent } from './ait-group-input.component';
import { AitCommonLayoutModule } from '../../@theme/layouts/ait-common-layout/ait-common-layout.module';
import { AitUpButtonModule } from '../ait-up-button/ait-up-button.module';
import { AitBackButtonModule } from '../ait-back-button/ait-back-button.module';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitSpaceModule } from '../ait-space/ait-space.module';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitAutocompleteMasterDataModule } from '../ait-autocomplete-master-data/ait-autocomplete-master-data.module';
import { AitCardContentModule } from '../ait-card-content/ait-card-content.module';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';
import { AitInputTextModule } from '../ait-input-text/ait-input-text.module';
import { AitInputNumberModule } from '../ait-input-number/ait-input-number.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCheckboxModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

const AIT_MODULES = [
  AitCommonLayoutModule,
  AitUpButtonModule,
  AitBackButtonModule,
  AitErrorMessageModule,
  AitSpaceModule,
  AitButtonModule,
  AitAutocompleteMasterDataModule,
  AitCardContentModule,
  AitTextGradientModule,
  AitInputTextModule,
  AitInputNumberModule
];

@NgModule({
  declarations: [
    AitGroupInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbInputModule,
    NbSpinnerModule,
    NbCheckboxModule,
    ...AIT_MODULES
  ],
  exports: [
    AitGroupInputComponent
  ]
})
export class AitGroupInputModule { }
