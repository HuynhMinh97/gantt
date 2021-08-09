/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  COLLECTIONS,
  DB_CONNECTION_TOKEN,
  hasLength,
  isObjectFull,
  KEYS,
  RESULT_STATUS,
  SYSTEM_COMPANY,
} from '@ait/shared';
import { Inject, Injectable } from '@nestjs/common';
import { aql, Database } from 'arangojs';
import { DocumentCollection } from 'arangojs/collection';
import { SysUser } from '../entities/sys-user.entity';
import { BaseResponse } from '../responses/base.response';
import { AitUtils } from '../utils/ait-utils';

@Injectable()
export class AitBaseService {
  constructor(
    @Inject(DB_CONNECTION_TOKEN) private readonly db: Database,
    @Inject('ENVIRONMENT') private env: any
  ) { }

  company = '';
  lang = '';
  username = '';

  async save(request: any, user?: SysUser) {
    this.initialize(request, user);

    const collection = request.collection;
    const lang = request.lang;

    const dataInsert = [];
    const dataUpdate = [];

    request.data.forEach((data: any) => {
      if (data._key) {
        this.setCommonUpdate(data);
        dataUpdate.push(data);
      } else {
        this.setCommonInsert(data);
        dataInsert.push(data);
      }
    });
    const resData = [];

    if (dataInsert.length > 0) {
      const aqlStr = `FOR data IN ${JSON.stringify(dataInsert)}
      INSERT data INTO ${collection} RETURN MERGE(data, {name: data.name.${lang} ? data.name.${lang} : data.name }) `;

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
      UPDATE data WITH data IN ${collection} RETURN MERGE(NEW, {name:  NEW.name.${lang} ? NEW.name.${lang} : NEW.name }) `;
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
    const isMatching = !!this.env.isMatching;
    const req = this.db.collection(request.collection) as DocumentCollection;

    const aqlQuery = isMatching
      ? aql`
      FOR item IN ${request.data}
      FOR data IN ${req}
      FILTER data._key == item._key
      UPDATE data WITH { del_flag: true } IN ${req}
      RETURN data
    `
      : aql`
      FOR data IN ${request.data}
      REMOVE data._key IN ${req}
      LET removed = OLD
      RETURN removed
    `;

    const resData = [];
    try {
      const res = await this.db.query(aqlQuery);
      for await (const data of res) {
        resData.push(data);
      }
      return new BaseResponse(RESULT_STATUS.OK, resData, KEYS.SUCCESS);
    } catch (error) {
      return new BaseResponse(RESULT_STATUS.ERROR, [], error);
    }
  }

  async query(aql: string) {
    try {
      const res = await this.db.query(aql);
      const rawData = [];
      for await (const data of res) {
        rawData.push(data);
      }
      return new BaseResponse(RESULT_STATUS.OK, rawData, KEYS.SUCCESS);
    } catch (error) {
      return new BaseResponse(RESULT_STATUS.ERROR, [], error);
    }
  }

  async find(request: any, user?: SysUser) {
    const lang = request.lang;
    let aqlStr = `LET current_data = ( ${this.getSearchCondition(
      request,
      false
    )} ) `;
    aqlStr += `LET result = LENGTH(current_data) > 0 ? current_data : ( ${this.getSearchCondition(
      request,
      true
    )} ) `;
    aqlStr += `FOR data IN result RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name }) `;
    console.log(aqlStr)
    try {
      const result = await this.db.query(aqlStr);
      const rawData = [];
      for await (const data of result) {
        rawData.push(data);
      }
      return new BaseResponse(RESULT_STATUS.OK, rawData, KEYS.SUCCESS);
    } catch (error) {
      return new BaseResponse(RESULT_STATUS.ERROR, [], error);
    }
  }

  private getSearchCondition(request: any, isSystem: boolean) {
    const company = isSystem ? SYSTEM_COMPANY : request.company;
    const condition = request.condition;
    const lang = request.lang;
    const collection = request.collection;
    const options = request.options;
    const collectionReq = [
      COLLECTIONS.MASTER_DATA,
      COLLECTIONS.COMPANY,
      COLLECTIONS.CAPTION,
      COLLECTIONS.M_COMPANY,
      COLLECTIONS.M_TITLE,
    ];
    const mapData = [];

    isSystem && collection === COLLECTIONS.USER_SETTING && condition['user_id']
      ? delete condition['user_id']
      : '';

    let aqlStr = `FOR data IN ${collection} `;
    aqlStr += `FILTER data.company == "${company}" `;
    for (const prop in condition) {
      if (prop === KEYS.NAME && collectionReq.includes(collection)) {
        aqlStr += `&& LOWER(data.name.${lang}) `;
        aqlStr += `LIKE LOWER(CONCAT("${condition[prop]}", "%")) `;
      } else {
        const data = condition[prop];
        if (isObjectFull(data)) {
          if (data.operator && hasLength(data.value)) {
            aqlStr += ` && data.${prop} ${data.operator} ${JSON.stringify(
              data.value
            )} `;
          }
          if (
            data.attribute &&
            data.ref_collection &&
            data.ref_attribute &&
            !isSystem
          ) {
            mapData.push(data);
          }
        } else {
          aqlStr += `&& data.${prop} == `;
          aqlStr +=
            typeof condition[prop] === 'string'
              ? `"${condition[prop]}" `
              : `${condition[prop]} `;
        }
      }
    }

    if (isObjectFull(options?.sort_by)) {
      aqlStr += ` SORT data.${options.sort_by?.value} ${options.sort_by?.order_by} `;
    }

    if (options?.limit) {
      aqlStr += ` LIMIT ${options.limit} `;
    }

    aqlStr += `RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name, `;
    mapData.forEach((data) => {
      const ref_condition = data.ref_condition;

      aqlStr += ` ${data.attribute} : ( `;
      aqlStr += ` IS_ARRAY(data.${data.attribute}) == true ? ( `;
      aqlStr += ` FOR item IN TO_ARRAY(data.${data.attribute}) `;
      aqlStr += ` FOR doc IN ${data.ref_collection} `;
      aqlStr += ` FILTER doc.${data.ref_attribute} == item `;
      if (isObjectFull(ref_condition)) {
        for (const prop in ref_condition) {
          if (ref_condition[prop]) {
            aqlStr += ` && doc.${prop} == `;
            aqlStr +=
              typeof ref_condition[prop] === 'string'
                ? `"${ref_condition[prop]}" `
                : `${ref_condition[prop]} `;
          }
        }
      }
      aqlStr += ` RETURN `;
      aqlStr += data.return_field
        ? ` doc.${data.return_field}  ) : `
        : `{ _key: doc.code, value: doc.name.${lang} } ) : `;

      aqlStr += ` (FOR doc IN ${data.ref_collection} `;
      aqlStr += ` FILTER doc.${data.ref_attribute} == data.${data.attribute} `;
      if (isObjectFull(ref_condition)) {
        for (const prop in ref_condition) {
          if (ref_condition[prop]) {
            aqlStr += ` && doc.${prop} == `;
            aqlStr +=
              typeof ref_condition[prop] === 'string'
                ? `"${ref_condition[prop]}" `
                : `${ref_condition[prop]} `;
          }
        }
      }
      aqlStr += ` RETURN `;
      aqlStr += data.return_field
        ? ` doc.${data.return_field} )[0] ), `
        : `{ _key: doc.code, value: doc.name.${lang} })[0] ), `;
    });
    aqlStr += `  }) `;
    return aqlStr;
  }

  initialize(request: any, user?: SysUser) {
    this.company = request.company;
    this.lang = request.lang;
    this.username = user?._key || request?.user_id || KEYS.ADMIN;
  }

  setCommonInsert(data: any) {
    if (this.company) {
      data[KEYS.COMPANY] = this.company;
    }
    data[KEYS.DEL_FLAG] = false;
    data[KEYS.KEY] = AitUtils.guid;
    data[KEYS.CREATE_BY] = this.username;
    data[KEYS.CHANGE_BY] = this.username;
    data[KEYS.CREATE_AT] = AitUtils.getUnixTime();
    data[KEYS.CHANGE_AT] = AitUtils.getUnixTime();
  }

  setCommonUpdate(data: any) {
    if (this.company) {
      data[KEYS.COMPANY] = this.company;
    }
    data[KEYS.CHANGE_BY] = this.username;
    data[KEYS.CHANGE_AT] = AitUtils.getUnixTime();
  }
}