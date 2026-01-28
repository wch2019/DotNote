/**
 * 路由转菜单选项工具
 *
 * 将路由配置转换为 Naive UI Menu 组件所需的菜单选项
 */

import {RouteRecordRaw} from 'vue-router'
import {MenuOption} from 'naive-ui'
import {h} from "vue"
import {
    HomeOutline,
    SettingsOutline,
    FileTrayOutline,
    DocumentTextOutline,
    SearchOutline,
    TrashOutline
} from '@vicons/ionicons5'
import {Writing} from "@vicons/tabler";

/**
 * 图标映射表
 * 新增图标时，需要在此注册
 */
const iconMap: Record<string, any> = {
    HomeOutline,
    SettingsOutline,
    FileTrayOutline,
    DocumentTextOutline,
    SearchOutline,
    TrashOutline,
    Writing
}

/**
 * 将路由配置转换为菜单选项
 * @param routes 路由配置数组
 * @returns 菜单选项数组
 */
export function routesToMenuOptions(routes: RouteRecordRaw[]): MenuOption[] {
    return routes
        .filter(route => route.meta?.showInMenu !== false) // 过滤掉不显示在菜单中的路由
        .map(route => {
            const iconName = route.meta?.icon as string
            const IconComponent = iconMap[iconName]

            return {
                label: route.meta?.title as string,
                key: route.name as string,
                icon: IconComponent ? () => h(IconComponent) : undefined
            }
        })
}

