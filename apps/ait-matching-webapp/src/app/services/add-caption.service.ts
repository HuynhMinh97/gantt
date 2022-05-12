import { isObjectFull } from '@ait/shared';
import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddCaptionService extends AitBaseService{


  async findPageByKey(page_key?:string) {
    const returnFields = { code: true};
    const request = {};
    request['collection'] = 'sys_page';
    request['condition']= {};
    request['condition']['_key'] = page_key;
    return await this.query('findPageByKey', request, returnFields);
  }
  async findModuleByKey(module_key?:string) {
    const returnFields = { code: true};
    const request = {};
    request['collection'] = 'sys_module';
    request['condition']= {};
    request['condition']['_key'] = module_key;
    return await this.query('findModuleByKey', request, returnFields);
  }
}
