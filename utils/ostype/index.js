export const getOsInfo = () => {
    const ua = navigator.userAgent;
  
    // Android
    const androidMatch = ua.match(/(Android);?[\s/]+([\d.]+)?/);
    if (androidMatch) {
      return {
        os: OS_TYPE.ANDROID,
        version: androidMatch[2],
      };
    }
  
    // iOS
    const iphoneMatch = ua.match(/(iPhone\sOS)\s([\d_]+)/);
    const ipadMatch = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipodMatch = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iosMatch = iphoneMatch || ipadMatch || ipodMatch;
    if (iosMatch) {
      return {
        os: OS_TYPE.IOS,
        version: iosMatch[2],
      };
    }
  
    // Unknown
    return {
      os: OS_TYPE.UNKNOWN,
      version: null,
    };
  };
  
  export const OS_TYPE = {
    IOS: 'ios',
    ANDROID: 'android',
    UNKNOWN: 'unknown',
  };
  