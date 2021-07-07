
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GRAPHQL, isObjectFull } from '@ait/shared';
import { AitBaseService } from './ait-base.service';


export enum DATA_TYPE {
  COMPANY = 'COMPANY',
  SKILL = 'SKILL',
  INDUSTRY = 'INDUSTRY',
  TITLE = 'TITLE',
  MASTER = 'MASTER',
  CERTIFICATE_AWARD = 'CERTIFICATE_AWARD',
  TRAINING_CENTER = 'TRAINING_CENTER',
  SCHOOL = 'SCHOOL',
}

export enum CLASS {
  SYSTEM_SETTING = 'SYSTEM_SETTING'
}

export interface ConditionSearch {
  type?: string; // "MASTER",
  keyword?: string; // "java",
  class?: string;// "ADDRESS",
  parent_code?: string;// "VIETNAM",
  code?: string;// "HUE",
  _key?: string[]
}


@Injectable()
export class AitMasterDataService extends AitBaseService {

  private CHECKED = '<div class="checkbox-center"><input type="checkbox" checked="checked" onclick="return false" style=""></input></div>';
  private UNCHECKED = '<div class="checkbox-center"><input type="checkbox" onclick="return false" style=""></input></div>';

  private save = this.env?.API_PATH?.SYS?.MASTER_DATA + '/save';
  private getmaster = this.env?.API_PATH?.SYS?.MASTER_DATA + '/get';
  private remove = this.env?.API_PATH?.SYS?.MASTER_DATA + '/remove';
  private getClass = this.env?.API_PATH?.SYS?.CLASS + '/get';
  private getLang = this.env?.API_PATH?.SYS?.LANG + '/get';
  private getClassByParent = this.env?.API_PATH?.SYS?.MASTER_DATA + '/get-by-class-parent-code';
  private getByClass = this.env?.API_PATH?.SYS?.MASTER_DATA + '/get-by-class';
  private searchMasterData = this.env?.API_PATH?.SYS?.MASTER_DATA + '/search';
  private getByCode = this.env?.API_PATH?.SYS?.MASTER_DATA + '/get-by-code';

  returnFields = {
    _key: true,
    code: true,
    class: true,
    parent_code: true,
    sort_no: true,
    create_at: true,
    create_by: true,
    change_at: true,
    change_by: true,
    name: true,
    active_flag: true,
  };

  async getSuggestData(condition?: ConditionSearch) {
    return await this.post(this.searchMasterData, { condition }).toPromise();
  }


  async getMasterData(condition?: any) {
    return await this.post(this.getmaster, { condition }).toPromise();
  }


  async getClassData(condition?: any) {
    return await this.post(this.getClass, { condition }).toPromise();
  }
  async getClassByParentData(classCode?: string, parentCode?: string) {
    return await this.post(this.getClassByParent, {
      condition: {
        class: classCode,
        parent_code: parentCode
      },
    }).toPromise();
  }
  async getClassByCodeData(classCode?: string, code?: string) {
    return await this.post(this.getByCode, {
      condition: {
        class: classCode,
        code: code
      },
    }).toPromise();
  }
  async getClassBy(classCode?: any) {
    return await this.post(this.getByClass, {
      condition: {
        class: classCode,
      },
    }).toPromise();
  }


  async getLangList(condition?: any) {
    return await this.post(this.getLang, { condition }).toPromise();
  }

  async deleteData(data: string) {
    return await this.post(this.remove, {
      data,
    }).toPromise();
  }

  async saveData(data: any[]) {

    return await this.mutation('saveSystem', 'sys_master_data', data, this.returnFields);
  }


  async find(condition: any, rf?: any, collection?: string) {
    const returnFields = rf ? rf : this.returnFields;
    const request = {};
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    request['collection'] = collection || 'sys_master_data';

    return await this.query(GRAPHQL.FIND_SYSTEM, request, returnFields);
  }
}
