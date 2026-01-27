<template>
  <div class="middle-panel-container">
    <div class="panel-search-bar">
      <n-input
        placeholder="搜索文件"
        size="small"
        clearable
        v-model:value="searchValue"
        @update:value="handleSearch"
      >
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>
    <div class="panel-content">
      <div class="file-list">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="file-item"
          :class="{ 'active': selectedId === item.id }"
          @click="selectItem(item.id)"
        >
          <div class="file-icon">
            <n-icon :component="FileIcon" />
          </div>
          <div class="file-info">
            <div class="file-name">{{ item.name }}</div>
            <div class="file-meta">{{ item.meta }}</div>
          </div>
        </div>
      </div>
      <div v-if="filteredItems.length === 0" class="empty-state">
        <p>暂无文件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SearchOutline, DocumentOutline } from '@vicons/ionicons5'
import { NInput, NIcon } from 'naive-ui'

const SearchIcon = SearchOutline
const FileIcon = DocumentOutline

interface FileItem {
  id: string
  name: string
  meta: string
}

const searchValue = ref('')
const selectedId = ref<string | null>(null)

// 示例数据，实际使用时可以从 props 或 store 获取
const items = ref<FileItem[]>([
  { id: '1', name: '示例文件1.txt', meta: '2024-01-01' },
  { id: '2', name: '示例文件2.txt', meta: '2024-01-02' },
  { id: '3', name: '示例文件3.txt', meta: '2024-01-03' },
])

const filteredItems = computed(() => {
  if (!searchValue.value) {
    return items.value
  }
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

function handleSearch() {
  // 搜索逻辑已在 computed 中处理
}

function selectItem(id: string) {
  selectedId.value = id
  // 可以触发事件通知父组件
  // emit('select', id)
}
</script>

<style scoped>
.middle-panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--quick-actions);
}

.panel-search-bar {
  padding: 8px;
  border-bottom: 1px solid var(--n-border-color);
  background: var(--quick-actions);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

.file-list {
  padding: 4px 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 12px;
}

.file-item:hover {
  background-color: var(--n-color-hover);
}

.file-item.active {
  background-color: var(--n-color-hover);
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--n-text-color);
  opacity: 0.7;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  color: var(--n-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  font-size: 12px;
  color: var(--n-text-color);
  opacity: 0.6;
  margin-top: 2px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--n-text-color);
  opacity: 0.4;
}
</style>
