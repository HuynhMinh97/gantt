import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitInputNumberComponent } from './ait-input-number.component';
import { NbInputModule } from '@nebular/theme';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
import { StoreModule } from '@ngrx/store';
import { rootReducers } from '../../state/rootReducers';
import { AitCurrencySymbolService } from '../../services/ait-currency-symbol.service';

@NgModule({
  declarations: [AitInputNumberComponent],
  imports: [CommonModule, NbInputModule,
    StoreModule.forRoot(
    { ...rootReducers },
    {
      initialState: {},
    },
    ),
  ],
  exports: [AitInputNumberComponent],
  providers: [AitNumberFormatPipe, AitCurrencySymbolService],
})
export class AitInputNumberModule { }
