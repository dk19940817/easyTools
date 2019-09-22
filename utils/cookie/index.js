export const setCookie = (name, value, Days = 30) => {
    const exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
  };
  
  export const getCookie = name => {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`); // 正则匹配
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
    return null;
  };