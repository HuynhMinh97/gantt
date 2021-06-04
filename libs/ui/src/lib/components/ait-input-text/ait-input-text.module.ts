import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTextInputComponent } from './ait-input-text.component';

@NgModule({
  declarations: [AitTextInputComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, NbFormFieldModule,NbInputModule],
  exports: [AitTextInputComponent,NbIconModule,NbEvaIconsModule,NbFormFieldModule],
  providers: [],
})
export class AitInputTextModule {

}
