import { produce } from "immer";

// 对象转换成a=123&b=345格式

export const queryParams = (params) => {
  let str = "";
  let index = 0;
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key]) {
      str += `${index > 0 ? "&" : "?"}${key}=${params[key]}`;
      index++;
    }
  }
  return str;
};

// 去除无效键值对
export const filterObject = (param) => {
  const newObj = Array.isArray(param) ? [] : {};

  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      if (
        realType(param[key]) === "String" ||
        realType(param[key]) === "Number" ||
        realType(param[key]) === "Boolean"
      ) {
        const value = param[key];
        if (value || value === 0 || value === false) {
          newObj[key] = value;
        }
        // newObj[key] = value ? value : (value === 0 ? 0 : value);
      } else if (
        realType(param[key]) === "Object" ||
        realType(param[key]) === "Array"
      ) {
        newObj[key] = filterObject(param[key]);
      } else {
        // console.log(`字段${key}为函数/暂用字段，不能正常过滤`);
      }
    }
  }
  return newObj;
};

/**
 * @param {key}     被修改字段名
 * @param {value}   修改后的字段名
 * @description:    修改对象的字段名
 */
export const changeObjectKey = (obj, key, value) => {
  // var reg = new RegExp('^[0-9]+' + param + '[a-z]+$', 'g'); //得到：/^[0-9]+3[a-z]+$/
  // const reg = new RegExp(`${key}`, "g");
  // return JSON.parse(JSON.stringify(obj).replace(reg, value));
  const changeObject = {};
  for (let o in obj) {
    if (o === key) {
      changeObject[value] = obj[o];
    } else {
      changeObject[o] = obj[o];
    }
  }
  return changeObject;
};

// 数组元素互换
export function swapArray(arr, start, end) {
  arr[start] = arr.splice(end, 1, arr[start])[0];
  return arr;
}

// 判断两个简单对象是否全等
// eslint-disable-next-line complexity
export function simpleObjectEqual(obj1, obj2) {
  if (!obj1 && !obj2) {
    return true;
  }
  if ((!obj1 && obj2) || (obj1 && !obj2)) {
    return false;
  }

  let flag = true;
  const len1 = Object.keys(obj1).length;
  const len2 = Object.keys(obj2).length;

  if (len1 === len2) {
    for (const key in obj1) {
      if (Object.hasOwn(obj1, key)) {
        // 有一个值不全等，对象不全等
        if (typeof obj1[key] !== "function" && obj2[key] !== obj1[key]) {
          flag = false;
          break;
        } else if (Array.isArray(typeof obj1[key])) {
          if (obj1[key].length !== obj2[key].length) {
            flag = false;
            break;
          } else {
            obj1[key].forEach((item, index) => {
              if (!simpleObjectEqual(obj1[key][index], obj2[key][index])) {
                flag = false;
              }
            });
          }
        }
      }
    }
  } else {
    flag = false;
  }
  return flag;
}
/**
 * 判断是否function
 */
export const validFunction = (fn) => {
  if (!fn) {
    return false;
  }
  return Object?.prototype?.toString?.call(fn) === "[object Function]";
};

/**
 * 判断可用对象
 */
export function validObject(obj) {
  if (obj && typeof obj === "object" && Object.keys(obj).length > 0) {
    return obj;
  }

  return null;
}

/**
 * 可用对象
 */
export function emptyObject(obj) {
  return !(typeof obj === "object" && Object.keys(obj).length > 0);
}

/**
 * 判断可用数组
 */
export function validArray(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr;
  }
  return [];
}
/**
 * 对象转string
 */
export function objectToString(obj) {
  if (!obj) return "-";
  return JSON.stringify(obj)
    .replaceAll('"', "")
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll(",", ", ");
}

// 过滤对象原型
const filterObjectProto = (obj) => {
  if (!obj || Object.keys(obj).length === 0) {
    return {};
  }

  let newObj = {};
  const keys = Object.keys(obj);
  keys.forEach((item) => {
    if (Object?.prototype?.toString?.call(item) !== "[object Function]") {
      newObj[item] = obj[item];
    }
  });

  return newObj;
};

// 递归数组
const mapRecursiveArray = (arr) => {
  if (!arr || arr.length === 0) {
    return [];
  }
  let list = [];
  for (const item of arr) {
    if (typeof item === "symbol") {
      list = list.concat(Object.getOwnPropertySymbols(item));
    } else if (typeof item === "function") {
      list = list.concat(Object.getOwnPropertyNames(item));
    } else if (typeof item === "object") {
      list = list.concat(mapRecursive(item));
    } else if (Array.isArray(item)) {
      list = list.concat(mapRecursiveArray(item));
    } else {
      list = list.concat(item);
    }
  }

  return list;
};

// 通过递归遍历对象，扁平化所有的value
function mapRecursive(obj) {
  if (!obj || !validObject(obj) || Object.keys(obj).length === 0) {
    return [];
  }

  if (typeof obj === "symbol") {
    return ["symbol"];
  }

  // 过滤symbol对象，symbol不可被遍历
  return mapRecursiveKeys(Object.keys(obj), obj);
}

// 判断抽离-减少函数复杂度
function mapRecursiveKeys(keys, obj) {
  let list = [];
  for (const index in keys) {
    if (Object.hasOwn(keys, index)) {
      const currentItem = obj[keys[index]];

      if (
        (currentItem && keys[index] !== "children") || // 非children字段
        (currentItem && keys[index] === "children" && !currentItem?.type) // children字段，但不是reactNode
      ) {
        list = list.concat(mapCurrentTypes(currentItem));
      }
    }
  }
  return list;
}

// 判断抽离-减少函数复杂度
function mapCurrentTypes(currentItem) {
  let list = [];
  if (
    // typeof currentItem === 'object' &&
    // currentItem instanceof Object &&
    realType(currentItem) === "Object" &&
    Object.keys(filterObjectProto(currentItem)).length > 0
  ) {
    // 如果是对象，递归调用
    list = list.concat(mapRecursive(filterObjectProto(currentItem)) || []);
  } else if (Array.isArray(currentItem)) {
    // 如果是数组，map后递归调用
    list = list.concat(mapRecursiveArray(currentItem));
  } else {
    // 简单类型-最终想要的value
    list = list.concat(currentItem);
  }
  return list;
}

// 转换field的驼峰命名
export const transCamelFieldName = (oldObject, config = {}) => {
  if (!validObject(oldObject)) {
    return {};
  }
  const variant = config && config.variant ? config.variant : "lowerCase"; // 首字母转换，默认转换成小写

  let newObject = {};
  for (const key in oldObject) {
    if (Object.hasOwn(oldObject, key)) {
      newObject[transKeyFirstWord(key, variant)] = oldObject[key];
    }
  }
  return newObject;
};

// 首字母转换，默认转换成小写，否则大写
const transKeyFirstWord = (str, variant = "lowerCase") => {
  if (!str) {
    return "";
  }
  const str2 =
    variant === "lowerCase"
      ? str.slice(0, 1).toLocaleLowerCase()
      : str.slice(0, 1).toUpperCase();
  const str3 = str.slice(1, str.length);
  return str2 + str3;
};

// 获取真实数据类型
export const realType = (og, lowerCase = "normal") => {
  try {
    const types = {
      normal: "normal",
      lower: "lower",
      upper: "upper",
    };
    if (lowerCase && !types[lowerCase]) {
      console.warn(og + "：请使用枚举值 normal|lower|upper");
    }

    let str = Object?.prototype?.toString?.call(og);
    str = str.split("object ");
    str = str[1] ? str[1].split("]") : str[0];
    str = str[0];
    str =
      lowerCase === "lower"
        ? str.toLocaleLowerCase()
        : lowerCase === "upper"
        ? str.toUpperCase()
        : str;

    return str;
  } catch (error) {
    console.error(error);
  }
};

// 打平多维对象、数组，返回新的【数组】__TODO:v2.0可以指定key
const flatToArray = (arr) => {
  if (
    !arr ||
    (Object?.prototype?.toString?.call(arr) !== "[object Object]" &&
      Object?.prototype?.toString?.call(arr) !== "[object Array]")
  ) {
    return arr ? [arr] : arr === 0 ? [0] : [];
  }
  let list;
  if (Array.isArray(arr)) {
    list = arr;
  } else {
    list = [arr];
  }

  return list.reduce((pre, cur) => {
    const object =
      Object?.prototype?.toString?.call(cur) === "[object Object]"
        ? getFlatArray(cur)
        : cur;

    return pre.concat(Array.isArray(cur) ? flatToArray(cur) : object);
  }, []);
};

// 获取打平的数组__TODO:v2.0可以指定key
function getFlatArray(cur) {
  let rent = [];
  if (!cur) {
    return rent;
  }

  const type = Object?.prototype?.toString?.call(cur);

  switch (type) {
    case "[object Object]":
      for (const key in cur) {
        if (Object.hasOwn(cur, key)) {
          rent = rent.concat(
            Array.isArray(key)
              ? flatToArray(cur[key])
              : rent.concat(getFlatArray(cur[key]))
          );
        }
      }
      break;
    case "[object Array]":
      rent = rent.concat(flatToArray(cur));
      break;
    default:
      rent = rent.concat(cur);
      break;
  }

  return rent;
}

// 容器一维数组转化成二维数组
export function arrTrans(num, arr = []) {
  // const { subContainerLevel, subContainerBay } = config;
  // num个子数组  arr数组
  const iconsArr = []; // 声明数组
  for (let i = 0; i < num; i++) {
    iconsArr?.push([]);
  }

  arr?.forEach((item) => {
    iconsArr[(item.subContainerLevel || item.level) - 1]?.push(item);
  });
  iconsArr.forEach((v) => {
    v.sort(
      (a, b) => (a.subContainerBay || a.bay) - (b.subContainerBay || b.bay)
    );
  });
  return iconsArr;
}

export function getEnumLabel(enums, { key, value }) {
  let val = enums[key]?.filter((item) => item.enumValue === value);
  return val?.length && val[0] ? val[0].label : "";
}

// 获取格式如cookie的数据对应key的值 'a=E3B15467D3F19A5C2AA961AAE578CD74;b=1645066010;c=1111'
export function getValue(key, data) {
  let newKey = `${key}=`;
  let str = decodeURIComponent(data);
  if (!str) {
    return "";
  }
  let arr = str.split(";");
  let curItem = arr.find((item) => item.indexOf(newKey) === 0);
  if (!curItem) {
    return "";
  }
  return curItem.replace(newKey, "");
}

// 判断定制需求是否有权限
export const getPermissionToShow = (auth) => {
  const sys = JSON.parse(localStorage.getItem("webCustomConfig") ?? "[]");

  if (sys.length === 0) {
    console.log("无权限list");
    return false;
  }
  const current_project = JSON.parse(
    localStorage.getItem("project") || "{}"
  )?.project;
  if (!current_project) {
    console.log(
      "让测试配置NACOS对应的项目名称，前端读取的是/user/external/get返回的项目配置信息"
    );
    // 没有配置，返回false
    return false;
  }
  const findItem = sys.find((item) => item.id === auth);
  if (findItem) {
    if (
      !findItem.permissionProjects ||
      typeof findItem.permissionProjects === "string"
    ) {
      return findItem?.permissionProjects?.indexOf(current_project) !== -1;
    }
    return (
      findItem.permissionProjects.findIndex(
        (str) => str === current_project
      ) !== -1
    );
  }
  return false;
};

export const addExtraText = (
  options = [],
  valueKey = "label" /* 被添加的字段名 */,
  addValueKey = "nums" /* 添加的字段名 */
) => {
  const newOptions = produce(options, (draft) => {
    draft.forEach((item, index) => {
      draft[index][valueKey] = `${item[valueKey]} (${item[addValueKey]})`;
    });
  });
  return newOptions;
};

const handleCounterTime = (days, time, flag) => {
  if (!time) return null;
  if (flag === "start") {
    return time - days * 3600 * 24 * 1000;
  } else if (flag === "end") {
    const endTime = days * 3600 * 24 * 1000 + time;
    const newTime = new Date().getTime();
    return endTime > newTime ? newTime : endTime;
  }
};
// 计算选择时间的时间戳 flag: 'start' | 'end', 表格时间选择器设置时间范围
// 如果只选了结束时间，flag为start，计算开始时间；
// 如果只选了开始时间，flag为end计算结束时间。
export const getLostStartEndTime = (start, end, day) => {
  let startCreate = start;
  let endCreate = end;
  if (start && !end) {
    endCreate = handleCounterTime(day, start, "end");
    startCreate = start;
  }

  if (!start && end) {
    startCreate = handleCounterTime(day, end, "start");
    endCreate = end;
  }

  return [startCreate, endCreate];
};

export const BOOLEAN_ENUM = [
  {
    label: "sure",
    value: true,
  },
  {
    label: "no",
    value: false,
  },
];

export const formatOptions = ({
  options = [],
  labelKey,
  valueKey,
  transformLabel = "label",
  transformValue = "value",
}) => {
  const newOptions = options.map((item) => {
    if (typeof item !== "object") return item;
    return {
      ...item,
      [transformValue]: item[valueKey],
      [transformLabel]: item[labelKey],
    };
  });
  return newOptions;
};
