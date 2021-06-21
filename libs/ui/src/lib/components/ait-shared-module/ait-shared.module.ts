import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTranslatePipe } from '../../@theme/pipes/ait-translate.pipe';

@NgModule({
  declarations: [AitTranslatePipe],
  imports: [ CommonModule ],
  exports: [AitTranslatePipe],
  providers: [],
})
export class AitShareModule {}
