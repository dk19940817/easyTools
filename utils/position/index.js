// 获取窗口滚动的宽度和高度
export const getScrollInfo = () => {
  const x = window.pageXOffset
    ? window.pageXOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  const y =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  return {
    x,
    y,
  };
};
