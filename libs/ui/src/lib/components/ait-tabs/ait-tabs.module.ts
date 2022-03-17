import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTabsCommonComponent } from './ait-tabs.component';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTranslationService } from '../../services';

@NgModule({
  declarations: [AitTabsCommonComponent],
  imports: [ CommonModule,NbIconModule,NbEvaIconsModule ],
  exports: [AitTabsCommonComponent],
  providers: [AitTranslationService],
})
export class AitTabsModule {}
