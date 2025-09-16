import Taro, { useLoad, useDidShow } from '@tarojs/taro';
import { useAccountStore, useSubscriptionStore } from '@/stores';
import { setMessageCount } from '@/utils/message';

/**
 * 通用页面设置组合式函数
 * @param options 配置选项
 * @returns 页面设置相关方法
 */
export function usePageSetup(options: {
  // 是否需要登录才能访问该页面
  requireLogin?: boolean;
  // 是否在页面显示时更新消息数量
  updateMessageCount?: boolean;
  // 是否检查强制登出标志
  checkForceLogout?: boolean;
  // 是否在页面显示时获取服务器订阅信息
  getServerSubscribe?: boolean;
  // 自定义页面加载回调
  onLoad?: () => void | Promise<void>;
  // 自定义页面显示回调
  onShow?: () => void | Promise<void>;
} = {}) {
  const defaultOptions = {
    requireLogin: false,
    updateMessageCount: true,
    checkForceLogout: false,
    getServerSubscribe: false,
    onLoad: undefined,
    onShow: undefined
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  const account = useAccountStore();
  const subscribe = useSubscriptionStore();

  // 检查登录状态
  const checkLoginStatus = async () => {
    if (mergedOptions.requireLogin && !account.is_login) {
      account.gotoLogin();
      return false;
    }
    return true;
  };

  // 检查强制登出
  const checkForceLogout = async () => {
    if (!mergedOptions.checkForceLogout) return true;
    
    const isForceLogout = Taro.getStorageSync('forceLogoutFlag');
    if (isForceLogout !== false) {
      await account.logout();
      Taro.setStorageSync('forceLogoutFlag', false);
      return false;
    }
    return true;
  };

  // 更新消息数量
  const updateMessageCount = async () => {
    if (mergedOptions.updateMessageCount) {
      await setMessageCount();
    }
  };

  // 获取服务器订阅
  const getServerSubscribe = async () => {
    if (mergedOptions.getServerSubscribe) {
      await subscribe.getSeverSubscribe();
    }
  };

  // 设置页面
  const setupPage = () => {
    // 页面加载钩子
    useLoad(async () => {
      // 首先检查登录和强制登出
      if (!(await checkLoginStatus()) || !(await checkForceLogout())) {
        return;
      }
      
      // 更新消息数量
      await updateMessageCount();
      
      // 执行自定义加载回调
      if (mergedOptions.onLoad) {
        await mergedOptions.onLoad();
      }
    });

    // 页面显示钩子
    useDidShow(async () => {
      // 检查登录状态
      if (!(await checkLoginStatus())) {
        return;
      }
      
      // 更新消息数量
      await updateMessageCount();
      
      // 获取服务器订阅
      await getServerSubscribe();
      
      // 执行自定义显示回调
      if (mergedOptions.onShow) {
        await mergedOptions.onShow();
      }
    });
  };

  return {
    setupPage,
    checkLoginStatus,
    updateMessageCount,
    getServerSubscribe
  };
}