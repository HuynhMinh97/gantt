/* eslint-disable @typescript-eslint/no-explicit-any */
import { STRING_EMPTY } from '../commons/consts';
import { KeyValueDto } from '../dtos/key-value.dto';
import { isArrayFull, isNil, isObject } from './checks.util';

export class Utils {
  static clone(obj: any): any {
    if (isArrayFull(obj)) {
      return Object.assign([], obj);
    } else if (isObject(obj)) {
      return Object.assign({}, obj);
    }
  }
  static getDoc(arrayData: any[]) {
    if (isArrayFull(arrayData)) {
      return arrayData[0]?.doc;
    }
    return arrayData;
  }

  static getArrayMasterKeyValue(array: any[], classCode: string, dataMaster: any[]) {

    const getDataByClassCode = dataMaster.filter(data => data?.class === classCode);
    if (classCode === 'JOB_OCCUPATION') {
      // console.log('master-datra', array, classCode, getDataByClassCode)
    }
    if (getDataByClassCode.length === 0) {
      return [];
    }
    const result = (array || []).map(ar => {
      const getDataByCode = getDataByClassCode.find(f => f.code === ar);
      return {
        _key: getDataByCode?._key,
        value: getDataByCode?.value
      }
    })
    return result
  }

  static getKey(obj: KeyValueDto): string {
    if (isNil(obj)) return null;
    return obj._key ? obj._key : null;
  }

  static getKeyValue(data: any, lang: string) {
    // // // console.log('data', data)
    if (!data || data === null) {
      return null
    }
    return {
      _key: data?.code,
      value: data?.name ? data?.name[lang] : null
    }
  }

  static getValue(obj: KeyValueDto): string {
    if (isNil(obj)) return null;
    return obj.value ? obj.value : null;
  }

  static getKeys(datas: KeyValueDto[]): string[] {
    const ret = [];
    if (isArrayFull(datas)) {
      datas.forEach((element) => {
        ret.push(element._key);
      });
    }
    return ret;
  }

  static join(...params: any): string {
    if (!isNil(params)) {
      return params.join(STRING_EMPTY);
    }
    return STRING_EMPTY;
  }

  static len(obj: any): number {
    if (!isNil(obj)) {
      return obj.length;
    }
    return 0;
  }

  static getDif2Days(date1: string | Date | any, date2: string | Date | any) {
    if (date1 === null || date2 === null) {
      return 0;
    }
    const date1Format = new Date(date1);
    const date2Format = new Date(date2);
    const diffTime = Math.abs(Number(date2Format) - Number(date1Format));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return typeof diffDays !== 'number' || isNaN(diffDays) ? 0 : diffDays;
  }

  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  static isUnixTimeEquals(unix1: number, unix2: number) {
    if (!unix1 || !unix2) {
      return false;
    } else {
      return new Date(unix1).setHours(0, 0, 0, 0) === new Date(unix2).setHours(0, 0, 0, 0);
    }
  }

  static format(value: string, ...args): string {
    try {
      return value.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
      });
    } catch (e) {
      return '';
    }
  }
}
