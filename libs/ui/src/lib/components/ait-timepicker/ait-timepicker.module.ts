import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTimepickerComponent } from './ait-timepicker.component';
import { NbTimepickerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AitTimepickerComponent],
  imports: [
    FormsModule,
    CommonModule, NbTimepickerModule.forRoot({
      twelveHoursFormat: false,
    }),],
  exports: [AitTimepickerComponent],
  providers: [],
})
export class AitTimePickerModule { }
