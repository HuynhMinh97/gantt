import { EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-template-popup',
  styleUrls: ['./ait-template-popup.component.scss',],
  template: `
  <div [ngClass]="isPage ? 'template__page' : 'template__popup'" [ngStyle]="{ width: width ? width + 'px' : null }" >
    <ng-content></ng-content>

  </div>
  <div class="action-row" *ngIf="!isLoading && actionButtons.length !==0" [ngStyle]="{ width: width ? width + 'px' : null }">

    <ait-button-form
    *ngFor="let btn of actionButtons"
      [title]="btn.title | translate"
      [style]="btn.style"
      (click)="btn.action()"
    ></ait-button-form>
  </div>
  `
})
export class AitTemplatePopupComponent implements OnChanges {
  @Input() width = 800;
  @Output() watchValue = new EventEmitter();
  @Input() isLoading = false;
  @Input() isPage = false;
  @Input() actionButtons = [
  ];
  @Input() isPopup = false;
  class ='';
  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const element = changes[key].currentValue;
        if (key === 'isPopup' && element === true) {
          this.class = 'popup';
        }
      }
    }
  }
}
