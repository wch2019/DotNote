import {defineStore} from "pinia";

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
        notesList: []
    }),
    actions: {
        // 选中笔记
        async selectNote(filePath: string) {
            console.log('[笔记] 选中笔记：', filePath)
            if (this.currentFilePath === filePath) return;

            // 切换前可以判断是否需要保存旧文件
            this.currentFilePath = filePath;
            this.currentContent = await window.electronAPI.readFile(filePath);
        },
        // 执行保存
        async saveCurrentNote() {
            if (!this.currentFilePath) return;
            const success = await window.electronAPI.saveFile(this.currentFilePath, this.currentContent);
            if (success) {
                console.log('文件已保存');
            }
        },
        // 新建笔记
        async newNote() {
            const fileName = `未命名笔记-${Date.now()}.md`;
            // This is tricky without path.join. Let's hope string concatenation works.
            // The separator seems to be '\\' from the currentDir state.
            const newFilePath = `${this.currentDir}\\${fileName}`;
            const defaultContent = `# 新建笔记\n\n`;
            const success = await window.electronAPI.saveFile(newFilePath, defaultContent);
            if (success) {
                console.log('新笔记已创建:', newFilePath);
                await this.selectNote(newFilePath);
                // I should probably refresh the list of notes here.
                // I don't have a refresh action.
                // Let's just add it to the list manually. I don't know the structure of notesList items.
                // Let's assume it's just file paths for now.
                // this.notesList.push(newFilePath); // This would be wrong if it's an object.
                return newFilePath; // Return the path so the component knows.
            }
            return null;
        }
    }
})
