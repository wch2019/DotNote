/**
 * 文件对话框相关 IPC 处理
 * 
 * 处理文件选择对话框的打开和路径返回
 */

import { ipcMain, dialog } from 'electron'

/**
 * 注册文件对话框相关的 IPC 处理器
 */
export function registerFileDialogHandler() {
    ipcMain.handle('dialog:selectPath', async (_event, options: { type: 'file' | 'directory' }) => {
        const properties: ('openFile' | 'openDirectory')[] =
            options.type === 'directory' ? ['openDirectory'] : ['openFile']

        const result = await dialog.showOpenDialog({
            title: options.type === 'directory' ? '选择文件夹' : '选择文件',
            properties
        })

        if (result.canceled || result.filePaths.length === 0) return null
        return result.filePaths[0]
    })
}
