import dayjs from "dayjs";

// 表头字体大小
export const columnFontSize = 14;
// 表头字体颜色
export const columnFontColor = 777;

// 表格字体大小
export const cellFontSize = 14;
// 表格字体颜色
export const cellFontColor = 333;

// 最大数字
export const MAX_NUMBER = 2147483647;

// 时间戳格式化-日期
const dateFormat = "YYYY-MM-DD";
// 时间戳格式化-当天
const timeFormat = "HH:mm:ss";
// 时间戳格式化-年月日时间
const dateTimeFormat = `${dateFormat} ${timeFormat}`;
export const dateTimeFormatFn = (num) =>
  num ? dayjs(Number(num)).format(dateTimeFormat) : null;

export const dataLanguageFormatFn = (list) =>
  list
    ? Object.getOwnPropertyNames(list)
        .map((item) => {
          return list[item];
        })
        .join(";")
    : null;
// 得到时间间隔
export const getDateDiff = (diffValue) => {
  let minute = 1000 * 60;
  let hour = minute * 60;
  if (diffValue < 0) {
    return;
  }
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  let result;
  if (hourC >= 1) {
    result = (
      <>
        {Math.round(hourC * 10) / 10}
        hour
      </>
    );
  } else {
    result = (
      <>
        {Math.round(minC)}
        minute
      </>
    );
  }
  return result;
};

export const SNACKBAR_TYPE_SUCCESS = "success";
export const SNACKBAR_TYPE_ERROR = "error";
