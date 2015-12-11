# Overview
vue-infinite-scroll is A infinite scroll directive for vue.js.

# Install

```Bash
npm install vue-infinite-scroll --save
```

# Usage

Use v-infinite-scroll to enable infinite scroll, Use infinite-scroll-* attributes to define infinite-scroll options.

The value of v-infinite-scroll will be executed when the bottom of element reach the bottom of viewport.

```HTML
<div v-infinite-scroll="loadMore()" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
  ...
</div>
```

```JavaScript
var count = 0;

new Vue({
  el: '#app',
  data: {
    data: [],
    busy: false
  },
  methods: {
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        for (var i = 0, j = 10; i < j; i++) {
          this.data.push({ name: count++ });
        }
        this.busy = false;
      }, 1000);
    }
  }
});
```

# Options

| Option | Description |
| ----- | ----- |
| infinite-scroll-disabled | infinite scroll will be disabled when the expression's value of this attribute is true. |
| infinite-scroll-distance | Number(default=0) - the minimum distance of executing of v-infinite-scroll expression between the bottom of element and the bottom of viewport. |

# License
MIT