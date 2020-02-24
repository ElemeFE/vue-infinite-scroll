import InfiniteScroll from './directive';

const install = function(Vue) {
  Vue.directive('InfiniteScroll', InfiniteScroll);
};

if (window.Vue) {
  window.infiniteScroll = InfiniteScroll;
  Vue.use(install);
}

InfiniteScroll.install = install;
export default InfiniteScroll;
