import { Component, Input } from '@angular/core';
import { AitTranslationService } from '../../services';

@Component({
  selector: 'ait-text-gradient',
  styleUrls: ['./ait-text-gradient.component.scss'],
  templateUrl: './ait-text-gradient.component.html'

})
export class AitTextGradientComponent {

  @Input() content = 'default';
  @Input() gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';
  @Input() padding = 15;
  @Input() paddingLeft = 15;
  @Input() tabIndex;
  @Input() fontsize: string = null;
  @Input() id;

  ID(element: string) {
    return '';
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }


  constructor(private translateService: AitTranslationService) {

  }

  getContent = () => this.translateService.translate(this.content);
}
