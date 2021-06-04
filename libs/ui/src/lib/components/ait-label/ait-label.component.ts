import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-label',
  templateUrl: './ait-label.component.html',
  styleUrls: ['./ait-label.component.scss']
})
export class AitLabelComponent  {
  @Input() label: string;
  @Input() isTranslate = false;

}
