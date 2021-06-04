import { Component, Input } from '@angular/core';


@Component({
  selector: 'ait-drag-scroll',
  styleUrls: ['./ait-drag-scroll.component.scss',],
  templateUrl : './ait-drag-scroll.component.html',
})
export class AitDragScrollComponent {
  @Input() list: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() width: string;
  @Input() isNormal = false;
}
