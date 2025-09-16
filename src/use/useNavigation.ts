import Taro, { useShareTimeline } from '@tarojs/taro';
import { useConfigStore } from '@/stores';
import { ThreadIndexResponse } from '@/api';

export function useNavigation() {
  const config = useConfigStore();

  // 跳转到帖子详情
  const goThread = (item: ThreadIndexResponse["ThreadIndex"][0]) => {
    // 预览数量增加
    item.views_cnt++;
    Taro.navigateTo({
      url: `/pages/thread/thread?id=${item.id}`,
    });
  };

  // 跳转到链接
  const goLike = (page: string) => {
    // 小程序无法跳转到网页
    if (page.startsWith("https://")) {
      return;
    }
    Taro.navigateTo({
      url: page,
    });
  };

  // 设置分享内容
  const setupShare = () => {
    useShareTimeline(() => {
      return {
        title: "论坛首页-深度科技",
        imageUrl: config.weixinShare.state?.default_img
      };
    });
  };

  return {
    goThread,
    goLike,
    setupShare
  };
}