import infiniteScroll from './../../vue-infinite-scroll';
import Vue from 'vue';

const scrollToBottom = (targetElement, distance = 0) => {
  if (targetElement === 'parentNode') {
    const element = document.querySelector('.app');

    element.scrollTop = element.getBoundingClientRect().top + element.getBoundingClientRect().bottom - distance;
  } else {
    const element = document.querySelector('.app');

    element.scrollTop = element.scrollHeight - element.offsetHeight - distance;
  }
};
const scrollToTop = (targetElement) => {
  document.querySelector('.app').scrollTop = 0;
};
const createVM = (targetElement = 'window', distance = 0, immediate = true) => {
  let template;
  switch(targetElement) {
    case 'window':
      template = `<div class="app"
                    style="height: 1200px; width: 400px; background-color: #000"
                    v-infinite-scroll="loadMore()"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="${distance}"
                    infinite-scroll-immediate-check="${immediate}"
                    infinite-scroll-listen-for-event="docheck">
                  </div>`;
      break;
    case 'parentNode':
    template = `<div class="app"
                  style="height: 600px; width: 400px; overflow: auto; background-color: #eee;">
                  <div style="height: 1200px; width: 400px;"
                    v-infinite-scroll="loadMore()"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="${distance}"
                    infinite-scroll-immediate-check="${immediate}"
                    infinite-scroll-listen-for-event="docheck">
                  </div>
                </div>`;
      break;
    case 'currentNode':
    default:
    template = `<div class="app"
                  style="height: 600px; width: 400px; background-color: #ccc; overflow: auto;"
                  v-infinite-scroll="loadMore()"
                  infinite-scroll-disabled="busy"
                  infinite-scroll-distance="${distance}"
                  infinite-scroll-immediate-check="${immediate}"
                  infinite-scroll-listen-for-event="docheck">
                  <div style="height: 1000px">1</div>
                </div>`;
      break;
  }

  return new Vue({
    el() {
      const element = document.createElement('div');

      document.querySelector('body').appendChild(element);
      return element;
    },
    data() {
      return {
        busy: false
      };
    },
    template,
    methods: {
      loadMore() {
        this.busy = true;
        console.log('loaded!');
      }
    },
    events: {
      ['docheck']() {
        console.log('tick');
      }
    }
  })
}

describe('init infinite-scroll directive', () => {
  beforeAll(done => {
    Vue.use(infiniteScroll);
    done();
  });

  it('directive installed', done => {
    expect(infiniteScroll.installed).toBe(true);
    done();
  });
});

const scrollTargetElements = ['parentNode', 'currentNode'];

scrollTargetElements.forEach(targetElement => {
  describe(`${targetElement} scroll test`, () => {
    let vm;

    beforeEach(done =>{
      vm = createVM(targetElement);

      vm.$nextTick(() => {
        spyOn(vm, 'loadMore');

        scrollToBottom(targetElement);
        scrollToTop(targetElement);
        scrollToBottom(targetElement);

        setTimeout(done);
      });
    });

    it('the function should be called once', done => {
      expect(vm.loadMore.calls.count()).toEqual(1);
      done();
    });

    it('test "infinite-scroll-listen-for-event"', done => {
      vm.$emit('docheck');
      expect(vm.loadMore.calls.count()).toEqual(2);
      done();
    });

    afterEach(done => {
      vm.$destroy(true);
      done();
    });
  });

  describe(`${targetElement} scroll distance test`, () => {
    let vm;

    beforeEach(done => {
      vm = createVM(targetElement, 50);

      vm.$nextTick(() => {
        spyOn(vm, 'loadMore');
        setTimeout(done);
      });
    });

    it('the function should be called when scroll to bottom', done => {
      scrollToBottom(targetElement, 0);

      setTimeout(() => {
        expect(vm.loadMore).toHaveBeenCalled();
        done();
      });
    });

    it('the function should be called when scroll to the bottom of 50px distance', done => {
      scrollToBottom(targetElement, 50);
      setTimeout(() => {
        expect(vm.loadMore).toHaveBeenCalled();
        done();
      });
    });

    it('the function should not be called', done => {
      scrollToBottom(targetElement, 51);
      setTimeout(() => {
        expect(vm.loadMore).not.toHaveBeenCalled();
        done();
      });
    });

    afterEach(done => {
      vm.$destroy(true);
      done();
    });
  });
});
