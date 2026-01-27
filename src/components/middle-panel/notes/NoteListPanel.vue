<script setup lang="ts">
import {h, onMounted, ref} from 'vue'
import {useNoteStore} from "@/stores/useNoteStore.ts"
import {DocumentTextOutline, FolderOutline, RefreshOutline} from "@vicons/ionicons5"
import {NIcon, NEllipsis, type TreeOption} from 'naive-ui'

const noteStore = useNoteStore()
const treeData = ref()
const loading = ref(false)
const expandedKeys = ref<string[]>([]) // 记录展开的文件夹

// 加载树形数据
const loadTree = async () => {
  loading.value = true
  treeData.value = await window.electronAPI.readFileTree(noteStore.currentDir)
  loading.value = false
}

// 渲染图标逻辑
const renderPrefix = ({ option }: { option: TreeOption & { isDirectory?: boolean } }) => {
  return h(NIcon, {
    color: option.isDirectory ? '#f0b03f' : '#666',
    size: 18
  }, {
    default: () => h(option.isDirectory ? FolderOutline : DocumentTextOutline)
  })
}

// 使用 n-ellipsis 渲染标签
const renderLabel = ({ option }: { option: TreeOption }) => {
  return h(
      NEllipsis,
      {
        style: "max-width: 150px",
        tooltip: {
          placement: 'right',
          style: { maxWidth: '400px' }
        }
      },
      {
        // default slot 定义了需要显示省略的文本内容
        default: () => option.label
      }
  )
}

// 处理节点点击
const handleNodeClick = (keys: string[]) => {
  const key = keys[0];
  if (key && key.endsWith('.md')) {
    noteStore.selectNote(key);
  }
}

onMounted(loadTree)
</script>

<template>
  <div class="typora-sidebar">
    <div class="sidebar-header">
      <span>文件</span>
      <n-button quaternary circle size="tiny" @click="loadTree">
        <template #icon><n-icon :component="RefreshOutline" /></template>
      </n-button>
    </div>

    <n-scrollbar class="tree-container">
      <n-spin :show="loading">
        <n-tree
            block-line
            expand-on-click
            :data="treeData"
            :selected-keys="[noteStore.currentFilePath]"
            v-model:expanded-keys="expandedKeys"
            :render-prefix="renderPrefix"
            :render-label="renderLabel"
            @update:selected-keys="handleNodeClick"
        />
      </n-spin>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.typora-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--n-color);
}

.sidebar-header {
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tree-container {
  flex: 1;
  padding: 0 4px;
}

:deep(.n-tree-node) {
  height: 30px;
}

/* 现在 n-ellipsis 会处理溢出，但我们仍然可以设置字体大小 */
:deep(.n-tree-node-content .n-ellipsis) {
  font-size: 13px;
}

:deep(.n-tree-node--selected .n-ellipsis) {
  font-weight: 500;
}
</style>
