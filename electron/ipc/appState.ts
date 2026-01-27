import { ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store()

export function registerAppStateHandler() {
    // 获取上次存储的路由路径
    ipcMain.handle('get-last-route', async () => {
        // 默认为 '/' 首页
        return store.get('last-route-path', '/')
    })

    // 保存当前的路由路径
    ipcMain.on('save-route', (_event, path: string) => {
        store.set('last-route-path', path)
    })
}
