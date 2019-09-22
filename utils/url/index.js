import qs, { stringify, parse } from 'qs';

export const getUrlParams = url => parse(url || window.location.search.slice(1));

export const parseLink = url => {
  if (!url) {
    return {};
  }
  const aTag = document.createElement('a');
  aTag.href = url;
  return {
    host: aTag.host,
    hash: aTag.hash,
    path: aTag.pathname,
    search: aTag.search.slice(1),
    protocol: aTag.protocol.slice(0, -1),
  };
};

export const addUrlParams = (oldUrl, params) => {
  const [path, ...searchs] = oldUrl.split('?');
  const search = searchs.join('?');
  const oldParams = qs.parse(search);
  const newParams = {
    ...oldParams,
    ...params,
  };
  return `${path}?${qs.stringify(newParams)}`;
};

export const delUrlParams = (name = [], link = window.location.href) => {
  let url = link;
  try {
    const href = parseLink(link);
    const bSearchs = qs.parse(href.search);
    const aSearchs = {};
    Object.keys(bSearchs).forEach((item, index) => {
      if ([...name].indexOf(item) < 0) {
        aSearchs[item] = bSearchs[item];
        url = `${href.protocol}://${href.host}${href.path}?${qs.stringify(aSearchs)}${href.hash}`;
      }
    });
    return url;
  } catch (e) {
    console.error(e);
    return url;
  }
};

export const getJumpAnchor = () => {
  const { anchor } = qs.parse(location.search.replace(/^\?/, ''));
  if (anchor) {
    const anchorElement = document.getElementById(anchor);
    setTimeout(() => {
      const { top } = (anchorElement && anchorElement.getBoundingClientRect()) || {};
      if (anchorElement) {
        window.scrollTo(0, top || anchorElement.offsetTop);
      }
    }, 500);
  }
};
