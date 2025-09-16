// 简单的事件总线实现
class EventBus {
  private events: Map<string, Array<Function>>;

  constructor() {
    this.events = new Map();
  }

  // 订阅事件
  on(eventName: string, callback: Function) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)?.push(callback);
  }

  // 取消订阅
  off(eventName: string, callback?: Function) {
    if (!callback) {
      this.events.delete(eventName);
      return;
    }

    const callbacks = this.events.get(eventName);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.events.delete(eventName);
      }
    }
  }

  // 触发事件
  emit(eventName: string, ...args: any[]) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  // 只订阅一次
  once(eventName: string, callback: Function) {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }
}

// 创建全局事件总线实例
export const eventBus = new EventBus();

// 定义常用事件名称
export const EventNames = {
  THREAD_LIST_REFRESH: 'thread-list-refresh',
  MESSAGE_COUNT_UPDATED: 'message-count-updated',
  USER_LOGGED_IN: 'user-logged-in',
  USER_LOGGED_OUT: 'user-logged-out'
};