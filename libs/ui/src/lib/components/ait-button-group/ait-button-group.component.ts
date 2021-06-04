import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ait-button-group',
  templateUrl: './ait-button-group.component.html',
  styleUrls: ['./ait-button-group.component.scss']
})
export class AitButtonGroupComponent implements OnChanges {
  @Input() buttons: ButtonGroupInterface[] = []

  btnCtrl: ButtonGroupInterface[] = [];


  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {

        if (key === 'buttons') {
          const element = changes[key].currentValue;
          // console.log(element)
          this.btnCtrl = element;
        }

      }
    }
  }
}

export interface ButtonGroupInterface {
  title?: string;
  style?: 'disable' | 'active' | 'normal',
  action?: any;
  height?: string;
  width?: string;
  border?: string;
  background?: string;
  margin?: string;
  fontsize?: string;
  isTranslate?: boolean;
  styleBtn?: any;
  styleIcon?: any;
  styleText?: any;
  toolTip?: string;
}
