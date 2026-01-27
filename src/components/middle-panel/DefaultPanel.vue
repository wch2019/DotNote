<template>
  <div class="middle-panel-container">
    <div class="panel-search-bar" v-if="showSearch">
      <n-input
        :placeholder="searchPlaceholder"
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
      <slot>
        <div class="placeholder-content">
          <p class="placeholder-text">{{ placeholderText }}</p>
          <p class="placeholder-hint">{{ placeholderHint }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SearchOutline } from '@vicons/ionicons5'
import { NInput, NIcon } from 'naive-ui'

const SearchIcon = SearchOutline

interface Props {
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 占位文本 */
  placeholderText?: string
  /** 占位提示 */
  placeholderHint?: string
}

interface Emits {
  /** 搜索事件 */
  (e: 'search', value: string): void
}

withDefaults(defineProps<Props>(), {
  showSearch: true,
  searchPlaceholder: '搜索',
  placeholderText: '列表区域',
  placeholderHint: '在此显示列表内容'
})

const emit = defineEmits<Emits>()

const searchValue = ref('')

function handleSearch(value: string) {
  emit('search', value)
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
  display: flex;
  flex-direction: column;
}

.placeholder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.placeholder-text {
  font-size: 16px;
  color: var(--n-text-color);
  margin: 0 0 8px 0;
  opacity: 0.6;
}

.placeholder-hint {
  font-size: 12px;
  color: var(--n-text-color);
  margin: 0;
  opacity: 0.4;
}
</style>
