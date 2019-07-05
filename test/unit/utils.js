import infiniteScroll from '../../src/index';
import Vue from 'vue/dist/vue.esm';

export const THROTTLE_DELAY = 200;

export const scrollToBottom = (
  targetElement,
  distance = 0,
  selector = '.app'
) => {
  if (targetElement === 'parentNode') {
    const element = document.querySelector(selector);

    element.scrollTop =
      element.getBoundingClientRect().top +
      element.getBoundingClientRect().bottom -
      distance;
  } else {
    const element = document.querySelector(selector);

    element.scrollTop = element.scrollHeight - element.offsetHeight - distance;
  }
};

export const scrollToTop = (selector = '.app') => {
  const element = document.querySelector(selector);
  element.scrollTop = 0;
};

export const getTemplate = (
  targetElement = 'window',
  distance = 0,
  throttleDelay = THROTTLE_DELAY,
  immediate = false
) => {
  let template;
  switch (targetElement) {
    case 'window':
      template = `<div class="app"
                    style="height: 1200px; width: 400px; background-color: #000"
                    v-infinite-scroll:loadMore="{
                       disabledKey: 'busy',
                       eventName: 'docheck',
                       distance: ${distance},
                       immediate: ${immediate},
                       throttleDelay: ${throttleDelay}
                     }">
                  </div>`;
      break;
    case 'parentNode':
      template = `<div class="app"
                  style="height: 600px; width: 400px; overflow: auto; background-color: #eee;">
                  <div style="height: 1200px; width: 400px;"
                     v-infinite-scroll:loadMore="{
                       disabledKey: 'busy',
                       eventName: 'docheck',
                       distance: ${distance},
                       immediate: ${immediate},
                       throttleDelay: ${throttleDelay}
                     }">
                      ddddd
                  </div>
                </div>`;
      break;
    case 'currentNode':
    default:
      template = `<div class="app"
                  style="height: 600px; width: 400px; background-color: #ccc; overflow: auto;"
                  v-infinite-scroll:loadMore="{
                       disabledKey: 'busy',
                       eventName: 'docheck',
                       distance: ${distance},
                       immediate: ${immediate},
                       throttleDelay: ${throttleDelay}
                     }">
                  <div style="height: 1000px">1</div>
                </div>`;
      break;
  }
  return template;
};

export const createVM = (...params) => {
  Vue.use(infiniteScroll);

  const element = document.createElement('div');
  element.setAttribute('id', 'app');
  document.querySelector('body').appendChild(element);

  const instance = new Vue({
    el: '#app',
    template: getTemplate(...params),
    data() {
      return {
        busy: false,
        callCount: 0
      };
    },
    methods: {
      loadMore() {
        this.busy = true;
        this.callCount++;
        console.log('loaded!');
      }
    }
  });

  return instance;
};

/**
 * test disabledKey is computed
 * @param params
 * @returns {{busy: boolean, callCount: number}|Vue}
 */
export const createVMComputed = (...params) => {
  Vue.use(infiniteScroll);

  const element = document.createElement('div');
  element.setAttribute('id', 'app');
  document.querySelector('body').appendChild(element);

  const instance = new Vue({
    el: '#app',
    template: getTemplate(...params),
    data() {
      return {
        callCount: 0,
        selfBusy: false
      };
    },
    computed: {
      busy() {
        return this.selfBusy;
      }
    },
    methods: {
      loadMore() {
        this.selfBusy = true;
        this.callCount++;
        console.log('loaded!');
      }
    }
  });

  return instance;
};
