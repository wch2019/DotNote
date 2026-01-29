<script setup lang="ts">
import {h, onMounted, ref} from 'vue'
import {useNoteStore} from "@/stores/useNoteStore.ts"
import {Add, DocumentTextOutline, FolderOutline, RefreshOutline} from "@vicons/ionicons5"
import {NEllipsis, NIcon, type TreeOption} from 'naive-ui'
import {HandClick} from "@vicons/tabler";
import NoteContextMenu from './NoteContextMenu.vue'

const noteStore = useNoteStore()
const treeData = ref()
const loading = ref(false)
const expandedKeys = ref<string[]>([])
const contextMenuRef = ref<InstanceType<typeof NoteContextMenu> | null>(null)

// --- 右键菜单 ---
const handleContextMenu = (e: MouseEvent, node: TreeOption) => {
  contextMenuRef.value?.show(e, node)
}

const nodeProps = ({option}: { option: TreeOption }) => {
  return {
    onContextmenu: (e: MouseEvent) => handleContextMenu(e, option)
  }
}
// --- 右键菜单结束 ---

// 加载树形数据
const loadTree = async () => {
  if (noteStore.currentDir) {
    loading.value = true
    treeData.value = await window.electronAPI.readFileTree(noteStore.currentDir)
    loading.value = false
  } else {
    treeData.value = []
  }
}

// 渲染图标逻辑
const renderPrefix = ({option}: { option: TreeOption & { isDirectory?: boolean } }) => {
  return h(NIcon, {
    color: option.isDirectory ? '#f0b03f' : '#666',
    size: 18
  }, {
    default: () => h(option.isDirectory ? FolderOutline : DocumentTextOutline)
  })
}

// 使用 n-ellipsis 渲染标签
const renderLabel = ({option}: { option: TreeOption }) => {
  return h(
      NEllipsis,
      {
        style: "max-width: 150px",
        tooltip: {
          placement: 'right',
          style: {maxWidth: '400px'}
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

const addMarkdown = () => {
}
const openFolder = async () => {
  const selectedPath = await window.electronAPI.selectPath("directory");
  if (selectedPath) {
    noteStore.currentDir = selectedPath
    await loadTree()
  }
}

function getLastDirectoryName(path: string): string {
  // 先将反斜杠转换为正斜杠（以防跨平台兼容性）
  const normalizedPath = path.replace(/\\/g, '/');

  // 使用 split 按照路径分隔符分割路径，获取最后一部分
  const pathParts = normalizedPath.split('/');

  // 返回路径的最后一部分
  return pathParts[pathParts.length - 1];
}


onMounted(loadTree)
</script>

<template>
  <n-layout-content class="typora-sidebar" style="height: calc(100vh - 49px);">
    <div class="sidebar-header">
      <span>文件</span>
      <n-button quaternary circle size="tiny" @click="loadTree">
        <template #icon>
          <n-icon :component="RefreshOutline"/>
        </template>
      </n-button>
    </div>
    <div class="middle">
      <n-scrollbar v-if="noteStore.currentDir" class="tree-container">
        <n-spin :show="loading">
          <n-tree
              block-line
              expand-on-click
              :data="treeData"
              :selected-keys="[noteStore.currentFilePath]"
              v-model:expanded-keys="expandedKeys"
              :render-prefix="renderPrefix"
              :render-label="renderLabel"
              :node-props="nodeProps"
              @update:selected-keys="handleNodeClick"
          />
        </n-spin>
      </n-scrollbar>
      <n-button v-else @click="openFolder" text title="选择文件夹">
        <div class="flex flex-col items-center">
          <n-icon size="48" :component="FolderOutline"/>
          <n-icon size="18" :component="HandClick"/>
        </div>
      </n-button>
    </div>
    <n-layout-footer bordered class="footer">
      <div class="footer-left">
        <n-button v-if="noteStore.currentDir" quaternary @click="addMarkdown" title="新建文件">
          <template #icon>
            <n-icon :component="Add"/>
          </template>
        </n-button>
      </div>
      <div class="footer-right">
        <n-button quaternary @click="openFolder" style=" width: 100%;" :title="noteStore.currentDir">{{
            getLastDirectoryName(noteStore.currentDir)
          }}
        </n-button>
      </div>
    </n-layout-footer>

    <NoteContextMenu ref="contextMenuRef" @action-completed="loadTree"/>

  </n-layout-content>
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

.middle {
  height: calc(100% - 76px);
  display: flex;
  justify-content: center;
  align-items: center;
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

.footer {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.footer-left {
  display: flex;
  align-items: center;
}

.footer-right {
  width: 100%;
  flex: 1;
}
</style>
