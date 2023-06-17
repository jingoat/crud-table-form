// import { fetchError } from '@/redux/actions';
import { queryParams } from "../util/utils";
// import { saveRequestErrToStorage } from '@/web-cli/log/request.error.ts';
import qs from "qs";
import service, { timeout } from "./request";

// req-callback封裝
const reqApi = async (str, datas, form) => {
  const { url, data, headers, responseType } = datas;
  try {
    // const { timeout } = headers
    let isFormHeaders = {
      "Access-Control-Allow-Origin": "*", // 解决cors头问题
      "Access-Control-Allow-Credentials": "true", // 解决session问题
      ...headers,
    };

    // form 请求
    if (form) {
      isFormHeaders = {
        ...isFormHeaders,
        "Content-Type":
          typeof form === "boolean"
            ? "application/x-www-form-urlencoded; charset=UTF-8"
            : form, // 将表单数据传递转化为form-data类型
      };
    }
    let newAxios; // 对于不同的请求方式，axios参数位置不同
    if (
      str === "get" ||
      str === "request" ||
      str === "delete" ||
      str === "head" ||
      str === "options"
    ) {
      newAxios = await service[str](url, {
        params: form ? qs.stringify(data) : { ...data },
        headers: isFormHeaders,
        withCredentials: true,
        responseType: responseType || "",
        timeout: headers?.timeout || timeout,
      });
    } else {
      newAxios = await service[str](url, form ? qs.stringify(data) : data, {
        headers: isFormHeaders,
        withCredentials: true,
        responseType: responseType || "",
        timeout: headers?.timeout || timeout,
        // timeout: timeout ? timeout : 5000
      });
    }
    return newAxios;
  } catch (error) {
    // 日志存储
    const data = JSON.parse(JSON.stringify(error)) || {};
    // 日志存储
    // saveRequestErrToStorage({ data });
    return error;
  }
};

// req-callback封裝 - data是array
const reqArray = async (str, { url, arr, headers }) => {
  const arrData = Array.isArray(arr) ? arr : [arr];
  try {
    return service[str](url, arrData, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      transformRequest: [
        function (data) {
          if (!data || !Array.isArray(data) || data.length === 0) {
            return "[]";
          }

          let sendArr = [];
          data.forEach((item) => {
            // 当item是对象的时候，需要处理为string
            if (typeof item === "object") {
              const draftItem = JSON.stringify(item);
              sendArr = sendArr.concat(draftItem);
            } else {
              sendArr = sendArr.concat(item);
            }
          });
          /* 这里应该是要格式化成标准的json字符串吧，
            而不是用模板字符串(传到后台会导致数组元素包含不
            能转成number的字符串的元素没法格式化成标准的
            json字符串，然后没法解析)，为了兼容之前的逻辑
            我加了个if，如果错了麻烦指正(isFormatToJsonStr
            放在headers是因为这个函数已经三个参数了，不能加第四个参数) */
          let str = `[${sendArr.toString()}]`;
          if (headers?.isFormatToJsonStr) {
            str = JSON.stringify(sendArr);
          }

          // 对 data 进行任意转换处理
          return str;
        },
      ],
    });
  } catch (error) {
    console.log("请求错误：", error);
    // 日志存储
    // saveRequestErrToStorage({ data: error });
    return await error;
  }
};

// 参数为字符串
const reqStr = async (str, { url, data, headers }) => {
  try {
    return service[str](url, data, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      transformRequest: [
        function (data) {
          if (!data) {
            return "";
          }

          if (typeof data !== "string") {
            return JSON.stringify(data);
          }
          return data;
        },
      ],
    });
  } catch (error) {
    // 日志存储
    // saveRequestErrToStorage({ data: error });
    return await error;
  }
};

// 對應請求方法
export const Get = (url, data, headers) =>
  reqApi("get", { url, data, headers });

// 基本post请求
export const Post = (url, data, headers) =>
  reqApi("post", { url, data, headers });

// 基本post请求 - pageIndex和pageSize通过query传参
export const PostPage = (url, data, headers) => {
  let reqData;
  let page = "";
  let reqUrl = url;
  if (!data || Object.keys(data).length === 0) {
    reqData = {};
  } else {
    const { pageIndex, pageSize, ...more } = data;
    page = {
      pageIndex: pageIndex ? pageIndex : 1,
      pageSize: pageSize ? pageSize : 10,
    };
    reqUrl = `${url}${queryParams(page)}`;
    reqData = more ? { ...more } : {};
  }
  return reqApi("post", { url: reqUrl, data: reqData, headers });
};

// 请求体使用form
export const PostForm = async (url, data, headers) =>
  reqApi("post", { url, data, headers }, true);

// 请求体使用form
export const PostFile = async (url, datas) => {
  const { data, headers, flag = true } = datas;
  return reqApi("post", { url, data, headers }, flag);
};

// 请求参数array，不是object
export const PostArray = async (url, data, headers) =>
  reqArray("post", { url, arr: data, headers });

// 请求参数是字符串
export const PostStr = async (url, data, headers) =>
  reqStr("post", { url, data, headers });

// 基本delete请求
export const Delete = (url, data, headers) =>
  reqApi("delete", { url, data, headers });

// 基本put请求
export const Put = (url, data, headers) =>
  reqApi("put", { url, data, headers });

// 基本patch请求
export const Patch = (url, data, headers) =>
  reqApi("patch", { url, data, headers });

// post导出请求
export const PostExport = (url, data, headers) =>
  reqApi("post", { url, data, headers, responseType: "blob" });

// post导出请求
export const PostFormExport = (url, data, headers) =>
  reqApi("post", { url, data, headers, responseType: "blob" }, true);

// get导出请求
export const GetExport = (url, data, headers) =>
  reqApi("get", { url, data, headers, responseType: "blob" });

// redux 请求的时候可能会引起错误，统一错误捕获并处理
export function secureDispatch(callback, dispatch) {
  try {
    callback();
  } catch (error) {
    // 日志存储
    // saveRequestErrToStorage({ data: error });
    // dispatch(fetchError(error.message));
  }
}
