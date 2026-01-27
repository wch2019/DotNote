/**
 * 窗口控制相关 IPC 处理
 * 
 * 处理窗口的最小化、最大化、关闭等操作
 */

import { ipcMain, BrowserWindow } from 'electron'

/**
 * 获取主窗口实例
 * 注意：需要在 main.ts 中设置全局变量或通过其他方式获取
 */
let mainWindow: BrowserWindow | null = null

/**
 * 设置主窗口实例
 * @param window 主窗口实例
 */
export function setMainWindow(window: BrowserWindow | null): void {
    mainWindow = window
}

/**
 * 注册窗口控制相关的 IPC 处理器
 */
export function registerWindowHandler(): void {
    // 最小化窗口
    ipcMain.on('window-minimize', () => {
        mainWindow?.minimize()
    })

    // 最大化/还原窗口
    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow?.maximize()
        }
    })

    // 关闭窗口
    ipcMain.on('window-close', () => {
        mainWindow?.close()
    })
}
