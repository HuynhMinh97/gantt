/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArrayFull, isNil, KEYS, KeyValueDto, STRING_EMPTY, SYMBOLS } from '@ait/shared';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { COLLECTIONS } from '../commons/enums';

export class CommonUtils {
  static join(...params: any): string {
    if (!isNil(params)) {
      return params.join(STRING_EMPTY);
    }
    return STRING_EMPTY;
  }

  static getKeysFromEdge(key: any, collection: COLLECTIONS): any {
    let ret = null;
    if (key && isArrayFull(key)) {
      ret = key.map((element) => {
        return this.join(collection, SYMBOLS.SLASH, element);
      });
      return ret;
    }
    return [this.join(collection, SYMBOLS.SLASH, key)];
  }

  static checkRoles = (roleContext: string[], userRoles: string[] | string): string[] => {
    // Logger.log('Checking roles ...')
    // Logger.log(roleContext)
    const USERROLE = typeof userRoles === "string" ? [userRoles] : userRoles;
    const sameElements = USERROLE.filter(value => roleContext.includes(value));
    // Logger.log('checkRoles : ' + sameElements)
    return sameElements;
  }


  /**
   *
   *
   * @param {*} doc
   * @param {string} lang
   * @returns {KeyValueDto}
   * @memberof Utils
   */
  static getKeyValue(doc: any, lang: string): KeyValueDto {
    const kv = {} as KeyValueDto;
    if (isNil(doc)) return kv;
    // set key
    kv._key = doc[KEYS.KEY];
    // set value with current lang
    kv.value = doc[KEYS.NAME] ? doc[KEYS.NAME][lang] : STRING_EMPTY;
    return kv;
  }

  static getDoc(res: any, onlyFirst = false): any {
    if (isArrayFull(res.data)) {
      if (onlyFirst) {
        return res.data[0][KEYS.DOC];
      }
      const ret = [];
      res.data.forEach((item) => {
        if (item[KEYS.DOC]) {
          ret.push(item[KEYS.DOC]);
        }
      });
      return ret;
    }
  }

  static editFileName = (req, file, callback) => {
    const name = file.originalname.split('{_}')[2];
    const fileExtName = extname(name);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 10).toString(10))
      .join('');
    callback(null, `${name}${randomName}${fileExtName}`);
  };
  // Allow only images
  static imageFileFilter = (req, file, callback) => {
    const name = file.originalname.split('{_}')[2];
    // // // console.log(name,file)
    if (!name.match(/\.(jpg|jpeg|png|gif|doc|docx|xls|xlsx|json|csv|pdf)$/)) {
      return callback(
        new HttpException(
          "Your file's format is not supported",
          HttpStatus.BAD_REQUEST
        ),
        false
      );
    }
    callback(null, true);
  };

}
