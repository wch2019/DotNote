import {app, BrowserWindow} from 'electron'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {registerAllIpcHandlers} from './ipc'
import {setMainWindow} from './ipc/window'
import './log/console-gbk.ts';
import os from 'node:os'

// 当前文件所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// 开发模式:
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
// 设置应用根目录
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
// 环境变量：开发模式下使用 VITE_DEV_SERVER_URL
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
// 主进程构建目录
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
// 渲染进程构建目录
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
// 设置资源目录（开发模式使用 public，生产模式使用构建好的 dist）
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST


// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}


/**
 * 主窗口引用
 * 用于在应用生命周期中管理主窗口实例
 */
let win: BrowserWindow | null
// 设置应用图标路径
const iconPath = path.join(process.env.VITE_PUBLIC, 'favicon.ico')
// 预加载脚本
const preload = path.join(__dirname, 'preload.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

/**
 * 创建主窗口
 * 配置窗口属性、加载页面、设置事件监听
 */
function createWindow() {
    win = new BrowserWindow({
        title: 'DotNote',           // 应用窗口标题
        frame: false,                // 隐藏原生标题栏
        titleBarStyle: 'hidden',     // macOS 特有样式
        icon: iconPath,              // 应用图标路径
        minWidth: 830,               // 最小宽度限制
        minHeight: 640,              // 最小高度限制
        webPreferences: {
            preload,
            // 生产环境下禁用开发者工具
            devTools: !app.isPackaged
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // nodeIntegration: true,

            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // contextIsolation: false,
        },
    })
    // macOS 特有样式：隐藏原生标题栏
    if (process.platform === 'darwin') {
        win.setWindowButtonVisibility(false)
    }

    //加载页面：开发模式加载本地服务器，生产模式加载本地文件
    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // 页面加载完成后，发送消息给渲染进程
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    // 监听窗口最大化和恢复事件，通知渲染进程
    win.on('maximize', () => {
        win?.webContents.send('window-maximize-change', true)
    })

    win.on('unmaximize', () => {
        win?.webContents.send('window-maximize-change', false)
    })
}

// 当所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
        setMainWindow(null) // 同步更新 IPC 中的窗口引用
    }
})

// macOS 特有行为：点击 Dock 图标重新创建窗口
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        setMainWindow(win) // 同步更新 IPC 中的窗口引用
    }
})

// 设置应用名称与 ID（Windows 任务栏识别用）
app.setName('DotNote')
app.setAppUserModelId('DotNote')
// 应用启动完成时初始化窗口和监听
app.whenReady().then(() => {
    createWindow()

    // 设置主窗口实例供 IPC 使用
    setMainWindow(win)

    // 集中注册所有 IPC 处理器
    registerAllIpcHandlers()
})
