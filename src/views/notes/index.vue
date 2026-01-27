<template>
  <n-layout-content ref="contentRef" style="height: calc(100vh - 49px);">
    <VditorEditor
        v-if="content"
        ref="vditorRef"
        v-model="content"
        :height="'calc(100vh - 81px)'"
        @after="handleEditorReady"
    />
    <div class="intro-container" v-else>
      <n-result status="404" title="记录灵感" description="从中间列表选择一篇笔记开始编辑，或点击上方新建按钮">
        <template #icon>
          <n-icon size="64" :component="CreateOutline"/>
        </template>
        <template #footer>
          <n-button @click="handleCreate">立即新建笔记</n-button>
        </template>
      </n-result>
    </div>

    <n-layout-footer bordered class="footer">
      <div class="footer-left">
        <n-button quaternary @click="toggleSidebar" title="折叠/展开侧边栏">
          <template #icon>
            <n-icon>
              <PanelLeft20Regular v-if="!isSidebarCollapsed"/>
              <PanelLeftExpand20Regular v-else/>
            </n-icon>
          </template>
        </n-button>
<!--        <n-button quaternary @click="toggleEditorMode" :title="`切换模式: ${currentModeLabel}`">-->
<!--          <template #icon>-->
<!--            <n-icon>-->
<!--              <component :is="modeIcon"/>-->
<!--            </n-icon>-->
<!--          </template>-->
<!--        </n-button>-->
      </div>
      <div class="footer-right">
        <n-dropdown
            trigger="hover"
            :options="allStats"
            @select="handleSelect"
        >
          {{count }}

        </n-dropdown>
      </div>

    </n-layout-footer>
  </n-layout-content>
</template>

<script setup>
import {h, ref, onMounted, watch, computed} from 'vue';
import {useNoteStore} from '@/stores/useNoteStore';
import {useThemeStore} from '@/stores/theme';
import VditorEditor from "@/components/Vditor/VditorEditor.vue";
import {useMessage, NCheckbox} from "naive-ui";
import {CreateOutline, EyeOutline, CodeSlashOutline} from "@vicons/ionicons5";
import {PanelLeft20Regular, PanelLeftExpand20Regular} from "@vicons/fluent";

const message = useMessage()
const noteStore = useNoteStore();
const themeStore = useThemeStore();
const vditorRef = ref(null);

const content = ref('')
watch(() => noteStore.currentContent, (newVal) => {
  content.value = noteStore.currentContent
})

const isSidebarCollapsed = computed(() => themeStore.isMiddlePanelCollapsed);

// 默认显示的文本统计项，初始化为 `wordCount`
const count = ref("");

// 统计字数
const allStats = computed(() => {
  const charCount = content.value.length;
  const wordCount = (content.value.match(/[\w\u4e00-\u9fa5]+/g) || []).length;
  const lineCount = content.value.split('\n').length;
  const minutesToRead = Math.ceil(wordCount / 200);
  return [
    { key: 'minutes', label: `≤ ${minutesToRead} 分钟` },
    { key: 'lines', label: `${lineCount} 行` },
    { key: 'words', label: `${wordCount} 词` },
    { key: 'chars', label: `${charCount} 字符` },
  ];
});


// 处理dropdown选择事件
const handleSelect = (key) => {
  const selectedStat = allStats.value.find(item => item.key === key);
  if (selectedStat) {
    count.value = selectedStat.label; // 更新显示内容
  }
};



const editorModes = ['ir', 'wysiwyg', 'sv'];
const currentModeIndex = ref(0);

const currentModeLabel = computed(() => ({
  ir: '即时渲染',
  wysiwyg: '所见即所得',
  sv: '分屏预览'
}[editorModes[currentModeIndex.value]]));

const modeIcon = computed(() => ({
  ir: EyeOutline,
  wysiwyg: EyeOutline,
  sv: CodeSlashOutline
}[editorModes[currentModeIndex.value]]));

const toggleEditorMode = () => {
  currentModeIndex.value = (currentModeIndex.value + 1) % editorModes.length;
  const newMode = editorModes[currentModeIndex.value];
  vditorRef.value?.setMode(newMode);
};
// --- 状态栏增强结束 ---

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
count.value = allStats.value.find(stat => stat.key === 'words').label;
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
  padding-right: 10px;
  font-size: 12px;
}

.footer-left, .footer-right {
  display: flex;
  align-items: center;
}

.footer-right {
  cursor: context-menu;
}
</style>
