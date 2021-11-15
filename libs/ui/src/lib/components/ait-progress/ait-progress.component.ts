import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-progress',
  templateUrl: './ait-progress.component.html',
  styleUrls: ['./ait-progress.component.scss']
})
export class AitProgressComponent {
  @Input() progress = 0;
  @Input() background = 'green'
}
