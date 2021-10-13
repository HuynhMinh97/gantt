/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  COLLECTIONS,
  DB_CONNECTION_TOKEN,
  hasLength,
  isNumber,
  isObjectFull,
  isStringFull,
  KEYS,
  OPERATOR,
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
  ) {}

  company = '';
  lang = '';
  username = '';
  refList = ['operator', 'value', 'target', 'valueAsString', 'valueAsNumber'];

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
    let aqlStr = `LET current_data = ( \r\n ${this.getSearchCondition(
      request,
      false
    )} \r\n) `;
    aqlStr += `\r\n`;
    aqlStr += `\r\nLET result = LENGTH(current_data) > 0 ? current_data : ( \r\n ${this.getSearchCondition(
      request,
      true
    )} \r\n) `;
    aqlStr += `\r\n`;
    aqlStr += `\r\nFOR data IN result \r\n RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name }) `;

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
    ];
    const mapData = [];
    const joinData = [];

    isSystem && collection === COLLECTIONS.USER_SETTING && condition['user_id']
      ? delete condition['user_id']
      : '';

    let aqlStr = `FOR data IN ${collection} \r\n`;
    aqlStr += ` FILTER data.company == "${company}" `;
    for (const prop in condition) {
      if (
        prop === KEYS.NAME &&
        collectionReq.includes(collection) &&
        isStringFull(condition[prop])
      ) {
        aqlStr += `&& \r\n LOWER(data.name.${lang}) `;
        aqlStr += `LIKE LOWER(CONCAT("%", "${condition[prop]}", "%")) `;
      } else if (prop === KEYS.DEL_FLAG) {
        aqlStr += `&& \r\n data.del_flag != true `;
      } else {
        const data = condition[prop];
        if (isObjectFull(data)) {
          if (this.isValidCondition(data)) {
            if (data.target) {
              aqlStr += ` && \r\n data.${data.target} ${data.operator} `;
            } else {
              aqlStr += ` && \r\n data.${prop} ${data.operator} `;
            }

            switch (data.operator) {
              case OPERATOR.IN || OPERATOR.NOT_IN:
                if (hasLength(data.value)) {
                  aqlStr += `${JSON.stringify(data.value)}`;
                }
                break;
              case OPERATOR.LIKE:
                if (hasLength(data.valueAsString)) {
                  aqlStr += `LOWER(CONCAT("%", "${data.valueAsString}", "%"))`;
                } else if (isNumber(data.valueAsNumber)) {
                  aqlStr += `LOWER(CONCAT("%", ${data.valueAsNumber}, "%"))`;
                }
                break;
              default:
                if (hasLength(data.valueAsString)) {
                  aqlStr += `"${data.valueAsString}" `;
                } else if (isNumber(data.valueAsNumber)) {
                  aqlStr += `${data.valueAsNumber} `;
                }
                break;
            }
          }
          if (
            data.attribute &&
            data.ref_collection &&
            data.ref_attribute &&
            !isSystem
          ) {
            mapData.push(data);
          }
          if (
            data.join_field &&
            data.join_target &&
            data.join_collection &&
            data.join_attribute &&
            !isSystem
          ) {
            joinData.push(data);
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

    aqlStr += `\r\n RETURN MERGE(\r\n data, {\r\n name:  data.name.${lang} ? data.name.${lang} : data.name, `;
    //join
    joinData.forEach((data) => {
      aqlStr += ` \r\n ${data.join_field} : ( `;
      aqlStr += ` \r\n FOR record IN ${data.join_collection}`;
      aqlStr += ` \r\n FILTER record.${data.join_attribute} == data.${data.join_target}`;
      aqlStr += ` \r\n RETURN record ), `;
    });
    //ref
    mapData.forEach((data) => {
      const ref_condition = data.ref_condition;

      aqlStr += ` \r\n ${data.attribute} : ( `;
      aqlStr += ` \r\n IS_ARRAY(data.${data.attribute}) == true ? ( `;
      aqlStr += ` \r\n FOR item IN TO_ARRAY(data.${data.attribute}) `;
      aqlStr += ` \r\n FOR doc IN ${data.ref_collection} `;
      aqlStr += ` \r\n FILTER doc.${data.ref_attribute} == item `;
      if (isObjectFull(ref_condition)) {
        for (const prop in ref_condition) {
          if (ref_condition[prop] && !~this.refList.indexOf(prop)) {
            aqlStr += ` && doc.${prop} == `;
            aqlStr +=
              typeof ref_condition[prop] === 'string'
                ? `"${ref_condition[prop]}" `
                : `${ref_condition[prop]} `;
          }
        }

        if (this.isValidCondition(ref_condition) && ref_condition.target) {
          aqlStr += ` && \r\n doc.${ref_condition.target} ${data.operator} `;
          switch (ref_condition.operator) {
            case OPERATOR.IN || OPERATOR.NOT_IN:
              if (hasLength(ref_condition.value)) {
                aqlStr += `${JSON.stringify(ref_condition.value)}`;
              }
              break;
            case OPERATOR.LIKE:
              if (hasLength(ref_condition.valueAsString)) {
                aqlStr += `LOWER(CONCAT("%", "${ref_condition.valueAsString}", "%"))`;
              } else if (isNumber(ref_condition.valueAsNumber)) {
                aqlStr += `LOWER(CONCAT("%", ${ref_condition.valueAsNumber}, "%"))`;
              }
              break;
            default:
              if (hasLength(ref_condition.valueAsString)) {
                aqlStr += `"${ref_condition.valueAsString}" `;
              } else if (isNumber(ref_condition.valueAsNumber)) {
                aqlStr += `${ref_condition.valueAsNumber} `;
              }
              break;
          }
        }
      }
      aqlStr += `\r\n RETURN `;
      aqlStr += data.return_field
        ? `\r\n  doc.${data.return_field}  ) : `
        : `\r\n { _key: doc.${data.get_by}, value: doc.name.${lang} } ) : `;

      aqlStr += `\r\n  (FOR doc IN ${data.ref_collection} `;
      aqlStr += `\r\n  FILTER doc.${data.ref_attribute} == data.${data.attribute} `;
      if (isObjectFull(ref_condition)) {
        for (const prop in ref_condition) {
          if (ref_condition[prop] && !~this.refList.indexOf(prop)) {
            aqlStr += ` &&\r\n  doc.${prop} == `;
            aqlStr +=
              typeof ref_condition[prop] === 'string'
                ? `"${ref_condition[prop]}" `
                : `${ref_condition[prop]} `;
          }
        }

        if (this.isValidCondition(ref_condition) && ref_condition.target) {
          aqlStr += ` && \r\n doc.${ref_condition.target} ${data.operator} `;
          switch (ref_condition.operator) {
            case OPERATOR.IN || OPERATOR.NOT_IN:
              if (hasLength(ref_condition.value)) {
                aqlStr += `${JSON.stringify(ref_condition.value)}`;
              }
              break;
            case OPERATOR.LIKE:
              if (hasLength(ref_condition.valueAsString)) {
                aqlStr += `LOWER(CONCAT("%", "${ref_condition.valueAsString}", "%"))`;
              } else if (isNumber(ref_condition.valueAsNumber)) {
                aqlStr += `LOWER(CONCAT("%", ${ref_condition.valueAsNumber}, "%"))`;
              }
              break;
            default:
              if (hasLength(ref_condition.valueAsString)) {
                aqlStr += `"${ref_condition.valueAsString}" `;
              } else if (isNumber(ref_condition.valueAsNumber)) {
                aqlStr += `${ref_condition.valueAsNumber} `;
              }
              break;
          }
        }
      }
      aqlStr += `\r\n RETURN `;
      aqlStr += data.return_field
        ? `\r\n doc.${data.return_field} )[0] ), `
        : `\r\n { _key: doc.${data.get_by}, value: doc.name.${lang} })[0] ), `;
    });
    aqlStr += `  }) `;
    return aqlStr;
  }

  isValidCondition(data: any): boolean {
    return (
      data.operator &&
      ((hasLength(data.value) &&
        (data.operator === OPERATOR.IN || data.operator === OPERATOR.NOT_IN)) ||
        (hasLength(data.valueAsString) &&
          data.operator !== OPERATOR.IN &&
          data.operator !== OPERATOR.NOT_IN) ||
        (isNumber(data.valueAsNumber) &&
          data.operator !== OPERATOR.IN &&
          data.operator !== OPERATOR.NOT_IN))
    );
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
    if (this.env?.isMatching) {
      data[KEYS.IS_MATCHING] = true;
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
