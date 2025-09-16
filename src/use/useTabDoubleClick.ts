import { ref } from 'vue';

export function useTabDoubleClick(onSingleClick?: () => void, onDoubleClick?: () => void) {
  const tabClick = ref(false);
  let lastClickTime = 0;
  
  // 点击tab的处理函数
  const handleTabClick = () => {
    const currentTime = Date.now();

    // 判断是否为双击（两次点击间隔小于 200ms）
    if (currentTime - lastClickTime < 200) {
      // 双击逻辑
      onDoubleClick?.();
      tabClick.value = false; // 重置标记
      lastClickTime = 0; // 重置上一次点击时间
      return; // 双击逻辑执行后直接返回
    }

    // 单击逻辑
    tabClick.value = true;
    lastClickTime = currentTime; // 更新上一次点击时间

    setTimeout(() => {
      if (tabClick.value) {
        // 200ms 内没有第二次点击，当作单击
        onSingleClick?.();
        tabClick.value = false;
      }
    }, 200);
  };

  return {
    handleTabClick
  };
}