<template>
  <div class="tab-content">

    <div class="setting-item">
      <div class="item-label">主题模式</div>
      <div class="item-content">
        <n-select v-model:value="config.theme" :options="themeOptions" @update:value="$emit('theme-change', $event)"/>
      </div>
    </div>

    <div class="setting-item">
      <div class="item-label">语言</div>
      <div class="item-content">
        <n-select v-model:value="config.language" :options="languageOptions"/>
      </div>
    </div>

    <div class="setting-item">
      <div class="item-label">更新</div>
      <div class="item-content">
        <n-checkbox v-model:checked="config.autoUpdate">自动检查更新</n-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ config: any }>();
defineEmits(['theme-change']);

const themeOptions = [
  {label: '浅色', value: 'light'},
  {label: '深色', value: 'dark'},
  {label: '跟随系统', value: 'auto'}
];
const languageOptions = [{label: '中文', value: 'zh-CN'}];
</script>

<style scoped>
.tab-content {
  height: calc(100vh - 290px);
  overflow-y: auto;
  padding: 16px 0;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
</style>
