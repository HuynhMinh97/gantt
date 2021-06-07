import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-error-message',
  styleUrls: ['./ait-error-message.component.scss',],
  template: `
    <ng-container>
        <div class="d-flex" *ngFor="let err of errors" style="color: red; font-style: italic; margin-top: 5px">
            <span>{{ err }}</span>
        </div>
    </ng-container>
  `
})
export class AitErrorMessageComponent {
  @Input() errors: any[];
}