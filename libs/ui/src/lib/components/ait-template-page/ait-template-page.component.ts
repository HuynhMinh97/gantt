import { Component, Input } from '@angular/core';

@Component({
  selector: 'ait-template-page',
  templateUrl: './ait-template-page.component.html',
  styleUrls: ['./ait-template-page.component.scss'],
})
export class AitTemplatePageComponent {
  @Input() pageTitle = '';
  @Input() searchTitle = '';
  @Input() tableTitle = '';

  isExpan = false;
  isTableExpan = false;

  toggleExpan = () => (this.isExpan = !this.isExpan);
  toggleTableExpan = () => (this.isTableExpan = !this.isTableExpan);
}
