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
  @Input() midleAreaTitle = '';
  @Input() isTableIncluded = true;
  @Input() isExpandIncluded = true;
  @Input() isExpan = true;
  @Input() isExpanArea3 = true;
  @Input() isTableExpan = true;
  @Input() isShowArea3 = true;
  @Input() isShowTableArea = true;



  toggleExpan = () => (this.isExpan = !this.isExpan);
  toggleExpanArea3 = () => (this.isExpanArea3 = !this.isExpanArea3);
  toggleTableExpan = () => (this.isTableExpan = !this.isTableExpan);
}
