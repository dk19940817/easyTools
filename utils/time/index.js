import qs from 'qs';
export const noop = () => {};

// 秒数转换
export const timeConvert = timestamp => {
    let minutes = Math.floor(timestamp / 60);
    let seconds = Math.floor(timestamp - (minutes * 60));
  
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  
    const timestamps = `${minutes}:${seconds}`;
    return timestamps;
  };
  
  // 兼容iOS
  export const conveyStringToDate = time => new Date(time.replace(/-/g, '/'));
  
  export const getTimeFromNow = time => {
    const timeFormated = typeof time === 'string' ? conveyStringToDate(time) : time;
    const stime = new Date(timeFormated);
    const etime = new Date();
    const sjc = parseInt((etime.getTime() - stime.getTime()) / 1000, 10);
    let re;
    if (sjc < 60) {
      re = '刚刚';
    } else {
      if (sjc >= 60 * 60 * 24) {
        re = `${parseInt(sjc / (60 * 60 * 24), 10)}天`;
      } else if (sjc >= 60 * 60) {
        re = `${parseInt(sjc / (60 * 60), 10)}小时`;
      } else if (sjc >= 60) {
        re = `${parseInt(sjc / 60, 10)}分钟`;
      } else {
        re = `${sjc}秒`;
      }
      re += '前';
    }
    return re;
  };
  
  export const getTimeFromTime = time => {
    const timeFormated = typeof time === 'string' ? conveyStringToDate(time) : time;
    const stime = new Date(timeFormated);
    return {
      date: stime.getDate() < 10 ? `0${stime.getDate()}` : stime.getDate(),
      hour: stime.getHours() < 10 ? `0${stime.getHours()}` : stime.getHours(),
      month: (stime.getMonth() + 1) < 10 ? `0${stime.getMonth() + 1}` : stime.getMonth() + 1,
      year: stime.getFullYear(),
      minutes: stime.getMinutes() < 10 ? `0${stime.getMinutes()}` : stime.getMinutes(),
      seconds: stime.getSeconds() < 10 ? `0${stime.getSeconds()}` : stime.getSeconds(),
    };
  };
  export const getTimeForAudio = (time, pubtime) => {
    const timeFormated = typeof time === 'string' ? conveyStringToDate(time) : time;
    const stime = new Date(timeFormated);
    const etime = new Date();
    const sjc = parseInt((etime.getTime() - stime.getTime()) / 1000, 10);
    let re;
    if (sjc >= 60 * 60 * 24) {
      re = pubtime.slice(0, 10).split('-').join('/');
    } else if (sjc >= 60 * 60) {
      re = `${parseInt(sjc / (60 * 60), 10)}小时前`;
    } else if (sjc >= 60) {
      re = `${parseInt(sjc / 60, 10)}分钟前`;
    } else {
      re = '刚刚';
    }
    return re;
  };
  
  const getTimeforComp = time => {
    // 兼容秒级时间戳
    if (String(time).length === 10) {
      return Number(time) * 1000;
    }
    return time;
  };
  
  export const getTimeForFeed = (time, flag) => {
    // 兼容iOS格式
    const timeFormated =
      typeof time === 'string' ? new Date(time.replace(/-/g, '/')) : getTimeforComp(time);
    const stime = new Date(timeFormated);
    const isThirteen = String(stime.getTime()).length === 13;
    const htime =
      stime.getHours() > 9 ? stime.getHours() : `0${stime.getHours()}`;
    const mtime =
      stime.getMinutes() > 9 ? stime.getMinutes() : `0${stime.getMinutes()}`;
    const etime = new Date();
    // 调整日期判断方式
    const sjc = parseInt((etime.getTime() - stime.getTime() * (isThirteen ? 1 : 1000)) / 1000, 10);
    const timeDistance = Math.abs(sjc / (60 * 60 * 24));
    const distance = parseInt(timeDistance, 10);
    const currTimeInfo = {
      month: etime.getMonth(),
      date: etime.getDate(),
      day: etime.getDay(),
    };
    const recordTimeInfo = {
      month: stime.getMonth(),
      date: stime.getDate(),
      day: stime.getDay(),
    };
    // 计算两个时间是否处在同一个月
    const isEqualMonth = currTimeInfo.month === recordTimeInfo.month;
    // 按周索引计算日期差
    const dayDistance = Math.abs(currTimeInfo.day - recordTimeInfo.day);
    // 按天索引计算日期差
    const dateDistance = Math.abs(currTimeInfo.date - recordTimeInfo.date);
    // 计算兼容时间
    const compactDayDistance = dayDistance > timeDistance ? Math.ceil(timeDistance) : dayDistance;
    const verifyDay = [6, 1].indexOf(dayDistance) !== -1 ? 1 : compactDayDistance;
    const verifyDistance = isEqualMonth ? dateDistance : verifyDay;
    const compactDistance = distance >= 3 ? distance : verifyDistance;
    let re = '';
    if (compactDistance >= 3) {
      re = `${compactDistance}天前`;
    } else if (compactDistance === 2) {
      re = `前天 ${htime}:${mtime}`;
    } else if (compactDistance === 1) {
      re = `昨天 ${htime}:${mtime}`;
    } else if (sjc > 60 * 60) {
      re = `${parseInt(sjc / (60 * 60), 10)}小时前`;
    } else {
      re = `${parseInt(sjc / 60, 10)}分钟前`;
    }
    return re;
  };
  
  export const transNum = (num, zero) => {
    let re;
    switch (true) {
      case parseInt(num, 10) === 0:
        re = zero ? '0' : '';
        break;
      case num < 10000:
        re = num;
        break;
      case num < 100000000:
        re =
          num % 1000 <= 999
            ? `${parseInt(num / 10000, 10)}万`
            : `${parseFloat(num / 10000, 10).toFixed(1)}万`;
        break;
      default:
        re =
          num % 10000000 <= 9999999
            ? `${parseInt(num / 100000000, 10)}亿`
            : `${parseFloat(num / 100000000, 10).toFixed(1)}亿`;
        break;
    }
    return re;
  };
  
  export const transNumFixed = (num, fixed = 0) => {
    let re;
    switch (true) {
      case parseInt(num, 10) === 0:
        re = '0';
        break;
      case num < 10000:
        re = num;
        break;
      case num < 100000000:
        re = `${parseFloat(num / 10000, 10).toFixed(fixed)}万`;
        break;
      default:
        re = `${parseFloat(num / 100000000, 10).toFixed(fixed)}亿`;
        break;
    }
    return re;
  };
  
