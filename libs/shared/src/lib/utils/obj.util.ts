/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const objKeys = (val: any): string[] => Object.keys(val);
export const getOwnPropNames = (val: any): string[] =>
  Object.getOwnPropertyNames(val);
