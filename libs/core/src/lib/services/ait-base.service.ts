/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  COLLECTIONS,
  DB_CONNECTION_TOKEN,
  hasLength,
  isNil,
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
import { PermissionOutput } from '../dtos/permission.dto';
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
  forAuv = [];
  filterAfter = [];

  async getPermission(request: any, user?: SysUser): Promise<PermissionOutput> {
    const { page_key, user_key, module_key } = request;
    const page_id = 'sys_page/' + page_key;
    const user_id = 'sys_user/' + user_key;

    const aqlStr = `
    LET role_list = (
      FOR v, e, p IN 1..1 INBOUND "${page_id}" sys_role_page
          FILTER e.module == "${module_key}"
          RETURN v._id
  )

  FOR role IN role_list
      FOR v, e, p IN 1..1 INBOUND "${user_id}" sys_role_user
          FILTER v._id == role
          RETURN {
              role_id: v._key,
              permission: e.permission
          }`;

    const resData = [];

    try {
      const res = await this.db.query(aqlStr);

      for await (const data of res) {
        resData.push(data);
      }
    } catch (error) {
      return error;
    }

    // merge permissions
    let permissions = [];
    resData.forEach((item) => {
      permissions = [...permissions, ...item?.permission];
    });

    // distince permisssions
    permissions = Array.from(new Set(permissions));
    const dto = new PermissionOutput();
    dto.user_id = user_key;
    dto.page = page_key;
    dto.module = module_key;
    dto.permission = permissions;

    return dto;
  }

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
    this.forAuv = [];
    this.filterAfter = [];
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
    aqlStr += `\r\nFOR data IN result`;
    if (this.forAuv.length > 0) {
      this.forAuv.length = Math.ceil(this.forAuv.length / 2);
      this.forAuv.forEach((data, index) => {
        if (index === 0) {
          aqlStr += `\r\n FILTER`;
        } else {
          aqlStr += `\r\n &&`;
        }
        aqlStr += `\r\n LOWER(data.${data.type}) `;
        aqlStr += `LIKE LOWER(CONCAT("%", TRIM("${data.value}"), "%")) `;
      });
    }

    if (this.filterAfter.length > 0) {
      this.filterAfter.length = Math.ceil(this.filterAfter.length / 2);
      this.filterAfter.forEach(data => {
        if (data.operator === OPERATOR.LIKE) {
          aqlStr += `\r\n &&`;
          aqlStr += `\r\n LOWER(data.${data.attribute}) `;
          aqlStr += `LIKE LOWER(CONCAT("%", TRIM("${data.valueAsString}"), "%")) `;
        }
      })
    }
    aqlStr += `\r\n RETURN MERGE(data, {name:  data.name.${lang} ? data.name.${lang} : data.name }) `;

    // console.log(aqlStr);

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
    const customData = [];
    const atributes = [];

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
      } else if (condition[prop]['filter_custom']) {
        const isValid = this.checkValidFilter(condition[prop]);
        if (isValid) {
          customData.push(condition[prop]);
          atributes.push(condition[prop]['join_field']);
        }
      } else {
        const data = condition[prop];
        if (isObjectFull(data)) {
          if (this.isValidCondition(data)) {
            if (data.target) {
              if (data.operator === OPERATOR.LIKE) {
                aqlStr += `&& \r\n LOWER(data.${data.target}) ${data.operator} `;
              } else {
                aqlStr += `&& \r\n data.${data.target} ${data.operator} `;
              }
            } else {
              if (data.operator === OPERATOR.LIKE) {
                aqlStr += `&& \r\n LOWER(data.${prop}) ${data.operator} `;
              } else if (Array.isArray(data.value) && data.is_match_full) {
                aqlStr += ` FILTER LENGTH(INTERSECTION(TO_ARRAY(${JSON.stringify(data.value)}), 
                  TO_ARRAY(data.${prop}))) == LENGTH(TO_ARRAY(${JSON.stringify(data.value)})) \r\n`;
              } else {
                aqlStr += `&& \r\n data.${prop} ${data.operator} `;
              }
            }

            switch (data.operator) {
              case OPERATOR.IN || OPERATOR.NOT_IN:
                if (hasLength(data.value) && !(Array.isArray(data.value) && data.is_match_full)) {
                  aqlStr += `${JSON.stringify(data.value)} `;
                }
                break;
              case OPERATOR.LIKE:
                if (hasLength(data.valueAsString)) {
                  aqlStr += `LOWER(CONCAT("%", TRIM("${data.valueAsString}"), "%")) `;
                } else if (isNumber(data.valueAsNumber)) {
                  aqlStr += `LOWER(CONCAT("%", ${data.valueAsNumber}, "%")) `;
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
            data.type === 'aureole-v' &&
            (prop === KEYS.CREATE_BY || prop === KEYS.CHANGE_BY)
          ) {
            this.forAuv.push({ type: prop, value: data.value ?? '' });
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
          if (data.filter_after) {
            this.filterAfter.push(data.filter_after);
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

    if (customData.length > 0) {
      const joinField = customData[0].join_field;
      const joinCollection = customData[0].join_collection;
      const joinAttribute = customData[0].join_attribute;
      const joinTarget = customData[0].join_target;

      aqlStr += `\r\nLET ${joinField} = (\r\n`;
      aqlStr += ` FOR record IN ${joinCollection} \r\n`;
      aqlStr += ` FILTER record.${joinAttribute} == data.${joinTarget} \r\n`;

      customData.forEach((data) => {
        switch (data.filter_custom.operator) {
          case OPERATOR.IN:
            aqlStr += ` FILTER LENGTH(INTERSECTION(TO_ARRAY(${JSON.stringify(
              data.filter_custom.value
            )}), 
            TO_ARRAY(record.${
              data.filter_custom.attribute
            }))) == LENGTH(TO_ARRAY(${JSON.stringify(
              data.filter_custom.value
            )})) \r\n`;
            break;
          case OPERATOR.LIKE:
            aqlStr += ` FILTER LOWER(record.${data.filter_custom.attribute}) LIKE LOWER (CONCAT("%", TRIM("${data.filter_custom.valueAsString}"),"%")) \r\n`;
            break;
          default:
            aqlStr += ` FILTER record.${data.filter_custom.attribute} ${data.filter_custom.operator} `;
            if (data.filter_custom.valueAsString) {
              aqlStr += `"${data.filter_custom.valueAsString} \r\n"`;
            } else {
              aqlStr += `${data.filter_custom.valueAsNumber} \r\n`;
            }
            break;
        }
      });

      aqlStr += ` RETURN record \r\n`;
      aqlStr += ` )\r\n`;
    }
    if (atributes.length > 0) {
      aqlStr += `FILTER LENGTH(${atributes[0]}) > 0\r\n`;
    }

    if (isObjectFull(options?.sort_by)) {
      aqlStr += ` SORT data.${options.sort_by?.value} ${options.sort_by?.order_by} `;
    }

    if (options?.limit) {
      aqlStr += ` LIMIT ${options.limit} `;
    }

    aqlStr += `\r\n RETURN MERGE(\r\n data, {\r\n name:  data.name.${lang} ? data.name.${lang} : data.name, `;
    // atribute
    if (atributes.length > 0) {
      aqlStr += `\r\n ${atributes[0]}, `;
    }
    //custom
    this.forAuv.forEach((prop) => {
      aqlStr += `\r\n ${prop.type}: (`;
      aqlStr += `\r\n data.is_matching == true ? (`;
      aqlStr += `\r\n LET item = (`;
      aqlStr += `\r\n FOR record IN user_profile`;
      aqlStr += `\r\n FILTER record.user_id == data.${prop.type}`;
      aqlStr += `\r\n RETURN record`;
      aqlStr += `\r\n )[0]`;
      aqlStr += `\r\n RETURN item.name`;
      aqlStr += `\r\n )[0] : data.${prop.type}`;
      aqlStr += `\r\n ), `;
    });
    //join
    joinData.forEach((data) => {
      if (!atributes.includes(data.join_field)) {
        aqlStr += ` \r\n ${data.join_field} : ( `;
        aqlStr += ` \r\n FOR record IN ${data.join_collection}`;
        aqlStr += ` \r\n FILTER record.${data.join_attribute} == data.${data.join_target}`;
        aqlStr += ` \r\n && record.del_flag == false `;
        aqlStr += ` \r\n RETURN record ), `;
      }
    });
    //ref
    mapData.forEach((data) => {
      if (!atributes.includes(data.join_field)) {
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
                  aqlStr += `LOWER(CONCAT("%", TRIM("${ref_condition.valueAsString}"), "%"))`;
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
                  aqlStr += `LOWER(CONCAT("%", TRIM("${ref_condition.valueAsString}"), "%"))`;
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
        if (data.return_field) {
          aqlStr += `\r\n doc.${data.return_field}`;
          if (data.is_multi_language) {
            aqlStr += `.${lang}`;
          }
          aqlStr += ` )[0] ), `;
        } else {
          aqlStr += `\r\n { _key: doc.${data.get_by}, value: doc.name.${lang} })[0] ), `;
        }
      }
    });
    aqlStr += `  }) `;
    return aqlStr;
  }

  checkValidFilter(data: any) {
    try {
      const operator = data['filter_custom']['operator'];
      const value = data['filter_custom']['value'];
      const valueAsString = data['filter_custom']['valueAsString'];
      const valueAsNumber = data['filter_custom']['valueAsNumber'];
      if (!operator) {
        return false;
      } else if (
        'join_field' in data &&
        isStringFull(data['join_field']) &&
        'join_collection' in data &&
        isStringFull(data['join_collection']) &&
        'join_attribute' in data &&
        isStringFull(data['join_attribute']) &&
        'join_target' in data &&
        isStringFull(data['join_target']) &&
        'attribute' in data['filter_custom'] &&
        isStringFull(data['filter_custom']['attribute']) &&
        'operator' in data['filter_custom'] &&
        isStringFull(data['filter_custom']['operator'])
      ) {
        return (
          operator &&
          ((hasLength(value) &&
            (operator === OPERATOR.IN || operator === OPERATOR.NOT_IN)) ||
            (!isNil(valueAsString) &&
              hasLength(valueAsString) &&
              operator !== OPERATOR.IN &&
              operator !== OPERATOR.NOT_IN) ||
            (!isNil(valueAsNumber) &&
              isNumber(valueAsNumber) &&
              operator !== OPERATOR.IN &&
              operator !== OPERATOR.NOT_IN))
        );
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  isValidCondition(data: any): boolean {
    return (
      data.operator &&
      ((!isNil(data.value) &&
        hasLength(data.value) &&
        (data.operator === OPERATOR.IN || data.operator === OPERATOR.NOT_IN)) ||
        (!isNil(data.valueAsString) &&
          hasLength(data.valueAsString) &&
          data.operator !== OPERATOR.IN &&
          data.operator !== OPERATOR.NOT_IN) ||
        (!isNil(data.valueAsNumber) &&
          isNumber(data.valueAsNumber) &&
          data.operator !== OPERATOR.IN &&
          data.operator !== OPERATOR.NOT_IN))
    );
  }

  initialize(request: any, user?: SysUser) {
    this.company = request.company;
    this.lang = request.lang;
    this.username =
      request?.user_id || user?._key || request?.user_id || KEYS.ADMIN;
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
