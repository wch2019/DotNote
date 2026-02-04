<template>
  <n-layout-content ref="contentRef" style="height: calc(100vh - 49px);">
    <VditorEditor
        v-if="currentFilePath"
        ref="vditorRef"
        v-model="content"
        :height="'calc(100vh - 81px)'"
        :mode="editorMode"
        @after="handleEditorReady"
    />
    <div class="intro-container" v-else>
      <n-result status="404" title="记录灵感" description="从中间列表选择一篇笔记开始编辑">
        <template #icon>
          <n-icon size="144">
            <NoteIcon />
          </n-icon>
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
        <n-button quaternary @click="toggleEditorMode" :title="currentModeLabel">
          <template #icon>
            <n-icon>
              <component :is="modeIcon"/>
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="footer-right">
        <n-dropdown
            trigger="click"
            :options="allStats"
            @select="handleSelect"
        >
          <n-button quaternary title="字数统计">
            {{ getWordCount }}
          </n-button>
        </n-dropdown>
      </div>

    </n-layout-footer>
  </n-layout-content>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useNoteStore} from '@/stores/useNoteStore';
import {useThemeStore} from '@/stores/theme';
import VditorEditor from "@/components/Vditor/VditorEditor.vue";
import {useMessage} from "naive-ui";
import {CodeSlashOutline, CreateOutline, EyeOutline} from "@vicons/ionicons5";
import {PanelLeft20Regular, PanelLeftExpand20Regular} from "@vicons/fluent";
import {MachineLearning} from "@vicons/carbon";
import NoteIcon from "@/assets/svg/note.svg?component";

const message = useMessage()
const noteStore = useNoteStore();
const themeStore = useThemeStore();
const vditorRef = ref(null);

const content = ref('')
const currentFilePath = ref('')
watch(() => noteStore.currentContent, () => {
  content.value = noteStore.currentContent
  currentFilePath.value = noteStore.currentFilePath
})
const editorMode = ref('ir');

const isSidebarCollapsed = computed(() => themeStore.isMiddlePanelCollapsed);

// 默认显示的文本统计项
const count = ref("words");

// 统计字数
const allStats = computed(() => {
  const charCount = content.value.length;
  const wordCount = (content.value.match(/[A-Za-z0-9_]+|[\u4e00-\u9fa5]/g) || []).length;
  const lineCount = content.value.split('\n').length;
  const minutesToRead = Math.ceil(wordCount / 200);
  return [
    {key: 'minutes', label: `≤ ${minutesToRead} 分钟`},
    {key: 'lines', label: `${lineCount} 行`},
    {key: 'words', label: `${wordCount} 词`},
    {key: 'chars', label: `${charCount} 字符`},
  ];
});
const getWordCount = computed(() => {
  const selectedStat = allStats.value.find(item => item.key === count.value);
  if (selectedStat) {
    return selectedStat.label;
  }
});

// 处理dropdown选择事件
const handleSelect = (key) => {
  count.value = key;
};


const editorModes = ['ir', 'wysiwyg', 'sv'];
const currentModeIndex = ref(0);

const currentModeLabel = computed(() => ({
  ir: '即时渲染模式',
  wysiwyg: '所见即所得模式',
  sv: '分屏预览模式'
}[editorModes[currentModeIndex.value]]));

const modeIcon = computed(() => ({
  ir: EyeOutline,
  wysiwyg: MachineLearning,
  sv: CodeSlashOutline
}[editorModes[currentModeIndex.value]]));

const toggleEditorMode = () => {
  currentModeIndex.value = (currentModeIndex.value + 1) % editorModes.length;
  editorMode.value = editorModes[currentModeIndex.value];
};

const toggleSidebar = () => {
  themeStore.toggleMiddlePanel();
};

// 自动保存逻辑
watch(content, (newVal) => {
  if (noteStore.currentFilePath) { // 确保有选中的文件
    noteStore.startAutoSave(newVal);
  }
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
