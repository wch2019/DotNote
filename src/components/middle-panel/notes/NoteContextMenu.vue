<template>
  <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="dropdownOptions"
      :show="showDropdown"
      @select="handleDropdownSelect"
      @clickoutside="showDropdown = false"
  />

  <n-modal
      v-model:show="showRenameModal"
      preset="dialog"
      title="重命名"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleRename"
  >
    <n-input v-model:value="newName" placeholder="请输入新名称" @keyup.enter="handleRename"/>
  </n-modal>

  <n-modal
      v-model:show="showNewItemModal"
      preset="dialog"
      :title="`新建${newItemType === 'file' ? '文件' : '文件夹'}`"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleCreateItem"
  >
    <n-input v-model:value="newItemName" placeholder="请输入名称" @keyup.enter="handleCreateItem"/>
  </n-modal>

  <n-modal
      v-model:show="showPropertiesModal"
      preset="card"
      title="属性"
      style="width: 450px"
  >
    <div v-if="properties && selectedNode">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <n-icon size="32">
          <component :is="properties.isDirectory ? FolderOutline : DocumentTextOutline" />
        </n-icon>
        <span style="font-size: 18px; font-weight: bold;">{{ fileName }}</span>
      </div>

      <n-divider />

      <n-descriptions label-placement="left" :column="1" bordered>
        <n-descriptions-item label="文件类型">{{ fileType }}</n-descriptions-item>
        <n-descriptions-item label="文件位置">{{ location }}</n-descriptions-item>
      </n-descriptions>

      <n-divider style="margin: 16px 0;" />

      <n-descriptions label-placement="left" :column="1" bordered>
        <n-descriptions-item label="文件大小">{{ formattedSize }}</n-descriptions-item>
      </n-descriptions>

      <n-divider style="margin: 16px 0;" />

      <n-descriptions label-placement="left" :column="1" bordered>
        <n-descriptions-item label="创建时间">{{ new Date(properties.createdAt).toLocaleString() }}</n-descriptions-item>
        <n-descriptions-item label="修改时间">{{ new Date(properties.modifiedAt).toLocaleString() }}</n-descriptions-item>
      </n-descriptions>
    </div>
  </n-modal>

</template>

<script setup lang="ts">
import {ref, nextTick, computed} from 'vue'
import {
  NDropdown, NModal, NInput, useDialog, type TreeOption,
  NDescriptions, NDescriptionsItem, NDivider, NIcon
} from 'naive-ui'
import { DocumentTextOutline, FolderOutline } from '@vicons/ionicons5'

const dialog = useDialog()
const emit = defineEmits(['action-completed'])

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const selectedNode = ref<TreeOption | null>(null)

const showRenameModal = ref(false)
const newName = ref('')

const showNewItemModal = ref(false)
const newItemName = ref('')
const newItemType = ref<'file' | 'folder'>('file')

const showPropertiesModal = ref(false)
const properties = ref<any>(null)
const location = ref('')

const dropdownOptions = computed(() => [
  {label: '新建文件', key: 'new-file'},
  {label: '新建文件夹', key: 'new-folder'},
  {type: 'divider', key: 'd1'},
  {label: '重命名', key: 'rename'},
  {label: '删除', key: 'delete'},
  {type: 'divider', key: 'd2'},
  {label: '在文件管理器中显示', key: 'showInFolder'},
  {label: '属性', key: 'properties'}
])

const fileName = computed(() => (selectedNode.value?.key as string)?.split(/[\\/]/).pop() || '')
const fileType = computed(() => properties.value?.isDirectory ? '文件夹' : 'Markdown 文件 (.md)')

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const formattedSize = computed(() => properties.value ? formatBytes(properties.value.size) : '0 Bytes')


const show = (event: MouseEvent, node: TreeOption) => {
  event.preventDefault()
  showDropdown.value = false
  selectedNode.value = node
  nextTick().then(() => {
    showDropdown.value = true
    x.value = event.clientX
    y.value = event.clientY
  })
}

const handleDropdownSelect = async (key: string) => {
  showDropdown.value = false
  if (!selectedNode.value) return

  switch (key) {
    case 'new-file':
      newItemType.value = 'file'
      newItemName.value = ''
      showNewItemModal.value = true
      break
    case 'new-folder':
      newItemType.value = 'folder'
      newItemName.value = ''
      showNewItemModal.value = true
      break
    case 'rename':
      newName.value = selectedNode.value.label as string
      showRenameModal.value = true
      break
    case 'delete':
      dialog.warning({
        title: '确认删除',
        content: `确定要将 "${selectedNode.value.label}" 移入回收站吗？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await window.electronAPI.deleteItem(selectedNode.value.key as string)
          emit('action-completed')
        }
      })
      break
    case 'showInFolder':
      window.electronAPI.showInFolder(selectedNode.value.key as string)
      break
    case 'properties':
      const nodeKey = selectedNode.value.key as string
      const [props, loc] = await Promise.all([
        window.electronAPI.getItemProperties(nodeKey),
        window.electronAPI.getDirname(nodeKey)
      ]);
      properties.value = props
      location.value = loc
      showPropertiesModal.value = true
      break
  }
}

const handleRename = async () => {
  if (selectedNode.value && newName.value) {
    await window.electronAPI.renameItem(selectedNode.value.key as string, newName.value)
    showRenameModal.value = false
    emit('action-completed')
  }
}

const handleCreateItem = async () => {
  if (selectedNode.value && newItemName.value) {
    const parentDir = selectedNode.value.isDirectory
        ? selectedNode.value.key
        : await window.electronAPI.getDirname(selectedNode.value.key as string)

    await window.electronAPI.createItem(parentDir, newItemName.value, newItemType.value === 'folder')
    showNewItemModal.value = false
    emit('action-completed')
  }
}

defineExpose({
  show
})
</script>
