// 应用基础配置类型（业务无关）
export interface AppConfig {
    theme: 'light' | 'dark' | 'auto'
    language: string
    autoUpdate: boolean
    /** 应用数据存储目录 */
    dataDir: string
}

// 默认配置
export const defaultConfig: AppConfig = {
    theme: 'light',
    language: 'zh-CN',
    autoUpdate: true,
    dataDir: ''
}
