import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-error-message',
  styleUrls: ['./ait-error-message.component.scss'],
  template: `
    <ng-container>
      <div [ngClass]="classContainer">
        <div
          *ngFor="let err of errors; let i = index"
          style="color: red; font-style: italic; margin-top: 5px"
          [ngStyle]="style"
        >
          <div [id]="ID('error_message_' + i)">{{ err }}</div>
        </div>
      </div>
    </ng-container>
  `,
})
export class AitErrorMessageComponent {
  @Input() errors: any[];
  @Input() style: any;
  @Input() classContainer;
  @Input() id;
  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }
}
