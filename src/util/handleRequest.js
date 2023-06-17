// import HaiSnackbar from "@/components/Snackbar";
import {
  Delete,
  Get,
  Patch,
  Post,
  PostArray,
  PostForm,
  PostPage,
  PostStr,
  Put,
} from "../services/methods"; // 服务
import { queryParams, realType, validArray, validObject } from "./utils";
import { produce } from "immer";

// 获取请求方法及请求路径
export const metaRequest = (fetchUrl = "", config = {}) => {
  const { query, headers, params = {} } = config;
  const reqMethod = (
    fetchUrl && fetchUrl.split(":")[0] ? fetchUrl.split(":")[0] : ""
  ).toLocaleLowerCase();
  let reqUrl = fetchUrl && fetchUrl.split(":")[1] ? fetchUrl.split(":")[1] : "";

  // 需要query请求，query是一个需要放在url请求的参数对对象
  if (query && typeof query === "object") {
    reqUrl = reqUrl + queryParams(query);
  }

  // 请求方法列表
  const reqMethodList = {
    get: Get,
    put: Put,
    patch: Patch,
    delete: Delete,
    post: Post,
    poststr: PostStr,
    postform: PostForm,
    postarray: PostArray,
    postpage: PostPage,
    postformpage: PostForm, // 针对Form请求，但需要分页参数的时候处理
  };
  return reqMethodList[reqMethod]
    ? reqMethodList[reqMethod](reqUrl, params, headers)
    : `Request Error Method: ${reqMethod}`;
};

// 请求成功/失败反馈
export const responseFeedback = (props = {}) => {
  const { code = "", msg = "" } = props;

  let str = ["success", `${msg}`];
  if (code === undefined || code === "" || Number(code) !== 0) {
    str = ["error", msg];
  }
  // HaiSnackbar.open({
  //   type: str[0],
  //   message: str[1],
  // });
};

// 通过约束好的的数据结构，返回查询results
// eslint-disable-next-line complexity
export function getResults(res, ops) {
  let level = 3; // 需要map的层级数

  if (ops && ops.level) {
    level = ops.level;
  }

  let arr = [];
  switch (level) {
    case 1:
      if (res && Array.isArray(res) && res.length > 0) {
        arr = res.data.results;
      }
      break;
    case 2:
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        arr = res.data;
      }
      break;
    case 3:
      if (
        res.data &&
        res.data.results &&
        Array.isArray(res.data.results) &&
        res.data.results.length > 0
      ) {
        arr = res.data.results;
      }
      break;
    default:
      break;
  }

  return arr;
}

// 获取请求options
export function getFetchOps(response = {}, fetch, newFiList) {
  let arr = [];

  let { code, msg, data } = response;
  const { fetchIndex, fetchFor = "defaultValue" } = fetch;
  if ((Number(code) === 0 || msg === "success") && data) {
    // 键转换
    if (fetch.transKey && fetch.transValue) {
      let arr = produce(data, (draft) => {
        // data为array类型
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((item, index) => {
            draft[index][fetch.transValue] = data[index][fetch.transKey];
          });
        } else if (Object.prototype.toString.call(data) === "[object Object]") {
          // data为object类型
          draft[fetch.transValue] = data[fetch.transKey];
        }
      });
      data = [...arr];
    } else {
      data =
        validArray(data?.results).length > 0
          ? [...data.results]
          : validArray(data).length > 0
          ? [...data]
          : [];
      // console.log(data);
    }

    // 不能直接用fieldList，否则每次只能赋值当前次的值，上一次赋的值会无效
    arr = produce(newFiList, (draft) => {
      draft[fetchIndex][fetchFor] = data; // 请求值赋值
    });
  } else {
    arr = [...newFiList];
  }
  return arr;
}

/**
 * 获取请求对应参数-base
 * fetchBase：请求前置依赖，Object|Array
 * fetchBase.baseFrom：请求前置依赖，来自于..，enum|...
 * fetchBase.baseKey：请求前置依赖，来自于..的key，enum[key]|...
 * fetchBase.baseFor：请求前置后摇，一般是fetch的key，params[baseFor]|...
 */
export const getItemRequestParamsByBase = (props) => {
  const { fetchBase = {}, enums = {}, fetchParam = [] } = props;

  let obj = {};
  let obj2 = {};
  if (
    fetchBase &&
    realType(fetchBase) === "Object" &&
    fetchBase.baseFrom === "enum" &&
    validObject(enums)
  ) {
    const {
      baseKey,
      baseFor,
      baseValueKey,
      baseValueIndex = 0,
      baseValueMap,
    } = fetchBase;
    const index = baseValueIndex ?? 0;
    const vdx = enums[baseKey]?.findIndex(
      (em) =>
        em[baseValueKey]
          .toLocaleLowerCase()
          ?.indexOf(baseValueMap?.toLocaleLowerCase()) !== -1
    );

    obj[baseFor] =
      vdx !== -1
        ? enums[baseKey][vdx][baseValueKey]
        : enums[baseKey][index][baseValueKey]
        ? enums[baseKey][index][baseValueKey]
        : undefined;
  }

  // 暂时只针对fetchValueFrom和base关联处理
  validArray(fetchParam)?.map((item) => {
    const { fetchKey, fetchFor, fetchValueFrom } = item;
    if (fetchValueFrom?.toLocaleLowerCase() === "fetchbase" && obj.fetchKey) {
      obj2[fetchKey] = obj.fetchKey;
      obj2.fetchFor = fetchFor;
    }
    return item;
  });

  return obj2;
};
