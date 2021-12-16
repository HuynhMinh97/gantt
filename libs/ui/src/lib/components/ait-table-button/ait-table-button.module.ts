import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTableButtonComponent } from './ait-table-button.component';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AitTableButtonComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbEvaIconsModule,
    MatMenuModule,
    MatIconModule
  ],
  exports: [AitTableButtonComponent]
})
export class AitTableButtonModule { }
