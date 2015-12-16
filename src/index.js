var Vue = require('vue');

var throttle = function(fn, delay) {
  var now, lastExec, timer, context, args;

  var execute = function () {
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

    if (!lastExec) {
      execute();
    } else {
      var diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(function() {
          execute();
        }, diff);
      }
    }
  };
};

var getScrollTop = function(element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  }

  return element.scrollTop;
};

var getComputedStyle = document.defaultView.getComputedStyle;

var getScrollEventTarget = function (element) {
  var currentNode = element.parentNode;
  while (currentNode && currentNode.tagName !== 'HTML') {
    var overflowY = getComputedStyle(currentNode)['overflowY'];
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return null;
};

var getVisibleHeight = function(element) {
  if (element === window) {
    return document.documentElement.clientHeight;
  }

  return element.clientHeight;
};

Vue.directive('infiniteScroll', {
  bind: function() {
    var element = this.el;

    var disabledExpr = element.getAttribute('infinite-scroll-disabled');
    var disabled = false;
    if (disabledExpr) {
      this.vm.$watch(disabledExpr, function(value) {
        disabled = value;
      });
      disabled = !!this.vm.$get(disabledExpr);
    }

    var distanceExpr = element.getAttribute('infinite-scroll-distance');
    var distance = 0;
    if (distanceExpr) {
      distance = Number(this.vm.$get(distanceExpr));
      if (isNaN(distance)) {
        distance = 0;
      }
    }

    var directive = this;
    var executeExpr = directive.expression;

    var scrollEventTarget = this.scrollEventTarget = getScrollEventTarget(element) || window;

    this.scrollListener = throttle(function() {
      if (disabled) return;

      var viewportScrollTop = getScrollTop(scrollEventTarget);
      var elementRect = element.getBoundingClientRect();

      var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);
      var elementBottom = elementRect.bottom + viewportScrollTop;

      if (viewportBottom + distance > elementBottom) {
        if (executeExpr) {
          directive.vm.$get(executeExpr);
        }
      }
    }, 200);

    scrollEventTarget.addEventListener('scroll', this.scrollListener);
  },

  unbind() {
    this.scrollEventTarget.removeEventListener('scroll', this.scrollListener);
  }
});