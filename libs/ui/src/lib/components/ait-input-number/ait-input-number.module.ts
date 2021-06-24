import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitInputNumberComponent } from './ait-input-number.component';
import { NbIconModule, NbInputModule } from '@nebular/theme';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
import { StoreModule } from '@ngrx/store';
import { rootReducers } from '../../state/rootReducers';
import { AitCurrencySymbolService } from '../../services/ait-currency-symbol.service';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { AitLabelModule } from '../ait-label/ait-label.module';

@NgModule({
  declarations: [AitInputNumberComponent],
  imports: [CommonModule, NbInputModule, AitErrorMessageModule,AitLabelModule,NbIconModule,
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
