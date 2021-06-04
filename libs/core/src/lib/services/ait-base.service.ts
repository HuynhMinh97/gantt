/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  COLLECTIONS,
  DB_CONNECTION_TOKEN,
  isArrayFull,
  isNil,
  KEYS,
  RESULT_STATUS,
  SYSTEM_COMPANY,
} from '@ait/shared';
import { Inject, Injectable } from '@nestjs/common';
import { aql, Database } from 'arangojs';
import { DocumentCollection } from 'arangojs/collection';
import { Guid } from 'guid-typescript';
import { SysUser } from '../entities/sys-user.entity';
import { BaseResponse } from '../response/base.response';

@Injectable()
export class AitBaseService {
  constructor(@Inject(DB_CONNECTION_TOKEN) private readonly db: Database) {}

  company = '';
  lang = '';
  username = '';

  async save(request: any, user?: SysUser) {
    this.initialize(request, user);
    const collection = request.collection;

    const dataInsert = [];
    const dataUpdate = [];

    request.data.forEach((data: any) => {
      if (data._key) {
        this.setCommonUpdate(data);
        dataUpdate.push(data);
      } else {
        this.setCommonInsert(data);
        data[KEYS.KEY] = this.guid;
        dataInsert.push(data);
      }
    });

    const resData = [];

    if (dataInsert.length > 0) {
      const aqlStr = `FOR data IN ${JSON.stringify(dataInsert)}
      INSERT data INTO ${collection} RETURN data`;
      try {
        const res = await this.db.query(aqlStr);
        for await (const data of res) {
          resData.push(data);
        }
      } catch (error) {
        return new BaseResponse(RESULT_STATUS.ERROR, [], error);
      }
    }

    if (dataUpdate.length > 0) {
      const aqlStr = `FOR data IN ${JSON.stringify(dataUpdate)}
      UPDATE data WITH data IN ${collection} RETURN data`;
      try {
        const res = await this.db.query(aqlStr);
        for await (const data of res) {
          resData.push(data);
        }
      } catch (error) {
        return new BaseResponse(RESULT_STATUS.ERROR, [], error);
      }
    }
     return new BaseResponse(RESULT_STATUS.OK, resData, KEYS.SUCCESS);
  }

  async remove(request: any, user?: SysUser) {
    const req = this.db.collection(request.collection) as DocumentCollection;
    const rq = aql`
    FOR data IN ${request.data}
    REMOVE data._key IN ${req}
    LET removed = OLD
    RETURN removed
  `;
  const resData = [];
    try {
      const res = await this.db.query(rq);
      for await (const data of res) {
        resData.push(data);
      }
      return new BaseResponse(RESULT_STATUS.OK, resData, KEYS.SUCCESS);
    } catch (err) {
      return new BaseResponse(RESULT_STATUS.OK, resData, KEYS.SUCCESS);
    }
  }

  async query(aql: string) {
    try {
      const res = await this.db.query(aql);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      return rawData;
    } catch (err) {
      console.error(err.message);
    }
  }

  async find(request: any, user?: SysUser) {
    // console.log(request); return
    let aqlStr = `LET current_data = ( ${this.getSearchCondition(request, false)} ) `;
    aqlStr += `LET result = LENGTH(current_data) > 0 ? current_data : ( ${this.getSearchCondition(request, true)} ) `;
    aqlStr += `FOR data IN result RETURN data`;

    // console.log(aqlStr);
    
    try {
      const result = await this.db.query(aqlStr);
      const rawData = [];
      for await (const data of result) {
        rawData.push(data);
      }
      return new BaseResponse(RESULT_STATUS.OK, rawData, KEYS.SUCCESS);
      // return 
    } catch (error) {
      return new BaseResponse(RESULT_STATUS.ERROR, [], error);
    }
  }


  private getSearchCondition(request: any, isSystem: boolean) {
    const company = isSystem ? SYSTEM_COMPANY : request.company;
    const condition = request.condition;
    const lang = request.lang;
    const collection = request.collection;

    isSystem && (collection === COLLECTIONS.USER_SETTING) && condition['user_id'] ? delete condition['user_id'] : '';

    let aqlStr = `FOR data IN ${collection} `;
    aqlStr += `FILTER data.company == "${company}" `
    for (const prop in condition) {
      if (isArrayFull(condition[prop])) {
        aqlStr += `&& data.${prop} IN ${JSON.stringify(condition[prop])} `;

      } else if (prop === KEYS.NAME) {
        aqlStr += `&& LOWER(data.name.${lang}) `;
        aqlStr += `LIKE LOWER(CONCAT("${condition[prop]}", "%")) `;
        
        if (collection === COLLECTIONS.MASTER_DATA) {
          const class_code = condition.class;
          aqlStr += class_code ? `&& data.class == "${class_code}" ` : '';
        }
      } else {
        aqlStr += `&& data.${prop} == `;
        aqlStr +=
        typeof condition[prop] === 'string'
          ? `"${condition[prop]}" `
          : `${condition[prop]} `;
      }
    }
    aqlStr += `RETURN MERGE(data, {name:  data.name.${lang}}) `;

    return aqlStr;
  }

  initialize(request: any, user?: SysUser) {
    if (isNil(request) || isNil(user)) return;
    this.company = request.company;
    this.lang = request.lang;
    this.username = user.username;
  }

  setCommonInsert(data: any) {
    if (this.company) {
      data[KEYS.COMPANY] = this.company;
    }
    data[KEYS.KEY] = this.guid;
    data[KEYS.CREATE_BY] = this.username;
    data[KEYS.CHANGE_BY] = this.username;
    data[KEYS.CREATE_AT] = this.getUnixTime();
    data[KEYS.CHANGE_AT] = this.getUnixTime();
  }
  setCommonUpdate(data: any) {
    if (this.company) {
      data[KEYS.COMPANY] = this.company;
    }
    data[KEYS.CHANGE_BY] = this.username;
    data[KEYS.CHANGE_AT] = this.getUnixTime();
  }

  /**
   * Generate GUID
   *
   * @readonly
   * @type {string}
   * @memberof BaseService
   */
   get guid(): string {
    return Guid.create().toString();
  }

  protected getUnixTime() {
    return new Date().setHours(0, 0, 0, 0);
  }
}
