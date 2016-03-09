/* global Vue */
import infiniteScroll from './directive';

if (window.Vue) {
  window.infiniteScroll = infiniteScroll;
  Vue.use(install);
}

function install(Vue) {
  Vue.directive('infiniteScroll', infiniteScroll);
}

export {install, infiniteScroll};
