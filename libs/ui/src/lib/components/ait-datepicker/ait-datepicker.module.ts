import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbDatepickerModule, NbInputModule } from '@nebular/theme';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { AitDatePickerComponent } from './ait-datepicker.component';
import { AitDateFormatService } from '../../services/common/ait-date.service';
import { StoreModule } from '@ngrx/store';
import { rootReducers } from '../../state/rootReducers';


@NgModule({
  declarations: [AitDatePickerComponent],
  imports: [
    CommonModule,
    NbInputModule,
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({
      parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
      formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
      format: 'yyyy/MM/dd',
    }),
    StoreModule.forRoot(
      { ...rootReducers },
      {
        initialState: {},
      },
    ),
  ],
  exports: [AitDatePickerComponent],
  providers: [AitDateFormatService],
})
export class AitDatepickerModule { }