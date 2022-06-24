/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import moment from 'moment-business-days';

export const objKeys = (val: any): string[] => Object.keys(val);
export const getOwnPropNames = (val: any): string[] =>
  Object.getOwnPropertyNames(val);
export const getMonth = (date = 0): number => {
  try {
    if (date) {
      return new Date(date).getMonth() + 1;
    } else {
      return new Date().getMonth() + 1;
    }
  } catch {
    return null;
  }
};
export const isCurrentYear = (date: number): boolean => {
  return new Date().getFullYear() === new Date(date).getFullYear();
};
export const getSimpleMM = (data: any): number => {
  const { hour_plan, manday_plan, manmonth_plan } = data;
  if (manmonth_plan) {
    return manmonth_plan;
  }
  if (manday_plan) {
    return manday_plan / 20;
  }
  if (hour_plan) {
    return hour_plan / 160;
  }
  return 0;
};
export const getAdvancedMM = (
  data: any,
  planObj: any[],
  monthObj: number[]
) => {
  const { hour_plan, manday_plan, manmonth_plan, start_plan, end_plan } = data;
  let st = 0;
  let se = 0;
  let e1 = 0;
  let d0 = 0;
  let d1 = 0;
  let d2 = 0;
  let d3 = 0;
  let d4 = 0;
  const index1 = monthObj.findIndex((e) => e === getMonth(start_plan));
  const index2 = monthObj.findIndex((e) => e === getMonth(end_plan));
  if (~index1) {
    let diff = 0;
    if (~index2) {
      diff = moment(end_plan).businessDiff(moment(start_plan));
      se = end_plan;
    } else {
      const lastOf3NextMonth = moment()
        .add(3, 'months')
        .endOf('month')
        .valueOf();
      diff = moment(lastOf3NextMonth).businessDiff(moment(start_plan));
      d4 = moment(end_plan).businessDiff(moment(lastOf3NextMonth));
      se = lastOf3NextMonth;
    }
    d1 = moment(start_plan).endOf('month').businessDiff(moment(start_plan));
    e1 = diff - d1;
    st = start_plan;
  } else {
    const firstOfNextMonth = moment()
      .add(1, 'months')
      .startOf('month')
      .valueOf();
    const endOfNextMonth = moment().add(1, 'months').endOf('month').valueOf();
    d0 = moment(firstOfNextMonth).businessDiff(moment(start_plan));
    if (getMonth(end_plan) === getMonth(firstOfNextMonth)) {
      d1 = moment(end_plan).businessDiff(moment(firstOfNextMonth));
    } else {
      d1 = moment(endOfNextMonth).businessDiff(moment(firstOfNextMonth));
    }
    let diff = 0;
    if (~index2) {
      diff = moment(end_plan).businessDiff(moment(firstOfNextMonth));
      se = end_plan;
    } else {
      const lastOf3NextMonth = moment()
        .add(3, 'months')
        .endOf('month')
        .valueOf();
      diff = moment(lastOf3NextMonth).businessDiff(moment(firstOfNextMonth));
      d4 = moment(end_plan).businessDiff(moment(lastOf3NextMonth));
      se = lastOf3NextMonth;
    }
    e1 = diff - d1;
    st = firstOfNextMonth;
  }
  if (e1 <= 20 && e1 !== 0) {
    d2 = moment(se).businessDiff(moment(st).add(1, 'months').startOf('month'));
  } else if (e1 !== 0) {
    d2 = moment(st)
      .add(1, 'months')
      .endOf('month')
      .businessDiff(moment(st).add(1, 'months').startOf('month'));
    d3 = moment(se).businessDiff(moment(st).add(2, 'months').startOf('month'));
  }
  const sum = d0 + d1 + d2 + d3 + d4;
  if (manmonth_plan) {
    planObj[0].mm += (manmonth_plan / sum) * d1;
    planObj[1].mm += (manmonth_plan / sum) * d2;
    planObj[2].mm += (manmonth_plan / sum) * d3;
    return;
  }
  if (manday_plan) {
    planObj[0].mm += (manday_plan / 20 / sum) * d1;
    planObj[1].mm += (manday_plan / 20 / sum) * d2;
    planObj[2].mm += (manday_plan / 20 / sum) * d3;
    return;
  }
  if (hour_plan) {
    planObj[0].mm += (manday_plan / 160 / sum) * d1;
    planObj[1].mm += (manday_plan / 160 / sum) * d2;
    planObj[2].mm += (manday_plan / 160 / sum) * d3;
    return;
  }
};
