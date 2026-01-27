<template>
  <n-layout-content ref="contentRef" style="height: calc(100vh - 49px);">
    <VditorEditor
        v-if="content"
        v-model="content"
        :height="'calc(100vh - 81px)'"
        @after="handleEditorReady"
    />
    <div class="intro-container" v-else>
      <n-result status="404" title="记录灵感" description="从中间列表选择一篇笔记开始编辑，或点击上方新建按钮">
        <template #icon>
          <n-icon size="64" :component="CreateOutline" />
        </template>
        <template #footer>
          <n-button @click="handleCreate">立即新建笔记</n-button>
        </template>
      </n-result>
    </div>

    <n-layout-footer bordered class="footer">
      <div class="footer-left">
        <n-button quaternary @click="toggleSidebar" title="折叠/展开侧边栏" text>
          <template #icon>
            <n-icon>
              <PanelLeft20Regular v-if="!isSidebarCollapsed" />
              <PanelLeftExpand20Regular v-else />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="footer-right">
        <span>{{ wordCount }} 字</span>
      </div>
    </n-layout-footer>
  </n-layout-content>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import { useNoteStore } from '@/stores/useNoteStore';
import { useThemeStore } from '@/stores/theme';
import VditorEditor from "@/components/Vditor/VditorEditor.vue";
import {useMessage} from "naive-ui";
import {CreateOutline} from "@vicons/ionicons5";
import { PanelLeft20Regular, PanelLeftExpand20Regular } from "@vicons/fluent";

const message = useMessage()
const noteStore = useNoteStore();
const themeStore = useThemeStore();

const content=computed(() => noteStore.currentContent)

const isSidebarCollapsed = computed(() => themeStore.isMiddlePanelCollapsed);

const wordCount = computed(() => {
  // 简单的字数统计，可以根据需要调整
  return content.value.length;
});

const toggleSidebar = () => {
  themeStore.toggleMiddlePanel();
};

// 自动保存逻辑（防抖）
let saveTimer = null;
watch(content, (newVal) => {
  // 更新 Store 里的内容，确保状态同步
  noteStore.currentContent = newVal;
  // 防抖处理：停止输入 1000ms 后保存
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    console.log("自动保存")
    await noteStore.saveCurrentNote()
  }, 1000);
});

// 监听快捷键 Ctrl+S / Command+S
onMounted(() => {
  window.addEventListener('keydown', async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault(); // 阻止浏览器默认保存行为
      if (noteStore.currentFilePath) {
        await noteStore.saveCurrentNote()
        message.info('保存成功')
      }
    }
  });
});

const handleEditorReady = (instance) => {
  console.log('编辑器就绪', instance);
};

// 触发新建笔记
const handleCreate = async () => {
  await noteStore.newNote();
};
</script>
<style scoped>
.intro-container {
  max-width: 800px;
  margin: 0 auto;
  height: calc(100% - 34px);
  display: flex; /* 使用 Flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 增加内边距 */
  box-sizing: border-box; /* 确保内边距不会增加总宽度 */
}

.footer {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.footer-left, .footer-right {
  display: flex;
  align-items: center;
}
</style>
