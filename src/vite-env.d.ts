/// <reference types="vite/client" />

import type {AppConfig} from "./types/defaultConfig";
import 'vue-router'

export {}

// 扩展路由 meta 类型
declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        icon?: string
        showInMenu?: boolean
        showMiddlePanel?: boolean // 控制中间区域显示/隐藏
        middlePanelComponent?: string // 中间面板组件名称，如 'FilePanel', 'DefaultPanel'
    }
}

declare global {
    interface Window {
        electronAPI: {
            // 窗口控制
            minimize: () => void
            maximize: () => void
            close: () => void

            // 配置文件相关
            getConfigPath: () => Promise<string>
            readConfig: () => Promise<AppConfig>
            writeConfig: (config: AppConfig) => Promise<boolean>
            selectPath: (type?: 'file' | 'directory') => Promise<string | null>
            migrateDataDir: (oldPath: string, newPath: string) => Promise<boolean>

            // 路由
            getLastRoute: () => Promise<string>
            saveRoute: (path: string) => void

            // 笔记列表
            readFileTree: (dataDir: string) => Promise<any[]>
            readNotesList: (dataDir: string) => Promise<string[]>
            readFile: (filePath: string) => Promise<string>
            saveFile: (filePath: string, content: string) => Promise<{ success: boolean, error?: any }>
            createItem: (parentPath: string, name: string, isDirectory: boolean) => Promise<string>
            renameItem: (oldPath: string, newName: string) => Promise<string>
            deleteItem: (targetPath: string) => Promise<boolean>
            showInFolder: (targetPath: string) => Promise<void>
            getItemProperties: (filePath: string) => Promise<any>
            getDirname: (filePath: string) => Promise<string>
        }

        $message: {
            success: (message: string) => void
            error: (message: string) => void
            warning: (message: string) => void
            info: (message: string) => void
        }
    }
}

