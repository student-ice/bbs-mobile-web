<template>
  <nut-config-provider :theme='theme'>
    <NavComponent show-search></NavComponent>
    <view class="index-page">
      <!-- 轮播图 -->
      <view class="carousel" v-if="!carouselState.isLoading">
        <nut-swiper :init-page="0" :pagination-visible="true" pagination-color="#426543" auto-play="3000">
          <nut-swiper-item v-for="item in carouselState.state?.cards" @click="goLike(item.link)">
            <img :src="apiServer + item.img.url" :alt="item.title" />
          </nut-swiper-item>
        </nut-swiper>
      </view>
      <!-- 轮播图的骨架图 -->
      <nut-skeleton v-else width="100vw" height="200px" :title="false" animated row="1">
      </nut-skeleton>
      <!-- 帖子列表 -->
      <view class="thread-list" v-if="!isLoading">
        <template v-for="item in threadIndexResponse.ThreadIndex">
          <template v-if="item.user.id">
            <nut-cell-group>
              <!-- 帖子标题 -->
              <nut-cell class="thread-title" desc-text-align="left" is-link @click="goThread(item)">
                <template #title>
                  <view>
                    【{{ item.type.name }}】{{ item.subject }}
                    <nut-tag class="resolved" color="green" plain
                      v-if="item.attrs.some(attr => attr.name === 'Resolved')">已解决</nut-tag>
                  </view>
                </template>
                <template #icon>
                  <img v-if="item.top" style="width:20px;height: 20px;" :src="TopIcon" />
                </template>
              </nut-cell>
              <!-- 帖子信息 -->
              <nut-cell class="info" desc-text-align="left">
                <template #icon>
                  <nut-avatar size="16" shape="round">
                    <img :src="item.user.avatar" />
                  </nut-avatar>
                </template>
                <template #desc>
                  <view class="info-desc">
                    <view class="nickname"> {{ item.user.nickname }}</view>
                    <view class="stat">
                      <view>
                        <Eye size="10"></Eye> {{ item.views_cnt }}
                      </view>
                      <view>
                        <Comment size="10"></Comment> {{ item.posts_cnt }}
                      </view>
                    </view>
                  </view>
                </template>
              </nut-cell>
            </nut-cell-group>
          </template>
        </template>

        <view class="pagination" v-if="threadIndexResponse">
          <nut-pagination v-model="pagination.page" mode="multi" :total-items="threadIndexResponse.total_count"
            :items-per-page="pagination.limit" />
        </view>
      </view>
      <!-- 帖子列表的骨架图 -->
      <view v-else>
        <view class="skeleton-container" v-for=" in [1, 2, 3, 4, 5, 6, 7]">
          <nut-skeleton width="90vw" height="20px" title animated avatarSize="40px" row="2">
          </nut-skeleton>
        </view>
      </view>
    </view>
  </nut-config-provider>
</template>

<script lang="ts" setup>
import TopIcon from '@/assets/top.svg'
import { apiServer } from '@/api'
import Taro, { usePullDownRefresh, useTabItemTap, useDidShow } from '@tarojs/taro'
import { Comment, Eye } from "@nutui/icons-vue-taro";
import { useConfigStore } from '@/stores'
import NavComponent from "@/widgets/navigation.vue";
import { toRefs } from 'vue';

import { 
  useThreadList, 
  useTabDoubleClick, 
  useNavigation, 
  usePageSetup 
} from '@/use';

const cs = useConfigStore();
const { theme, carouselState } = toRefs(cs);

const { isLoading, pagination, threadIndexResponse, refreshThreadList } = useThreadList();
const { handleTabClick } = useTabDoubleClick(
  undefined,
  () => refreshThreadList(true) // 双击时刷新并重置页码
);
const { goThread, goLike, setupShare } = useNavigation();
const { setupPage } = usePageSetup({
  checkForceLogout: true,
  getServerSubscribe: true
});

// 设置页面
setupPage();
setupShare();

// 首页下拉刷新
usePullDownRefresh(() => {
  refreshThreadList();
});

// 监听 Tab 点击
useTabItemTap(() => {
  handleTabClick();
});
</script>

<style lang="scss">
.index-page {
  .carousel {
    img {
      width: 100%;
      height: 42vw;
    }
  }

  .thread-list {
    .thread-title {
      font-size: 16Px;

      .resolved {
        margin-left: 15rpx;
      }
    }

    .nickname {
      display: inline-block;
      min-width: 30vw;
      max-width: 30vw;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }

    .info-desc {
      display: flex;
      justify-content: space-between;
      font-size: 14Px;
      color: var(--text-desc-color);

      .stat {
        display: inline;

        view {
          display: inline;
          margin-left: 1rem;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    padding-bottom: 0.5rem;
  }

  .skeleton-container {
    margin-top: 1rem;
    margin-left: 5vw;
  }

}
</style>
