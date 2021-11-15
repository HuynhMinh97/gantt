import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { AitAuthService, AitEnvironmentService, AitUserService } from '../../services';
import { AppState } from '../../state/selectors';
import { AitBaseComponent } from '../base.component';
@Component({
  selector: 'ait-confirm-dialog',
  templateUrl: './ait-confirm-dialog.component.html',
  styleUrls: ['./ait-confirm-dialog.component.scss'],
})
export class AitConfirmDialogComponent extends AitBaseComponent {
  title = '';
  btn_left = '';
  btn_right = '';
  @Input() id;

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  constructor(
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    store: Store<AppState>,
    authService: AitAuthService,
    userService: AitUserService,
    envService: AitEnvironmentService,
    apollo: Apollo,

  ) {
    super(store, authService, apollo, userService, envService);

  }

  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
