import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AitEnvironmentService, AitTranslationService } from '../../services';
import { AppState } from '../../state/selectors';
import { getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-footer',
  styleUrls: ['./ait-footer.component.scss'],
  templateUrl: './ait-footer.component.html',
})
export class AitFooterComponent {
  homeLabel = '';

  constructor(
    private router: Router,
    private translateService: AitTranslationService,
    store: Store<AppState>,
    private env : AitEnvironmentService
  ) {
    store.pipe(select(getCaption)).subscribe(c => {
      // console.log(c)
      this.homeLabel = this.getI18nLabel('c_1001');
    })
  }
  isAureoleV = () => {
    const target: any = this.env;
    return target?.isAureoleV;
  }
  handleHref = () => {
    this.router.navigateByUrl('/');
  };

  getI18nLabel = (label) => this.translateService.translate(label);

  navigateToHome = () => {
    this.router.navigateByUrl('/');
  }
}
