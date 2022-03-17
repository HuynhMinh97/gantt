import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitOutputTextComponent } from './ait-output-text.component';
import { AitLabelModule } from '../ait-label/ait-label.module';
import { NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { AitTextareaModule } from '../ait-text-area/ait-text-area.module';

@NgModule({
  declarations: [AitOutputTextComponent],
  imports: [CommonModule, AitLabelModule,NbInputModule,NbIconModule, AitTextareaModule, NbTooltipModule],
  exports: [AitOutputTextComponent],
  providers: [],
})
export class AitOutputTextModule { }
