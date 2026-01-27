# 🖥️ DotNote

一个基于 **Electron + Vue 3 + Naive UI + TailwindCSS** 的现代化桌面应用基础框架。

## ✨ 特性

- 🎨 **现代化 UI 设计**：三段式布局（左侧菜单、中间面板、右侧内容）
- 🎯 **灵活的中间面板系统**：根据路由动态加载不同的中间面板组件
- 🌓 **主题系统**：支持亮色 / 暗色 / 跟随系统，带持久化配置
- 🔌 **完善的 IPC 通信**：封装好的主进程与渲染进程通信机制
- 📦 **开箱即用**：已配置好路由、状态管理、构建工具等
- 🛠️ **TypeScript 支持**：完整的类型定义，开发体验更佳

## 🧰 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Electron | ^30.0.1 | 桌面应用容器 |
| Vue | ^3.4.21 | 前端框架 |
| Vite | ^5.1.6 | 构建工具 |
| Naive UI | ^2.42.0 | UI 组件库 |
| TailwindCSS | ^4.1.11 | 样式系统 |
| Pinia | ^3.0.3 | 状态管理 |
| TypeScript | ^5.2.2 | 类型系统 |

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发模式

```bash
npm run dev
```

### 3. 打包构建

```bash
npm run build
```

## 🏗️ 项目结构

```
DotNote/
├── src/                          # 前端源代码
│   ├── components/               # 公共组件
│   │   ├── AppMenu.vue           # 左侧菜单组件
│   │   ├── FilePicker.vue        # 文件选择器组件
│   │   └── middle-panel/         # 中间面板组件
│   │       ├── DefaultPanel.vue  # 默认中间面板
│   │       ├── FilePanel.vue     # 文件列表中间面板示例
│   │       └── index.ts          # 中间面板组件管理
│   ├── views/                    # 页面视图
│   │   ├── home/                 # 首页
│   │   └── setting/              # 设置页
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义
│   ├── stores/                   # 状态管理（Pinia）
│   │   └── theme.ts              # 主题状态管理
│   ├── types/                    # 类型定义
│   │   └── defaultConfig.ts      # 应用配置类型
│   ├── utils/                    # 工具函数
│   │   └── routes-to-menu.ts     # 路由转菜单工具
│   ├── style/                    # 样式文件
│   │   ├── style.css             # 全局样式
│   │   └── tailwind.css          # Tailwind 样式
│   ├── App.vue                   # 根组件（布局）
│   ├── main.ts                   # 入口文件
│   └── vite-env.d.ts             # 类型声明
├── electron/                     # Electron 主进程
│   ├── ipc/                      # IPC 通信处理
│   │   ├── index.ts              # IPC 注册入口
│   │   ├── setting.ts            # 设置相关 IPC
│   │   └── fileDialog.ts         # 文件对话框 IPC
│   ├── log/                      # 日志相关
│   ├── main.ts                   # Electron 主进程入口
│   └── preload.ts                # 预加载脚本
├── public/                       # 静态资源
├── dist-electron/                # Electron 构建输出
├── dist/                         # 前端构建输出
├── release/                      # 打包输出目录
├── package.json
├── vite.config.ts                # Vite 配置
├── electron-builder.json5        # Electron 打包配置
└── README.md
```

## 🎯 核心功能说明

### 1. 三段式布局

应用采用三段式布局设计：

- **左侧菜单栏**（60px）：仅显示图标的垂直菜单，底部固定设置按钮
- **中间面板**（240px）：可选的中间区域，根据路由动态显示不同内容
- **右侧内容区**：主要的内容展示区域，通过路由切换

### 2. 中间面板系统

中间面板是一个灵活的组件系统，可以根据不同路由显示不同的内容。

#### 使用方式

1. **创建中间面板组件**

在 `src/components/middle-panel/` 目录下创建新组件：

```vue
<template>
  <div class="middle-panel-container">
    <!-- 你的自定义内容 -->
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>
```

2. **注册组件**

在 `src/components/middle-panel/index.ts` 中注册：

```typescript
import YourPanel from './YourPanel.vue'

export const middlePanelComponents: Record<string, Component> = {
  DefaultPanel,
  FilePanel,
  YourPanel, // 添加新组件
}
```

3. **在路由中使用**

在路由配置中指定中间面板组件：

```
{
  path: '/your-route',
  name: 'YourRoute',
  component: () => import('@/views/your-view/index.vue'),
  meta: {
    title: '你的页面',
    icon: 'YourIcon',
    showInMenu: true,
    showMiddlePanel: true,              // 显示中间区域
    middlePanelComponent: 'YourPanel',  // 指定使用的组件
  },
}
```

### 3. 路由配置

路由配置支持以下 meta 字段：

- `title`: 页面标题（用于菜单显示）
- `icon`: 图标名称（需要在 `routes-to-menu.ts` 中注册）
- `showInMenu`: 是否在左侧菜单中显示
- `showMiddlePanel`: 是否显示中间面板
- `middlePanelComponent`: 中间面板组件名称

示例：

```
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/index.vue'),
  meta: {
    title: '示例页面',
    icon: 'ExampleOutline',
    showInMenu: true,
    showMiddlePanel: true,
    middlePanelComponent: 'ExamplePanel',
  },
}
```

### 4. IPC 通信

框架已封装好 IPC 通信机制，使用方式：

#### 主进程注册 IPC

在 `electron/ipc/` 目录下创建处理文件：

```typescript
// electron/ipc/yourHandler.ts
import { ipcMain } from 'electron'

export function registerYourHandler() {
  ipcMain.handle('your-api', async (event, ...args) => {
    // 处理逻辑
    return result
  })
}
```

在 `electron/ipc/index.ts` 中注册：

```typescript
import { registerYourHandler } from './yourHandler'

export function registerAllIpcHandlers() {
  // ... 其他注册
  registerYourHandler()
}
```

#### 预加载脚本暴露 API

在 `electron/preload.ts` 中暴露：

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... 其他 API
  yourApi: (...args) => ipcRenderer.invoke('your-api', ...args),
})
```

#### 渲染进程使用

在 Vue 组件中使用：

```typescript
const result = await window.electronAPI.yourApi(...args)
```

### 5. 主题系统

主题系统使用 Pinia 进行状态管理，支持：

- 亮色模式
- 暗色模式
- 跟随系统

主题配置会自动持久化到本地配置文件中。

使用方式：

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
themeStore.setTheme('dark') // 'light' | 'dark' | 'auto'
```

## 🧪 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建页面组件
2. 在 `src/router/index.ts` 中注册路由
3. 如需在菜单中显示，确保 `showInMenu: true` 并配置图标

### 添加新的中间面板

1. 在 `src/components/middle-panel/` 创建组件
2. 在 `src/components/middle-panel/index.ts` 中注册
3. 在路由 meta 中指定 `middlePanelComponent`

### 扩展 IPC 功能

1. 在 `electron/ipc/` 创建处理文件
2. 在 `electron/ipc/index.ts` 中注册
3. 在 `electron/preload.ts` 中暴露 API
4. 在 `src/vite-env.d.ts` 中添加类型定义

### 自定义窗口

窗口配置在 `electron/main.ts` 的 `createWindow` 函数中：

```typescript
win = new BrowserWindow({
  title: 'DotNote',
  frame: false,                // 无边框窗口
  titleBarStyle: 'hidden',     // macOS 样式
  minWidth: 830,
  minHeight: 640,
  // ... 其他配置
})
```

## 📝 配置说明

### 应用配置

应用配置存储在用户数据目录下的 `config.json` 文件中，默认数据目录为 `文档/DotNote`。

配置结构定义在 `src/types/defaultConfig.ts` 中。

### 构建配置

- **Vite 配置**：`vite.config.ts`
- **Electron 打包配置**：`electron-builder.json5`

## 🔧 常见问题

### Q: 如何修改窗口大小？

A: 在 `electron/main.ts` 的 `createWindow` 函数中修改 `width` 和 `height` 参数。

### Q: 如何添加新的图标？

A: 在 `src/utils/routes-to-menu.ts` 中的 `iconMap` 对象中添加图标映射。

### Q: 中间面板不显示？

A: 检查路由配置中 `showMiddlePanel` 是否为 `true`，以及 `middlePanelComponent` 是否正确注册。

### Q: IPC 调用失败？

A: 确保：
1. 在 `electron/ipc/index.ts` 中已注册处理函数
2. 在 `electron/preload.ts` 中已暴露 API
3. 在 `src/vite-env.d.ts` 中已添加类型定义

## 📄 许可证

MIT License © 2026

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---
