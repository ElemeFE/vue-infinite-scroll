import {onMounted, onUnmounted} from 'vue'

export const useScrollEnd = (callback: Function) => {
  let container: HTMLElement;

  const getScrollContainer = () => {
    if (container == null) {
      const con = document.getElementById('app-scroll-container');
      if (con == null) {
        setTimeout(getScrollContainer, 100);
        throw new Error('#app-scroll-container not found');
      }
      container = con;
      container.addEventListener('scroll', onScrollEnd);
    }
    return container;
  };

  const onScrollEnd = () => {
    const scrollTop = container.scrollTop; // Позиция прокрутки
    const scrollHeight = container.scrollHeight; // Высота контента
    const containerHeight = container.clientHeight; // Высота видимой области контейнера
    // const listEnd = document.getElementById('listingListEnd');

    if (scrollTop + containerHeight >= scrollHeight - 1) {
      callback();
    }
  };

  onMounted(() => {
    getScrollContainer();
  });

  onUnmounted(() => {
    container.removeEventListener('scroll', onScrollEnd);
  });

  return onScrollEnd;
}
