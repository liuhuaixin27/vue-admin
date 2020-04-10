import service from "@/utils/request";
/* 获取登录验证码 */
export function GetSms(data) {
  return service.request({
    method: "post",
    url: "/getSms/",
    data,
    //data: data, 同名可以只写一个
  });
}

/* 注册 */
export function Register(data) {
  return service.request({
    method: "post",
    url: "/register/",
    data,
  });
}

/* 获取用户角色 */

/* 登录 */
export function Login(data) {
  return service.request({
    method: "post",
    url: "/login/",
    data,
  });
}

/* 注册 */
