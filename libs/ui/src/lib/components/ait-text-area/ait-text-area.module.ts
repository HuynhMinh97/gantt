import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTextAreaComponent } from './ait-text-area.component';
import { NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AitTextAreaComponent],
  imports: [CommonModule, NbInputModule, FormsModule, ReactiveFormsModule],
  exports: [AitTextAreaComponent],
  providers: [],
})
export class AitTextareaModule { }
