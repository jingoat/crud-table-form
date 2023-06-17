export const ENV_WMS = "/wms"; // WMS环境服务前缀
const ENV_USER = "/user"; // USER环境服务前缀
const ENV_STATION = "/station"; // STATION环境服务前缀
const ENV_ADAPTER = "/adapter"; // ADAPTER环境服务前缀
const ENV_HAILINK = "/hai-link"; // HAILINK环境服务前缀
const ENV_SIMU = "/simulator"; // 仿真平台环境服务前缀
const ENV_SIMU_SERVER = "/simuserver"; // 仿真平台_服务器服务前缀
const ENV_INTERNATIONAL = "/i18n";
export const ENV_REPORT = "/report"; // 报表环境服务前缀
export const noEnvPrev = (url) =>
  envPrev(url, [
    ENV_WMS,
    ENV_USER,
    ENV_STATION,
    ENV_ADAPTER,
    ENV_HAILINK,
    ENV_SIMU,
    ENV_SIMU_SERVER,
    ENV_INTERNATIONAL,
  ]); // url => urlPattern(url, ENV_WMS) && urlPattern(url, ENV_USER);

export const AUTH_CONFIG_URL = `${ENV_USER}/config.js`; // 登录初始化请求,需要获取对应配置
export const AUTH_TOKEN_URL = `${ENV_USER}/oauth/token`; // 登录请求,依赖AUTH_CONFIG_URL
export const AUTH_LOGIN_URL = `${ENV_USER}/api/user/login`; // 登录请求

export const { NODE_ENV, REACT_APP_Proxy_BaseURL } = process.env; // 统一网关
const URL_PORT = window.location.port;
export const baseURL =
  NODE_ENV === "production"
    ? REACT_APP_Proxy_BaseURL
      ? REACT_APP_Proxy_BaseURL
      : "/gw"
    : REACT_APP_Proxy_BaseURL;
console.log(process.env, URL_PORT);

export const loginUrl = `?loginUrl=${window.location.origin}/signin`;
export const LOGOUT_URL = `/api/user/logout${loginUrl}`; // 退出系统

function urlPattern(url, prev) {
  // 兼容baseUrl没有'/'的情况
  let str = prev.split("/");
  str = str[1] || str[0];
  return url.toLocaleLowerCase().indexOf(str) === -1;
}

function envPrev(url, arr = []) {
  let flag = true;
  for (const str of arr) {
    if (!urlPattern(url, str)) {
      flag = false;
      break;
    }
  }

  return flag;
}
