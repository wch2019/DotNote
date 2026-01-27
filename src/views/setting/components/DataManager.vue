<template>
  <div class="setting-item">
    <div class="item-label">数据存储路径</div>
    <FilePicker
        v-model="config.dataDir"
        type="directory"
        placeholder="数据存储路径"
    />
    <div class="item-desc">
      应用数据将存储在此目录下（<span class="text-red-400">不支持移动到自身子目录中</span>）
    </div>
  </div>
  <div class="setting-item">
    <div class="item-label">导出数据</div>
    <div class="item-content">
      <n-button @click="$emit('export', $event)" type="primary" disabled>导出所有数据</n-button>
    </div>
  </div>

  <div class="setting-item">
    <div class="item-label">清除数据</div>
    <div class="item-content">
      <n-button @click="$emit('clear', $event)" type="error" disabled>清除所有数据</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FilePicker from "@/components/FilePicker.vue";
defineProps<{ config: any }>();
defineEmits(['export', 'clear']);
</script>

<style scoped>
.setting-item {
  margin-bottom: 20px;
}

.item-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
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
