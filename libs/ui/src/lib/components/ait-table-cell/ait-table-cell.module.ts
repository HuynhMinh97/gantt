import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTableCellComponent } from './ait-table-cell.component';
import { NbTooltipModule } from '@nebular/theme';



@NgModule({
  declarations: [
    AitTableCellComponent
  ],
  imports: [
    CommonModule,
    NbTooltipModule
  ],
  exports: [
    AitTableCellComponent
  ]
})
export class AitTableCellModule { }
