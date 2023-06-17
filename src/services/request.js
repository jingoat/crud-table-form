import { message } from "antd";
import axios from "axios";

// import HaiSnackbar from '@/components/Snackbar';
// import { history } from '@/redux/store';
import { validObject } from "../util/utils";
// import { STORAGE_STATIONCODE } from '@/web-cli/types/storage';
import {
  AUTH_CONFIG_URL,
  AUTH_TOKEN_URL,
  baseURL,
  ENV_WMS,
  noEnvPrev,
  ENV_REPORT,
} from "./constants";
import { errorCodes } from "./status";

// 请求超时
export const timeout = 30000;

// 错误处理器
export const errorHandler = (error) => {
  console.log("错误处理器", error);
  const response = error?.response;

  // 与后端统一http状态码:返回401跳转登录; 返回403为没有授权，无需跳转登录页
  const status = Number(response?.status);

  // if (status === 401) {
  //   const message = errorCodes?.filter((item) => item.code === status)[0]?.msg;
  //   HaiSnackbar.open({
  //     type: 'error',
  //     message: message,
  //   });

  //   history.push('/signin'); // 跳转至登录页面
  //   return;
  // }

  // 登录,用户名或密码错误时，接口返回了400，做特殊判断，此时不弹出错误框
  if (validObject(response) && validObject(response?.data)) {
    const { errorMsg, msg, error } = response.data;
    // HaiSnackbar.open({
    //   type: 'error',
    //   message: `${msg || errorMsg || error || 'Request Error'}`,
    // });
  } else {
    handleErrData(error, status);
  }
};

// 创建axios实例
const service = axios.create({
  baseURL, // 不同的服务会逐渐增加，所以不能统一写死baseURL，需要时各自在请求的URL添加
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    let { url } = config;
    const token = localStorage.getItem("token");
    const locale = localStorage.getItem("locale");
    const stationCode = localStorage.getItem("");

    if (stationCode) config.headers.stationCode = stationCode;

    // WMS环境
    if (noEnvPrev(url) && !url.startsWith(ENV_REPORT)) {
      // 兼容旧有接口无前缀的问题，否则所有接口需要手动加上/wms前缀
      config.baseURL = baseURL + ENV_WMS;
    }

    // 请求鉴权
    // 登录请求url
    if (url === AUTH_CONFIG_URL || url === AUTH_TOKEN_URL) {
      localStorage.removeItem("token");
    } else if (token) {
      // 非登录请求，有token
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const search = window.location.search;
      if (
        search?.indexOf("username") === -1 &&
        search?.indexOf("password") === -1 &&
        search?.indexOf("logout=success") === -1
      ) {
        // if (!token && url !== AUTH_CONFIG_URL && url !== AUTH_TOKEN_URL)
        // 非登录请求，无token
        // history.push('/signin');
      }
    }

    if (locale) {
      const { languageId } = JSON.parse(locale);

      config.headers.lang = languageId;
    }

    return config;
  },
  (error) => {
    console.log("异常", error);
    Promise.reject(error);
  }
);

// response拦截器
service.interceptors.response.use(
  (response) => {
    if (response && 200 <= response?.status && response?.status < 300) {
      // headers里有returnWholeRes参数且为true，将响应整个返回
      const { code, msg: tipsmsg } = response?.data;
      // 10100002:无效token   10100015:token过期   10100003:权限拒绝
      if (code === "10100002" || code === "10100015" || code === "10100003") {
        // history.push('/signin'); // 跳转至登录页面
        message.error(tipsmsg);
        return Promise.reject(new Error("token invalid"));
      }
      if (response.config.headers.returnWholeRes) return response;
      let resposeData = response.data;
      const { msg } = resposeData;
      if (msg) {
        resposeData = { ...resposeData, errorMsg: msg };
      }
      return resposeData;
    } else {
      Promise.reject(new Error("error"));
    }
  },
  (error) => {
    errorHandler(error); // 504执行  401 404 400 403
    return Promise.reject(error);
  }
);

export default service;

// 错误额外处理
function handleErrData(error, status) {
  const errData = JSON.parse(JSON.stringify(error)); // 504执行

  const { locale } = JSON.parse(localStorage.getItem("locale") || "{}");

  let text;
  if (errData.status || locale !== "zh") {
    text = handleErrStatus(errData);
    text = text === "Network Error" ? "请求出错" : text;
  } else {
    const codeIndex = errData.message.indexOf("code");
    if (codeIndex !== -1) {
      const code = Number(errData.message.substr(codeIndex + 4, 10) || 0);
      text = errorCodes.filter((item) => item.code === code)[0]?.msg;
    } else {
      text = errData.message || "请求失败";
    }
  }

  switch (status) {
    case 504:
      text = "服务异常, 请检查网络后重试";
      break;
    default:
      break;
  }

  // 提示信息
  // HaiSnackbar.open({
  //   type: 'error',
  //   message: text,
  // });
}

function handleErrStatus(errData) {
  let text;
  switch (errData.status) {
    case 0:
      text = `网络无连接，请检查网络后重试`; // 网络异常
      break;
    case 1:
      text = `网络不佳，请检查网络后重试`; // timeout超时
      break;
    default:
      text = errData.status
        ? `${errData.status}:${errData.message || "请求失败"}`
        : `${errData.message || "请求失败"}`;
      break;
  }

  return text;
}
