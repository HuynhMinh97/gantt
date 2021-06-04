import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitChipComponent } from './ait-chip.component';
import { NbButtonModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [AitChipComponent],
  imports: [CommonModule, NbButtonModule, NbIconModule, NbEvaIconsModule,NbTooltipModule],
  exports: [AitChipComponent],
  providers: [],
})
export class AitChipModule { }
