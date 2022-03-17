import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitGraphqlComponent } from './ait-example-graphql.component';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AitExampleGraphqlService } from './ait-example-graphql.service';

@NgModule({
  declarations: [AitGraphqlComponent],
  imports: [
    CommonModule,
    NbCardModule,
    Ng2SmartTableModule,
    ],
  exports: [AitGraphqlComponent],
  providers: [AitExampleGraphqlService],
})
export class AitExampleGraphQLModule { }
