/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AitEnvironmentService } from '../../services';

@Component({
  selector: 'ait-card-content',
  templateUrl: './ait-card-content.component.html',
  styleUrls: ['./ait-card-content.component.scss'
  ],
})

export class AitCardContentComponent {
  constructor(private envService: AitEnvironmentService) {

  }
  @Input() label = 'Default';
  @Input() loading = false;
  @Output() onClickButtonHeader = new EventEmitter();
  @Input() isColumn = false;
  @Input() actionBtn = [
    {
      title: 'common.system.key.edit',
      icon: 'edit',
    }
  ]
  isShow = true;
  isOpen = true;
  isDev = false;
  @Input()
  disableButton = false;

  get textButton(): string {
    return 'common.system.key.edit';
  }

  toggleExpan = () => this.isOpen = !this.isOpen;


  handleClickBtnHeader = () => {
    // this.isShow = !this.isShow;
    if (this.isDev) {
      this.onClickButtonHeader.emit({ clicked: true });
    }
  }

}
