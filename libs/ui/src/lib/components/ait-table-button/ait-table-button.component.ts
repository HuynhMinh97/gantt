/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isObjectFull } from '@ait/shared';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbMenuItem,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { AitBaseComponent } from '../base.component';
import { AppState } from '../../state/selectors';
import { AitAuthService, AitEnvironmentService, AitTranslationService, AitUserService } from '../../services';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ait-table-button',
  templateUrl: './ait-table-button.component.html',
  styleUrls: ['./ait-table-button.component.scss'],
})
export class AitTableButtonComponent
  extends AitBaseComponent
  implements OnInit, ViewCell {
  constructor(
    private iconLibraries: NbIconLibraries,
    private translateService: AitTranslationService,
    public store: Store<AppState>,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    public router: Router
  ) {
    super(
      store,
      authService,
      null,
      userService,
      env,
      layoutScrollService,
      toastrService,
      null
    );
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'far', iconClassPrefix: 'fa' });
    this.iconLibraries.registerFontPack('font-awesome-fas', { packClass: 'fas', iconClassPrefix: 'fa' });
    this.path = this.router.url;
  }
  @Input() value: any;
  @Input() rowData: any;
  @Output() detailEvent: EventEmitter<any> = new EventEmitter();
  @Output() copyEvent: EventEmitter<any> = new EventEmitter();
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  isOpen = false;
  path = '';
  items: NbMenuItem[] = [];

  message = '他システムのデータのため、修正できません。';
  isMatching = false;
  ngOnInit(): void {
    if (isObjectFull(this.rowData)) {
      this.isMatching = !!this.rowData.is_matching;
      this.items = [
        {
          title: this.isMatching ? 'EDIT' : this.message,
          icon: 'edit-outline',
        },
        {
          title: 'SHOW',
          icon: 'file-text-outline',
        },
        {
          title: 'COPY',
          icon: 'file-add-outline',
        },
        {
          title: 'DELETE',
          icon: 'trash-outline',
        },
      ];
    }
  }

  isValidPath(): boolean {
    return this.path !== '/my-project-queries';
  }

  getTitle(title: string) {
    return this.translateService.translate(title);
  }

  view() {
    if (!this.isValidPath()) {
      localStorage.setItem('my-project-queries', this.value);
    }
    this.detailEvent.emit(this.value);
  }

  edit() {
    this.editEvent.emit(this.value);
  }

  copy() {
    this.copyEvent.emit(this.value);
  }

  remove() {
    this.deleteEvent.emit(this.value);
  }
}
