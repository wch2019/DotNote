// 应用基础配置类型
export interface AppConfig {
    /** 主题 */
    theme: 'light' | 'dark' | 'auto'
    /** 应用语言 */
    language: string
    /** 是否自动更新 */
    autoUpdate: boolean
    /** 应用数据存储目录 */
    dataDir: string,
    /** 最后打开的目录 */
    lastOpenedDir: string,
    /** 自动保存 */
    autoSave: boolean,
    /** 切换文件时自动保存 */
    autoSaveOnSwitch: boolean,
    /** 启动选项 */
    startupOption: 'newFile' | 'lastUsed'
}

// 默认配置
export const defaultConfig: AppConfig = {
    theme: 'light',
    language: 'zh-CN',
    autoUpdate: true,
    dataDir: '',
    lastOpenedDir: '',
    autoSave: false,
    autoSaveOnSwitch: true,
    startupOption: 'lastUsed'
}
