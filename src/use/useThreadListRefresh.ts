import { onMounted, onUnmounted } from 'vue';
import { eventBus, EventNames } from '@/utils/eventBus';

/**
 * 使用线程列表刷新事件的组合式函数
 * @param refreshCallback 刷新回调函数
 */
export function useThreadListRefresh(refreshCallback: () => void) {
  // 监听刷新事件
  const handleRefresh = () => {
    refreshCallback();
  };

  // 组件挂载时订阅事件
  onMounted(() => {
    eventBus.on(EventNames.THREAD_LIST_REFRESH, handleRefresh);
  });

  // 组件卸载时取消订阅
  onUnmounted(() => {
    eventBus.off(EventNames.THREAD_LIST_REFRESH, handleRefresh);
  });

  // 触发刷新的方法
  const triggerRefresh = () => {
    eventBus.emit(EventNames.THREAD_LIST_REFRESH);
  };

  return {
    triggerRefresh
  };
}