<template>
  <div class="setting-page">
    <div class="setting-container">
      <div class="setting-header" >
        <h1 class="setting-title" v-if="showFooter">应用设置</h1>
      </div>

      <div class="settings-content">
        <n-tabs v-model:value="activeTab" type="line" animated placement="left">
          <n-tab-pane name="system" tab="常规设置">
            <General :config="configStore.$state" @theme-change="onThemeChange"/>
          </n-tab-pane>
          <n-tab-pane name="data" tab="数据管理">
            <DataManager
                :config="configStore.$state"
                @export="exportData"
                @clear="clearData"
            />
          </n-tab-pane>
          <n-tab-pane name="contact" tab="交流打赏">
            <Contact />
          </n-tab-pane>
          <n-tab-pane name="about" tab="关于">
            <About/>
          </n-tab-pane>
        </n-tabs>
      </div>

      <div v-if="showFooter" class="setting-footer">
        <n-button @click="resetSettings">重置为默认设置</n-button>
        <n-button type="primary" @click="saveSettings">保存</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { defaultConfig } from '../../types/defaultConfig.ts'
import {useDialog, useMessage} from 'naive-ui'
import {useThemeStore} from '@/stores/theme'
import { useConfigStore } from '@/stores/config'
import General from "@/views/setting/components/General.vue";
import DataManager from "@/views/setting/components/DataManager.vue";
import About from "@/views/setting/components/About.vue";
import Contact from "@/views/setting/components/Contact.vue";

// 定义当前激活的 Tab，默认选中第一个
const activeTab = ref('system')
const themeStore = useThemeStore()
const dialog = useDialog()
const message = useMessage()
const configStore = useConfigStore();
// 记录原始数据目录，用于对比是否发生变化
const originDataDir = ref<string>()

// 只有在 system 和 data 页面显示底部按钮
const showFooter = computed(() => ['system', 'data'].includes(activeTab.value))

// 导出数据
async function exportData() {
  message.warning('暂未实现')
}

// 清除数据
async function clearData() {
  dialog.warning({
    title: '警告',
    content: '确定要清除所有数据吗？此操作不可恢复。',
    positiveText: '清除',
    negativeText: '取消',
    draggable: true,
    onPositiveClick: () => {
      message.success('暂未实现')
    },
    onNegativeClick: () => {
    }
  })
}

// 重置设置
function resetSettings() {
  dialog.warning({
    title: '警告',
    content: '确定要重置所有设置吗？',
    positiveText: '重置',
    negativeText: '取消',
    draggable: true,
    onPositiveClick: async () => {
      const config = { ...defaultConfig }
      config.dataDir = originDataDir.value || ''
      await configStore.saveConfig(config)
      await configStore.loadConfig()
      message.success('重置成功')
    },
    onNegativeClick: () => {
    }
  })
}

// 主题保存
function onThemeChange(theme: any) {
  themeStore.setTheme(theme)
}

// 保存设置
async function saveSettings() {
  try {
    await configStore.saveConfig(configStore.$state)
    if (configStore.dataDir !== originDataDir.value) {
      dialog.warning({
        title: '警告',
        content: '数据存储目录修改是否迁移目录',
        positiveText: '迁移',
        negativeText: '不迁移',
        draggable: true,
        onPositiveClick: async () => {
          if (originDataDir.value) {
            await window.electronAPI.migrateDataDir(originDataDir.value, configStore.dataDir)
          }
          await init()
          message.success('设置成功')
        },
        onNegativeClick: () => {
          message.success('设置成功')
        }
      })
    } else {
      message.success('设置成功')
    }

  } catch (error) {
    message.error('保存设置失败，' + error)
  }
}

// 获取目录
async function init() {
  const path = window.electronAPI.getConfigPath()
  console.log('配置文件路径:', path)

  await configStore.loadConfig()
  originDataDir.value = configStore.dataDir
  console.log('配置读取:', configStore.$state)
}

onMounted(async () => {
  await init()
})
</script>

<style scoped>
.setting-page {
  background: var(--content-bg);
  height: var(--content-height);
  padding: 16px;

}

.setting-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--quick-actions);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.setting-header {
  text-align: center;
  margin-bottom: 10px;
}

.setting-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.settings-content {
  min-height: calc(100vh - 230px);
}

.setting-footer {
  height: 54px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--n-border-color);
}
</style>
