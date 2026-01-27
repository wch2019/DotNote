/**
 * 中间面板组件管理系统
 *
 * 用于管理不同路由对应的中间面板组件
 * 通过路由 meta.middlePanelComponent 指定使用的组件
 */

import type { Component } from 'vue'
import DefaultPanel from './DefaultPanel.vue'
import FilePanel from './FilePanel.vue'
import NoteListPanel from "./notes/NoteListPanel.vue";

/**
 * 中间面板组件映射表
 * 新增中间面板组件时，需要在此注册
 */
export const middlePanelComponents: Record<string, Component> = {
  DefaultPanel,
  FilePanel,
  NoteListPanel
}

/**
 * 根据组件名称获取中间面板组件
 * @param name 组件名称，对应 middlePanelComponents 中的 key
 * @returns 对应的组件，如果未找到则返回默认组件
 */
export function getMiddlePanelComponent(name?: string): Component {
  if (!name) {
    return DefaultPanel
  }
  return middlePanelComponents[name] || DefaultPanel
}

/**
 * 注册新的中间面板组件
 * @param name 组件名称
 * @param component 组件实例
 */
export function registerMiddlePanelComponent(name: string, component: Component): void {
  middlePanelComponents[name] = component
}

export { DefaultPanel, FilePanel }
