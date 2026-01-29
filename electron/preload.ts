import {ipcRenderer, contextBridge} from 'electron'
import {type AppConfig} from '@/types/defaultConfig.ts'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...
})

// 暴露窗口控制API
contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // 配置文件相关（框架能力：本地配置持久化）
    readConfig: () => ipcRenderer.invoke('config-read'),
    writeConfig: (config: AppConfig) => ipcRenderer.invoke('config-write', config),
    getConfigPath: () => ipcRenderer.invoke('config-get-path'),
    selectPath: (type = 'file') => ipcRenderer.invoke('dialog:selectPath', {type}),
    migrateDataDir: (oldPath: string, newPath: string) => ipcRenderer.invoke('config-migrate-data-dir', oldPath, newPath),
    // 路由相关
    getLastRoute: () => ipcRenderer.invoke('get-last-route'),
    saveRoute: (path: string) => ipcRenderer.send('save-route', path),
    // 笔记列表相关
    readFileTree: (dataDir: string) => ipcRenderer.invoke('read-file-tree', dataDir),
    readNotesList: (dataDir: string) => ipcRenderer.invoke('read-notes-list', dataDir),
    readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', filePath, content),
    createItem: (parentPath: string, name: string, isDirectory: boolean) => ipcRenderer.invoke('create-item', parentPath, name, isDirectory),
    renameItem: (oldPath: string, newName: string) => ipcRenderer.invoke('rename-item', oldPath, newName),
    deleteItem: (targetPath: string) => ipcRenderer.invoke('delete-item', targetPath),
    showInFolder: (targetPath: string) => ipcRenderer.invoke('show-in-folder', targetPath),
    getItemProperties: (filePath: string) => ipcRenderer.invoke('get-item-properties', filePath),
    getDirname: (filePath: string) => ipcRenderer.invoke('get-dirname', filePath),

})
