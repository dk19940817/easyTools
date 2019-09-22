import { PureComponent } from 'react';

// 用于移动端弹窗滚动效果（解决滚动穿透）
// IOS配合'-webkit-overflow-scrolling: touch'效果更佳~
export default class LockScroll extends PureComponent {
  static defaultProps = {
    scrollName: 'can-scroll',
    noScrollName: 'window',
    overHidden: false,
  };

  componentDidMount() {
    const { scrollName, noScrollName, overHidden } = this.props;
    if (overHidden) {
      // 解决scroll禁止不彻底，暂时用overflow:hidden解决
      document.querySelector('body').style.overflow = 'hidden';
      document.querySelector('body').style.height = '100%';
      document.querySelector('html').style.height = '100%';
      document.querySelector('html').style.overflow = 'hidden';
    }
    let passiveIfSupported = false;
    try {
      window.addEventListener('test', null,
        Object.defineProperty({}, 'passive', {
          get: function() {
            passiveIfSupported = { passive: false };
          }
        }));
    } catch (err) {
      console.error(err);
    }
    let noScrollElement = false;
    if (noScrollName === 'window') {
      noScrollElement = document || window;
    } else {
      noScrollElement = document.querySelector(`.${noScrollName}`);
    }
    const scrollElement = document.querySelector(`.${scrollName}`);
    if (noScrollElement) {
      noScrollElement.addEventListener('touchmove', e => {
        e.preventDefault();
      }, passiveIfSupported);
    }
    let startY;
    if (scrollElement) {
      scrollElement.addEventListener('touchstart', e => {
        startY = e.touches[0].pageY;
      }, passiveIfSupported);
      // 处理移动过程中换方向无响应
      let topY = false;
      let bottomY = false;
      scrollElement.addEventListener('touchmove', e => {
        const moveEndY = e.changedTouches[0].pageY;
        const Y = moveEndY - startY;
        const scrollTop = scrollElement.scrollTop;
        if (Y > 0 && scrollTop <= 0) {
          // 到顶
          if (topY && Y <= topY) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
          topY = Y;
        } else if (Y < 0 &&
          (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight)) {
          // 到底
          if (bottomY && Y >= bottomY) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
          bottomY = Y;
        } else {
          e.stopPropagation();
        }
      }, passiveIfSupported);
      scrollElement.addEventListener('touchend', () => {
        bottomY = false;
        topY = false;
      }, passiveIfSupported);
    }
  }
  componentWillUnmount() {
    const { scrollName, noScrollName, overHidden } = this.props;
    if (overHidden) {
      document.querySelector('body').style.overflow = 'auto';
      document.querySelector('body').style.height = 'auto';
      document.querySelector('html').style.overflow = 'auto';
      document.querySelector('html').style.height = 'auto';
    }
    let passiveIfSupported = false;
    try {
      window.removeEventListener('test', null,
        Object.defineProperty({}, 'passive', {
          get: function() {
            passiveIfSupported = { passive: false };
          }
        }));
    } catch (err) {
      console.error(err);
    }
    let noScrollElement = false;
    if (noScrollName === 'window') {
      noScrollElement = window || document;
    } else {
      noScrollElement = document.querySelector(`.${noScrollName}`);
    }
    const scrollElement = document.querySelector(`.${scrollName}`);
    if (noScrollElement) {
      noScrollElement.removeEventListener('touchmove', e => {
        e.preventDefault();
      }, passiveIfSupported);
    }
    let startY;
    if (scrollElement) {
      scrollElement.removeEventListener('touchstart', e => {
        startY = e.touches[0].pageY;
      }, passiveIfSupported);
      // 处理移动过程中换方向无响应
      let topY = false;
      let bottomY = false;
      scrollElement.removeEventListener('touchmove', e => {
        const moveEndY = e.changedTouches[0].pageY;
        const Y = moveEndY - startY;
        const scrollTop = scrollElement.scrollTop;
        if (Y > 0 && scrollTop <= 0) {
          // 到顶
          if (topY && Y <= topY) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
          topY = Y;
        } else if (Y < 0 &&
          (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight)) {
          // 到底
          if (bottomY && Y >= bottomY) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
          bottomY = Y;
        } else {
          e.stopPropagation();
        }
      });
      scrollElement.removeEventListener('touchend', () => {
        bottomY = false;
        topY = false;
      }, passiveIfSupported);
    }
  }
}
