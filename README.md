# DotNote

<p align=center>
  <a href="https://github.com/wch2019">
    <img src="src/assets/dotCode.png" alt="DotCode" style="width:50px">
  </a>
</p>

**DotNote** 是一款基于 Electron 和 Vue 3 构建的现代化、轻量级 Markdown 笔记应用，旨在提供一个简洁、高效且美观的本地笔记体验，灵感来源于 Typora。

## ✨ 核心功能

- **即时渲染 Markdown**：采用 Vditor 编辑器，提供所见即所得的流畅编辑体验。
- **文件树管理**：以文件树的形式直观地组织和管理您的 `.md` 文件和文件夹。
- **多主题支持**：内置亮色、暗色和跟随系统三种主题模式，并可轻松切换。
- **响应式布局**：无论是宽屏还是窄屏，都能提供舒适的阅读和编辑体验。
- **本地优先**：所有文件均存储在本地，确保您的数据安全和隐私。
- **快捷键支持**：支持 `Ctrl/Cmd + S` 保存等常用快捷键，提升效率。
- **自动保存**：在您停止输入后，笔记内容会自动保存，无需担心数据丢失。

## 🛠️ 技术栈

- **桌面端框架**: [Electron](https://www.electronjs.org/)
- **前端框架**: [Vue 3](https://vuejs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [Naive UI](https://www.naiveui.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **Markdown 编辑器**: [Vditor](https://b3log.org/vditor/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 本地开发

如果您想在本地运行或参与开发，请遵循以下步骤：

**1. 克隆仓库**

```bash
git clone https://github.com/wch2019/DotNote.git
cd DotNote
```

**2. 安装依赖**

推荐使用 `pnpm` 或 `npm` 进行安装。

```bash
npm install
```

**3. 运行开发环境**

此命令会同时启动 Vite 开发服务器和 Electron 应用。

```bash
npm run dev
```

**4. 构建应用**

此命令会将您的应用打包为可执行文件（例如 `.exe` 或 `.dmg`）。

```bash
npm run build
```

打包后的文件将位于 `dist` 目录下。

## 📸 项目截图

---
