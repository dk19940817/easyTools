export const fetchJson = async url => {
    try {
      const res = await fetch(url);
      const body = await res.json();
      return body;
    } catch (e) {
      console.error(e);
    }
    return {};
  };
  
  export const fetchJsonWithSessionStorage = async url => {
    const cacheKey = `fetch_${url}`;
    if (usessionStorage.getItem(cacheKey) && enableCache) {
      return usessionStorage.getItem(cacheKey);
    }
    if (!promises[cacheKey]) {
      promises[cacheKey] = fetchJson(url);
    }
    const body = await promises[cacheKey];
    if (enableCache) {
      usessionStorage.setItem(cacheKey, body);
    }
    return body;
  };