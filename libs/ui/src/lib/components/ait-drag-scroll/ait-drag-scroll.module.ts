import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitDragScrollComponent } from './ait-drag-scroll.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NbButtonModule } from '@nebular/theme';


@NgModule({
  declarations: [AitDragScrollComponent],
  imports: [CommonModule, DragScrollModule, NbButtonModule],
  exports: [AitDragScrollComponent,DragScrollModule],
  providers: [],
})
export class AitDragScrollModule { }
