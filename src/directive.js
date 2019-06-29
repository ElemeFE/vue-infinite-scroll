const ctx = "@@InfiniteScroll";

const throttle = function(fn, delay) {
  let now, lastExec, timer, context, args;

  const execute = function() {
    fn.apply(context, args);
    lastExec = now;
  };

  return function() {
    context = this;
    args = arguments;

    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      const diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(execute, diff);
      }
    } else {
      execute();
    }
  };
};

const getScrollTop = function(element) {
  if (element === window) {
    return Math.max(
      window.pageYOffset || 0,
      document.documentElement.scrollTop
    );
  }
  return element.scrollTop;
};

const getComputedStyle = document.defaultView.getComputedStyle;

// 获取滚动主体，1：element设置了高度，滚动主体为element 2：是element高度超过外层限定高度，滚动主体为外层或外层的外层
const getScrollEventTarget = function(element) {
  let currentNode = element;
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (
    currentNode &&
    currentNode.tagName !== "HTML" &&
    currentNode.tagName !== "BODY" &&
    currentNode.nodeType === 1
  ) {
    const overflowY = getComputedStyle(currentNode).overflowY;
    if (overflowY === "scroll" || overflowY === "auto") {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
};

const getVisibleHeight = function(element) {
  if (element === window) {
    return document.documentElement.clientHeight;
  }

  return element.clientHeight;
};

const getElementTop = function(element) {
  if (element === window) {
    return getScrollTop(window);
  }
  return element.getBoundingClientRect().top + getScrollTop(window);
};

const doBind = function() {
  if (this.binded) return;
  this.binded = true;

  const directive = this;
  const { throttleDelay, immediate, eventName } = this.config;
  const element = directive.el;

  directive.scrollEventTarget = getScrollEventTarget(element);
  directive.scrollListener = throttle(doCheck.bind(directive), throttleDelay);
  directive.scrollEventTarget.addEventListener(
    "scroll",
    directive.scrollListener
  );

  // beforeDestroy 注销绑定事件
  this.vm.$on("hook:beforeDestroy", () => {
    directive.scrollEventTarget.removeEventListener(
      "scroll",
      directive.scrollListener
    );
    // this.binded = false;
  });
  // deactivated 注销绑定事件
  this.vm.$on("hook:deactivated", () => {
    directive.scrollEventTarget.removeEventListener(
      "scroll",
      directive.scrollListener
    );
    this.binded = false;
  });

  if (immediate) {
    doCheck.call(directive);
  }

  if (eventName) {
    directive.vm.$on(eventName, function() {
      doCheck.call(directive);
    });
  }
};

const doCheck = function() {
  const scrollEventTarget = this.scrollEventTarget;
  const element = this.el;
  const { executeName } = this;
  const { distance, disabledKey, _disabled } = this.config;
  const disabled = this.vm[disabledKey];

  // 若execute是promise，则在执行过程中不继续触发
  if (disabled || _disabled) return;
  const viewportScrollTop = getScrollTop(scrollEventTarget);
  const viewportBottom =
    viewportScrollTop + getVisibleHeight(scrollEventTarget);

  let shouldTrigger = false;

  if (scrollEventTarget === element) {
    // 总高度 - 滚动高度 - 可视高度 <= distance
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
  } else {
    const elementBottom =
      getElementTop(element) -
      getElementTop(scrollEventTarget) +
      element.offsetHeight +
      viewportScrollTop;

    shouldTrigger = viewportBottom + distance >= elementBottom;
  }

  if (shouldTrigger && executeName) {
    if (window.Promise && this.vm[executeName] instanceof window.Promise) {
      this.config._disabled = true;
      this.vm[executeName]().finally(() => (this.config._disabled = false));
    }
    this.vm[executeName]();
  }
};

/**
 * binding.arg String 加载触发的函数名
 * @if binding.value Number 底部距离
 * @else-if binding.value Object 配置
 * binding.value.distance Number=200 底部距离
 * binding.value.disabledKey String 禁止加载的属性，通过vm访问
 * binding.value.throttleDelay Number=200 节流delay
 * binding.value.immediate Boolean=false 立即执行execute
 * binding.value.eventName String='' 另外绑定的event事件
 */
const defaultConfig = {
  distance: 0,
  throttleDelay: 200,
  _disabled: false
};

export default {
  inserted(el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      executeName: binding.arg,
      config: {
        ...defaultConfig,
        ...(typeof binding.value === "number"
          ? { distance: binding.value }
          : binding.value)
      }
    };
    // 防止指令加载时已触发mounted
    if (el[ctx].vm.$el) {
      doBind.call(el[ctx]);
    } else {
      el[ctx].vm.$on("hook:mounted", doBind.bind(el[ctx]));
    }
    el[ctx].vm.$on("hook:activated", doBind.bind(el[ctx]));
  },

  unbind(el) {
    if (el && el[ctx] && el[ctx].scrollEventTarget)
      el[ctx].scrollEventTarget.removeEventListener(
        "scroll",
        el[ctx].scrollListener
      );
  }
};
