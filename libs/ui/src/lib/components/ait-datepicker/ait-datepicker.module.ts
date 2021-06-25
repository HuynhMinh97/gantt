import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbDateFnsDateModule, NbDateFnsDateService } from '@nebular/date-fns';
import { AitDatePickerComponent } from './ait-datepicker.component';
import { AitDateFormatService } from '../../services/common/ait-date.service';
import { StoreModule } from '@ngrx/store';
import { rootReducers } from '../../state/rootReducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitLabelModule } from '../ait-label/ait-label.module';


@NgModule({
  declarations: [AitDatePickerComponent],
  imports: [
    CommonModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
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
    NbIconModule,
    NbFormFieldModule,
    AitErrorMessageModule,
    AitLabelModule
  ],
  exports: [AitDatePickerComponent],
  providers: [AitDateFormatService, NbDateFnsDateService],
})
export class AitDatepickerModule { }
