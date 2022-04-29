import infiniteScroll from "../../vue-infinite-scroll";
import Vue from "vue/dist/vue";

Vue.use(infiniteScroll);

function getParents(el) {
  const els = [];
  while (el.parentNode && el.parentNode.tagName !== "HTML") {
    els.push(el.parentNode);
    el = el.parentNode;
  }

  return els;
}

Element.prototype.getBoundingClientRect = function () {
  return {
    top: 0,
    bottom: parseFloat(window.getComputedStyle(this).height),
    left: 0,
    right: parseFloat(window.getComputedStyle(this).width || "300"),
    width: parseFloat(window.getComputedStyle(this).width || "300"),
    height: parseFloat(window.getComputedStyle(this).height || "600"),
  };
};

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
    },
  },
  offsetTop: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginTop) || 0;
    },
  },
  clientHeight: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).height);
    },
  },
  offsetHeight: {
    get: function () {
      const smallestOverflowParent = getParents(this).reduce(
        (min, el) =>
          Math.min(
            el.tagName === "BODY"
              ? document.documentElement.clientHeight
              : parseFloat(window.getComputedStyle(el).height),
            min
          ),
        parseFloat(
          window.getComputedStyle(this).height ||
            document.documentElement.clientHeight
        )
      );
      return smallestOverflowParent || 0;
    },
  },
  offsetWidth: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).width) || 0;
    },
  },
  scrollHeight: {
    get: function () {
      return Math.max(
        parseFloat(window.getComputedStyle(this).height) || 0,
        parseFloat(window.getComputedStyle(this.children[0]).height) || 0
      );
    },
  },
});

Object.defineProperties(document.documentElement.__proto__, {
  clientHeight: {
    get: () => 800,
  },
  clientWidth: {
    get: () => 400,
  },
});

const scrollToBottom = (targetElement, distance = 0) => {
  if (targetElement === "parentNode") {
    const element = document.querySelector(".app");

    element.scrollTop =
      element.getBoundingClientRect().top +
      element.getBoundingClientRect().bottom -
      distance;
    [element, ...getParents(element), document, window].forEach((el) =>
      el.dispatchEvent(new Event("scroll"))
    );
  } else {
    const element = document.querySelector(".app");

    element.scrollTop = element.scrollHeight - element.offsetHeight - distance;
    [element, ...getParents(element), document, window].forEach((el) =>
      el.dispatchEvent(new Event("scroll"))
    );
  }
};

const scrollToTop = (targetElement) => {
  const el = document.querySelector(".app");
  el.scrollTop = 0;
  [el, ...getParents(el)].forEach((element) =>
    element.dispatchEvent(new Event("scroll"))
  );
};

const createRootEl = () => {
  const element = document.createElement("div");

  document.body.appendChild(element);
  return element;
};

const createVM = ({
  targetElement = "window",
  distance = 0,
  immediate = true,
  mock = jest.fn(),
}) => {
  let template;
  switch (targetElement) {
    case "window":
      template = `<div class="app"
                    style="height: 1200px; width: 400px; background-color: #000"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="${distance}"
                    infinite-scroll-immediate-check="${immediate}"
                    infinite-scroll-listen-for-event="docheck">
                  </div>`;
      break;
    case "parentNode":
      template = `<div class="app"
                  style="height: 600px; width: 400px; overflow: auto; background-color: #eee;">
                  <div style="height: 1200px; width: 400px;"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="${distance}"
                    infinite-scroll-immediate-check="${immediate}"
                    infinite-scroll-listen-for-event="docheck">
                  </div>
                </div>`;
      break;
    case "currentNode":
    default:
      template = `<div class="app"
                  style="height: 600px; width: 400px; background-color: #ccc; overflow: auto;"
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="busy"
                  infinite-scroll-distance="${distance}"
                  infinite-scroll-immediate-check="${immediate}"
                  infinite-scroll-listen-for-event="docheck">
                  <div style="height: 1000px">1</div>
                </div>`;
      break;
  }

  return new Vue({
    el: createRootEl(),
    data() {
      return {
        busy: false,
      };
    },
    template,
    methods: {
      loadMore() {
        this.busy = true;
        mock();
      },
    },
    events: {
      ["docheck"]() {},
    },
  });
};

describe("init infinite-scroll directive", () => {
  it("directive installed", (done) => {
    expect(infiniteScroll.installed).toBe(true);
    done();
  });
});

const scrollTargetElements = ["parentNode", "currentNode"];
const waitForThrottle = (duration = 250) => {
  return new Promise((y) => setTimeout(() => y(), duration));
};

scrollTargetElements.forEach((targetElement) => {
  describe(`${targetElement} scroll test`, () => {
    let vm;
    let mock;

    beforeEach(() => {
      mock = jest.fn();
      vm = createVM({
        targetElement,
        mock,
      });
    });

    afterEach(() => {
      vm.$destroy(true);
    });

    it("the function should be called once", (done) => {
      scrollToBottom(targetElement);
      setTimeout(() => expect(mock.mock.calls.length).toEqual(1), 250);
      setTimeout(done, 250);
    });

    it('test "infinite-scroll-listen-for-event"', async () => {
      mock = jest.fn();
      vm = createVM({
        targetElement,
        mock,
      });
      await waitForThrottle(0);
      expect(mock.mock.calls.length).toEqual(0);
      vm.$emit("docheck");
      expect(mock.mock.calls.length).toEqual(1);
    });
  });

  describe(`${targetElement} scroll distance test`, () => {
    let vm;
    let mock;

    beforeEach(async () => {
      mock = jest.fn();
      vm = createVM({
        targetElement,
        distance: 50,
        mock,
      });
      await waitForThrottle(15);
    });

    it("the function should be called when scroll to bottom", async () => {
      scrollToBottom(targetElement, 0);
      scrollToTop(targetElement);
      scrollToBottom(targetElement, 0);

      await waitForThrottle();
      expect(mock).toHaveBeenCalled();
    });

    it("the function should be called when scroll to the bottom of 50px distance", async () => {
      scrollToBottom(targetElement, 50);
      await waitForThrottle();
      expect(mock).toHaveBeenCalled();
    });

    it.skip("the function should not be called", async () => {
      expect(mock).not.toHaveBeenCalled();
      scrollToBottom(targetElement, 51);
      expect(mock).not.toHaveBeenCalled();
    });

    afterEach(() => {
      vm.$destroy(true);
    });
  });
});
