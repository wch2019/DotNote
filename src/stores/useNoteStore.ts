import {defineStore} from "pinia";
import { useConfigStore } from './config';

export const useNoteStore = defineStore('notes', {
    state: () => ({
        // 当前笔记目录
        currentDir: '',
        // 当前选中的笔记文件路径
        currentFilePath: '',
        // 编辑器ID
        editorId: '',
        // 当前笔记内容
        currentContent: '',
        // 也可以把文件列表存在这里，方便全局更新
        notesList: [],
        // 自动保存计时器
        saveTimer: null as NodeJS.Timeout | null,
    }),
    actions: {
        // 从配置初始化当前目录
        async initCurrentDir() {
            const configStore = useConfigStore();
            // 确保 configStore 已加载
            if (!configStore.dataDir) {
                await configStore.loadConfig();
            }
            if (configStore.startupOption=="lastUsed") {
                this.currentDir = configStore.lastOpenedDir || '';
            }
        },
        // 设置当前目录并持久化
        async setCurrentDir(dir: string) {
            this.currentDir = dir;
            const configStore = useConfigStore();
            await configStore.saveConfig({ ...configStore.$state, lastOpenedDir: dir });
        },
        // 选中笔记（安全切换）
        async selectNote(filePath: string) {
            console.log('[笔记] 选中笔记：', filePath)
            if (this.currentFilePath === filePath) return;

            const configStore = useConfigStore();

            // 1. 清除旧的自动保存计时器
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
                this.saveTimer = null;
            }
            // 2. 根据配置决定是否强制保存当前笔记
            if (configStore.autoSaveOnSwitch) {
                await this.saveCurrentNote();
            }

            // 3. 切换到新笔记
            this.currentFilePath = filePath;
            this.currentContent = await window.electronAPI.readFile(filePath);
        },
        // 启动自动保存
        startAutoSave(newContent: string) {
            const configStore = useConfigStore();
            // 如果未开启自动保存，则不执行任何操作
            if (!configStore.autoSave) {
                this.currentContent = newContent; // 仍然更新内容，但不保存
                return;
            }

            this.currentContent = newContent;

            // 清除之前的计时器
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
            }

            // 设置新的计时器
            this.saveTimer = setTimeout(async () => {
                console.log("自动保存");
                await this.saveCurrentNote();
                this.saveTimer = null; // 保存后重置
            }, 1000);
        },
        // 执行保存
        async saveCurrentNote() {
            if (!this.currentFilePath) return;
            // 确保保存的是最新的 store 内容
            const success = await window.electronAPI.saveFile(this.currentFilePath, this.currentContent);
            if (success) {
                console.log('文件已保存:', this.currentFilePath);
            }
        },
        // 新建笔记
        async newNote() {
            const fileName = `未命名笔记-${Date.now()}.md`;
            const newFilePath = `${this.currentDir}\\${fileName}`;
            const defaultContent = `# 新建笔记\n\n`;
            const success = await window.electronAPI.saveFile(newFilePath, defaultContent);
            if (success) {
                console.log('新笔记已创建:', newFilePath);
                await this.selectNote(newFilePath);
                return newFilePath;
            }
            return null;
        }
    }
})
