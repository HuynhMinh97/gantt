/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AitEnvironmentService, AitTranslationService } from '../../services';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-card-content',
  templateUrl: './ait-card-content.component.html',
  styleUrls: ['./ait-card-content.component.scss'
  ],
})

export class AitCardContentComponent {
  constructor(private envService: AitEnvironmentService,private store : Store<AppState> ,private translate : AitTranslationService) {
    store.pipe(select(getCaption)).subscribe(() => {
      this.buttonTitle = translate.translate('c_2003');
    })
  }
  @Input() label = 'Default';
  @Input() loading = false;
  @Output() onClickButtonHeader = new EventEmitter();
  @Input() isColumn = false;
  @Input() actionBtn = [
    {
      title: 'c_2003',
      icon: 'edit',
    }
  ]
  gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';
  isShow = true;
  isOpen = true;
  isDev = false;
  @Input()
  disableButton = false;
  buttonTitle = ''

  get textButton(): string {
    return 'c_2003';
  }

  toggleExpan = () => this.isOpen = !this.isOpen;


  handleClickBtnHeader = () => {
    // this.isShow = !this.isShow;
    if (this.isDev) {
      this.onClickButtonHeader.emit({ clicked: true });
    }
  }

}
