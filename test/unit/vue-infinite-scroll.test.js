import { scrollToBottom, scrollToTop, getTemplate, createVM, createVMComputed, THROTTLE_DELAY } from './utils'

const scrollTargetElements = ["parentNode", "currentNode"];

scrollTargetElements.forEach(targetElement => {
  // describe(`${targetElement} scroll test`, () => {
  //   let vm;
  //
  //   beforeEach(done => {
  //     vm = createVM(targetElement);
  //
  //     vm.$nextTick(() => {
  //       spyOn(vm, "loadMore");
  //
  //       scrollToBottom(targetElement);
  //       setTimeout(done);
  //     });
  //   });
  //
  //   it("the function should be called once", () => {
  //     expect(vm.loadMore).toHaveBeenCalledTimes(1);
  //   });
  //
  //   it('test "infinite-scroll-listen-for-event"', () => {
  //     vm.$emit("docheck");
  //     expect(vm.loadMore).toHaveBeenCalledTimes(2);
  //   });
  //
  //   afterEach(() => {
  //     // 清除当前el
  //     document.body.removeChild(vm.$el);
  //     vm.$destroy();
  //   });
  // });

  // describe(`${targetElement} scroll distance test`, () => {
  //   let vm;
  //
  //   beforeEach(done => {
  //     vm = createVM(targetElement, 50);
  //
  //     vm.$nextTick(() => {
  //       spyOn(vm, "loadMore");
  //       setTimeout(done);
  //     });
  //   });
  //
  //   it("the function should be called when scroll to bottom", done => {
  //     scrollToBottom(targetElement, 0);
  //
  //     setTimeout(() => {
  //       expect(vm.loadMore).toHaveBeenCalled();
  //       done();
  //     });
  //   });
  //
  //   it("the function should be called when scroll to the bottom of 50px distance", done => {
  //     scrollToBottom(targetElement, 50);
  //     setTimeout(() => {
  //       expect(vm.loadMore).toHaveBeenCalled();
  //       done();
  //     });
  //   });
  //
  //   it("the function should not be called", done => {
  //     scrollToBottom(targetElement, 51);
  //     setTimeout(() => {
  //       expect(vm.loadMore).not.toHaveBeenCalled();
  //       done();
  //     });
  //   });
  //
  //   afterEach(() => {
  //     // 清除当前el
  //     document.body.removeChild(vm.$el);
  //     vm.$destroy();
  //   });
  // });

  // describe(`${targetElement} scroll disabledKey test`, () => {
  //   let vm;
  //
  //   beforeEach((done) => {
  //     vm = createVM(targetElement, 0);
  //     vm.$nextTick(done)
  //   });
  //
  //   it("the function should not be called when vm.busy is true", (done) => {
  //     vm.busy = true
  //     spyOn(vm, "loadMore");
  //     scrollToBottom(targetElement, 0);
  //     setTimeout(() => {
  //       expect(vm.loadMore).not.toHaveBeenCalled();
  //       done()
  //     })
  //   })
  //
  //   it("the function should be called 1 times when vm.busy is true after once", (done) => {
  //     // vm.busy = true
  //     scrollToBottom(targetElement, 0);
  //     setTimeout(() => {
  //       scrollToTop()
  //       setTimeout(() => {
  //         scrollToBottom(targetElement, 0);
  //         setTimeout(() => {
  //           expect(vm.callCount).toBe(1);
  //           done()
  //         })
  //       }, THROTTLE_DELAY + 1)
  //     })
  //   })
  //
  //   afterEach(() => {
  //     // 清除当前el
  //     document.body.removeChild(vm.$el);
  //     vm.$destroy();
  //   });
  // })

  // describe.skip(`${targetElement} scroll computed disabledKey test`, () => {
  //   let vm;
  //
  //   beforeEach((done) => {
  //     vm = createVM(targetElement, 0);
  //     vm.$nextTick(done)
  //   });
  //
  //   it("the function should not be called when computed vm.busy is true", (done) => {
  //     vm._busy = true
  //     spyOn(vm, "loadMore");
  //     scrollToBottom(targetElement, 0);
  //     setTimeout(() => {
  //       expect(vm.loadMore).not.toHaveBeenCalled();
  //       done()
  //     })
  //   })
  //
  //   afterEach(() => {
  //     // 清除当前el
  //     document.body.removeChild(vm.$el);
  //     vm.$destroy();
  //   });
  // })
});

/**
 * scroll keep-alive test
 */
// describe('scroll keep-alive test', () => {
//   const component1 = {
//     template: getTemplate('parentNode'),
//     data() {
//       return {
//         busy: false,
//         callCount: 0
//       };
//     },
//     methods: {
//       loadMore() {
//         this.callCount++;
//         console.log("loaded!");
//       }
//     }
//   }
//
//   const component2 = {
//     template: `<div class="app2" style="height: 600px; width: 400px; background-color: #000">
//   <div style="height: 1000px;;"></div>
// </div>`,
//   }
//
//   const createKeepAliveVM = () => {
//     Vue.use(infiniteScroll);
//
//     const element = document.createElement("div");
//     element.setAttribute("id", "app");
//     document.querySelector("body").appendChild(element);
//
//     const instance = new Vue({
//       el: "#app",
//       template: `<div>
//                   <keep-alive>
//                     <component :is="currentComponent"></component>
//                   </keep-alive>
//                 </div>`,
//       components: {
//         component1,
//         component2
//       },
//       data() {
//         return {
//           currentComponent: 'component1'
//         };
//       }
//     });
//
//     return instance;
//   };
//
//   let vm;
//
//   beforeEach((done) => {
//     vm = createKeepAliveVM();
//     vm.$nextTick(done)
//   });
//
//   it('change to component2 will not execute component1 function while scroll', (done) => {
//     scrollToBottom('parentNode', 0);
//     setTimeout(() => {
//       expect(vm.$children[0].$data.callCount).toBe(1);
//       // reset component1 scroll
//       scrollToTop('.app')
//       setTimeout(() => {
//         vm.currentComponent = 'component2'
//         vm.$nextTick(() => {
//           scrollToBottom('currentNode', 0, '.app2');
//           setTimeout(() => {
//             expect(vm.$children[0].$data.callCount).toBe(1);
//             done();
//           })
//         })
//       })
//     })
//   });
//
//   afterEach(() => {
//     // 清除当前el
//     document.body.removeChild(vm.$el);
//     vm.$destroy();
//   });
// })
/**
 * scroll v-if test
 */
// describe('scroll v-if test', () => {
//   const component1 = {
//     template: getTemplate('parentNode'),
//     data() {
//       return {
//         busy: false,
//         callCount: 0
//       };
//     },
//     methods: {
//       loadMore() {
//         this.callCount++;
//         console.log("loaded!");
//       }
//     }
//   }
//
//   const createKeepAliveVM = () => {
//     Vue.use(infiniteScroll);
//
//     const element = document.createElement("div");
//     element.setAttribute("id", "app");
//     document.querySelector("body").appendChild(element);
//
//     const instance = new Vue({
//       el: "#app",
//       template: `<div>
//                   <component1 v-if="currentComponent === 'component1'" ref="component1"></component1>
//                 </div>`,
//       components: {
//         component1,
//       },
//       data() {
//         return {
//           currentComponent: ''
//         };
//       }
//     });
//
//     return instance;
//   };
//
//   let vm;
//
//   beforeEach((done) => {
//     vm = createKeepAliveVM();
//     vm.$nextTick(done)
//   });
//
//   it('the function should be called when v-if="true"', (done) => {
//     vm.currentComponent = 'component1';
//     vm.$nextTick(() => {
//       scrollToBottom('parentNode', 0);
//       setTimeout(() => {
//         console.log('vm.$refs===>>>>', vm.$refs.component1.$data);
//         expect(vm.$refs.component1.$data.callCount).toBe(1);
//         done()
//       })
//     })
//   });
//
//   afterEach(() => {
//     // 清除当前el
//     document.body.removeChild(vm.$el);
//     vm.$destroy();
//   });
// })
