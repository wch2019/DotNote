import {registerFileDialogHandler} from './fileDialog'
import {registerSettingHandler} from './setting'
import {registerWindowHandler} from './window'
import {registerAppStateHandler} from "./appState.ts";
import {registerFileHandler} from "./fileHandler.ts";

/**
 * 注册所有 IPC 处理器
 *
 * 统一管理所有 IPC 通信的注册，保持代码整洁
 */
export function registerAllIpcHandlers() {
    // 注册窗口控制相关 IPC
    registerWindowHandler()
    // 注册文件选择相关 IPC
    registerFileDialogHandler()
    // 注册设置相关 IPC
    registerSettingHandler()
    // 注册应用状态相关 IPC
    registerAppStateHandler()
    // 注册文件处理相关 IPC
    registerFileHandler()
}
