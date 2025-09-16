// 在创建/删除帖子页面中使用此方法来通知首页刷新列表
import { eventBus, EventNames } from '@/utils/eventBus';

/**
 * 通知首页刷新帖子列表
 * 替代原来的 config.indexNeedRefresh = true 方案
 */
export function notifyThreadListRefresh() {
  // 触发刷新事件，所有监听此事件的页面都会收到通知
  eventBus.emit(EventNames.THREAD_LIST_REFRESH);
}