import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule, NbButtonModule, NbLayoutModule, NbMenuModule, NbUserModule, NbActionsModule, NbSearchModule, NbSidebarModule, NbContextMenuModule, NbSelectModule, NbTooltipModule, NbFormFieldModule, NbAutocompleteModule, NbInputModule, NbOptionModule, NbSpinnerModule, NbCardModule, NbDatepickerModule, NbCheckboxModule, NbRadioModule, } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DragScrollSkillComponent } from './dragscroll-skill.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NbSecurityModule } from '@nebular/security';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DragScrollSkillComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbEvaIconsModule,
    DragScrollModule,
    NbButtonModule,
    NbLayoutModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbContextMenuModule,
    NbSecurityModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbEvaIconsModule,
    NbTooltipModule,
    NbAutocompleteModule,
    NbInputModule,
    NbFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NbAutocompleteModule,
    NbOptionModule,
    NbRadioModule,
    NbCheckboxModule,
    NbDatepickerModule,
    DragScrollModule,
    NbCardModule,
    NbSpinnerModule,
    ],
  exports: [DragScrollSkillComponent],
  providers: [],
})
export class DragScrollSkillModule {}