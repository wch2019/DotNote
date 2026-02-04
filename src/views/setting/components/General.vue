<template>
  <div class="tab-content">

    <div class="setting-item">
      <div class="item-label">保存</div>
      <div class="item-content">
        <n-checkbox v-model:checked="config.autoSave">自动保存</n-checkbox>
        <n-checkbox v-model:checked="config.autoSaveOnSwitch">切换文件时自动保存</n-checkbox>
      </div>
    </div>

    <div class="setting-item">
      <div class="item-label">启动选项</div>
      <div class="item-content">
        <n-radio-group v-model:value="config.startupOption">
          <n-space>
            <n-radio value="newFile">打开新文件</n-radio>
            <n-radio value="lastUsed">重新打开上一次使用目录</n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </div>
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
  font-weight: 600;
  padding-top: 10px;
  margin-bottom: 8px;
}
.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
</style>
