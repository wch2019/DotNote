<template>
  <div class="sidebar-container">
    <!-- 导航菜单 -->
    <div class="menu-section">
      <n-menu
          :options="menuOptions"
          :value="activeKey"
          :indent="18"
          @update:value="handleMenuSelect"
          mode="vertical"
      />
    </div>
    <!-- 设置按钮 -->
    <div class="settings-button">
      <n-button
        quaternary
        circle
        size="small"
        @click="goToSettings"
        :class="{ 'active': activeKey === 'Setting' }"
        :title="'设置'"
      >
        <template #icon>
          <n-icon>
            <SettingsOutline />
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 左侧菜单组件
 * 
 * 功能：
 * - 显示路由菜单（仅图标）
 * - 底部固定设置按钮
 * - 自动高亮当前路由
 */

import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {NMenu, NButton, NIcon} from 'naive-ui'
import {SettingsOutline} from '@vicons/ionicons5'
import {routes} from '@/router'
import {routesToMenuOptions} from '@/utils/routes-to-menu'

const router = useRouter()
const route = useRoute()

// 从路由配置生成菜单选项
const menuOptions = routesToMenuOptions(routes)

// 当前激活的菜单项（根据路由名称）
const activeKey = computed(() => route.name as string)

/**
 * 处理菜单项选择
 * @param key 路由名称
 */
function handleMenuSelect(key: string) {
  router.push({name: key})
}

/**
 * 跳转到设置页面
 */
function goToSettings() {
  router.push({name: 'Setting'})
}
</script>

<style scoped>
.sidebar-container {
  min-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 菜单区域 */
.menu-section {
  flex: 1;
  padding: 16px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 设置按钮 */
.settings-button {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.settings-button :deep(.n-button) {
  width: 40px;
  height: 40px;
}
</style>
