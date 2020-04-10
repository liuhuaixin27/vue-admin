import axios from "axios";
import { Message } from "element-ui";

//创建axios,然后赋值给service
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi"; //判断环境变量，如果是开发环境就使用代理跨域
const service = axios.create({
  baseURL: BASEURL, //请求的目标地址
  timeout: 15000, //超时时间
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    let data = response.data;
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
