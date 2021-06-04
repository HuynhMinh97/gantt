
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { AitTranslationService } from '../../services/common/ait-translate.service';


@Injectable()
@Pipe({
  name: 'translate',
  pure: false
})
export class AitTranslatePipe implements PipeTransform {

    constructor(private translationService: AitTranslationService) {}

  transform(value: any, args?: any): any {
     return this.translationService.translate(value);
  }

}
