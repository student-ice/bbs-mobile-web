import { ref, watch, onMounted, onUnmounted } from 'vue';
import Taro from '@tarojs/taro';
import { IndexThread, ThreadIndexResponse } from '@/api';
import { eventBus, EventNames } from '@/utils/eventBus';

export function useThreadList() {
  const isLoading = ref(true);
  const pagination = ref({ page: 1, limit: 20 });
  const threadIndexRefresh = ref(0);
  const threadIndexResponse = ref<ThreadIndexResponse>({ ThreadIndex: [], total_count: 0 });

  // 加载帖子数据函数
  const loadThreadData = async () => {
    isLoading.value = true;
    try {
      const resp = await IndexThread({ 
        page: pagination.value.page, 
        pageSize: pagination.value.limit 
      });
      threadIndexResponse.value = resp.data || [];
      Taro.stopPullDownRefresh();
    } catch (error) {
      console.error('加载帖子数据失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // 监听刷新触发器和分页变化
  watch([threadIndexRefresh, () => pagination.value.page], () => {
    loadThreadData();
  }, { immediate: true });

  // 翻页后跳转到顶部
  watch(isLoading, (newVal, oldVal) => {
    // 只有当从加载中变为加载完成时才滚动到顶部
    if (oldVal === true && newVal === false) {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  });
  
  // 设置事件监听，当收到刷新事件时刷新列表
  onMounted(() => {
    eventBus.on(EventNames.THREAD_LIST_REFRESH, () => {
      refreshThreadList();
    });
  });
  
  // 组件卸载时取消事件监听
  onUnmounted(() => {
    eventBus.off(EventNames.THREAD_LIST_REFRESH);
  });

  // 刷新帖子列表
  const refreshThreadList = (resetPage = false) => {
    if (resetPage) {
      pagination.value.page = 1;
    }
    threadIndexRefresh.value++;
  };

  // 触发其他页面刷新列表
  const triggerRefresh = () => {
    eventBus.emit(EventNames.THREAD_LIST_REFRESH);
  };

  return {
    isLoading,
    pagination,
    threadIndexResponse,
    refreshThreadList,
    loadThreadData,
    triggerRefresh
  };
}