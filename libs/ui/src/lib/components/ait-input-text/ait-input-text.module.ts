import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTextInputComponent } from './ait-input-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';

@NgModule({
  declarations: [AitTextInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    NbInputModule,
    AitErrorMessageModule
  ],
  exports: [AitTextInputComponent, NbIconModule, NbEvaIconsModule, NbFormFieldModule],
  providers: [],
})
export class AitInputTextModule {

}
