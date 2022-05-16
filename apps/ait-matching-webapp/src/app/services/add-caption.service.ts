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

  async findCaptionByKey(caption_key?:string) {
    const returnFields = { 
      code: true,
      module: true,
      page: true,
      name: {
        en_US: true,
        ja_JP: true,
        vi_VN: true,
      },
      change_at: true, change_by: true, create_at: true, create_by: true,
    };
    const request = {};
    request['collection'] = 'sys_caption';
    request['condition']= {};
    request['condition']['_key'] = caption_key;
    return await this.query('findCaptionByKey', request, returnFields);
  }

  async saveCaption(data: any) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveCaption',
       'sys_caption',
      [data],
      returnField
    );
  }
}
