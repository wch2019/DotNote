/**
 * 路由配置
 *
 * @description
 * 路由 meta 字段说明：
 * - title: 页面标题，用于菜单显示
 * - icon: 图标名称，需要在 routes-to-menu.ts 中注册
 * - showInMenu: 是否在左侧菜单中显示（默认 true）
 * - showMiddlePanel: 是否显示中间面板（默认 false）
 * - middlePanelComponent: 中间面板组件名称，需要在 middle-panel/index.ts 中注册
 */

import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Notes',
        component: () => import('@/views/notes/index.vue'),
        meta: {
            title: '全部笔记',
            icon: 'Writing',
            showInMenu: true,
            showMiddlePanel: true,
            middlePanelComponent: 'NoteListPanel',
        },
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        meta: {
            title: '应用设置',
            icon: 'SettingsOutline',
            showInMenu: false,
            showMiddlePanel: false,
        },
    },
    // {
    //     path: '/search',
    //     name: 'Search',
    //     component: () => import('@/views/notes/index.vue'),
    //     meta: {
    //         title: '全局搜索',
    //         icon: 'SearchOutline',
    //         showInMenu: true,
    //         showMiddlePanel: true,
    //         middlePanelComponent: 'SearchPanel',
    //     },
    // },
    // {
    //     path: '/trash',
    //     name: 'Trash',
    //     component: () => import('@/views/notes/index.vue'),
    //     meta: {
    //         title: '垃圾桶',
    //         icon: 'TrashOutline',
    //         showInMenu: true,
    //         showMiddlePanel: true,
    //         middlePanelComponent: 'TrashPanel',
    //     },
    // },
    // {
    //     path: '/file',
    //     name: 'File',
    //     component: () => import('@/views/notes/index.vue'),
    //     meta: {
    //         title: '文件',
    //         icon: 'FileTrayOutline',
    //         showInMenu: true,
    //         showMiddlePanel: true,
    //         middlePanelComponent: 'FilePanel',
    //     },
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.afterEach((to) => {
    // 只有在路由有明确名称或路径时保存，避免保存错误的临时状态
    if (to.path) {
        window.electronAPI.saveRoute(to.path)
    }
})

export default router
