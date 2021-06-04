import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-space',
  styleUrls: ['./ait-space.component.scss',],
  template: `
  <div class="space__input" [style.height]="height" [style.width]="width">
    <ng-content></ng-content>
  </div>
  `
})
export class AitSpaceComponent {
  @Input() height;
  @Input() width;

}
