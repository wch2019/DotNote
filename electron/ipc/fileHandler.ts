import {ipcMain,shell} from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'

interface TreeNode {
    label: string;
    key: string;
    isDirectory: boolean;
    children?: TreeNode[];
}

export function registerFileHandler() {
    // 读取文件树
    ipcMain.handle('read-file-tree', async (_event, dataDir: string) => {
        const getTree = async (currentPath: string): Promise<TreeNode[]> => {
            try {
                const files = await fs.readdir(currentPath);

                const nodes = await Promise.all(
                    files
                        .filter(file => !file.startsWith('.')) // 过滤掉以点开头的文件和文件夹
                        .map(async (file) => {
                            try {
                                const fullPath = path.join(currentPath, file);
                                const stats = await fs.stat(fullPath);
                                const isDirectory = stats.isDirectory();

                                if (isDirectory) {
                                    return {
                                        label: file,
                                        key: fullPath,
                                        isDirectory: true,
                                        children: await getTree(fullPath)
                                    };
                                } else if (file.endsWith('.md')) {
                                    return {
                                        label: file.replace('.md', ''),
                                        key: fullPath,
                                        isDirectory: false
                                    };
                                }
                                return null;
                            } catch (error) {
                                console.warn(`无法访问路径: ${path.join(currentPath, file)}`, error);
                                return null;
                            }
                        })
                );

                // 过滤空值并排序（文件夹优先）
                return nodes
                    .filter((node): node is TreeNode => node !== null)
                    .sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory));
            } catch (error) {
                console.error(`读取目录失败: ${currentPath}`, error);
                return [];
            }
        };

        try {
            return await getTree(dataDir);
        } catch (e) {
            console.error('读取文件树失败', e);
            return [];
        }
    });

    ipcMain.handle('read-notes-list', async (_event, dataDir: string) => {
        try {
            const files = await fs.readdir(dataDir)
            const notes = await Promise.all(
                files
                    .filter(file => file.endsWith('.md') && !file.startsWith('.')) // 同样过滤
                    .map(async file => {
                        const stats = await fs.stat(path.join(dataDir, file))
                        return {
                            title: file.replace('.md', ''),
                            path: path.join(dataDir, file),
                            lastModified: stats.mtimeMs,
                            size: stats.size
                        }
                    })
            )
            // 按最后修改时间排序
            return notes.sort((a, b) => b.lastModified - a.lastModified)
        } catch (e) {
            console.error('读取笔记列表失败', e)
            return []
        }
    })

    // 读取文件内容
    ipcMain.handle('read-file', async (_event, filePath: string) => {
        return await fs.readFile(filePath, 'utf-8')
    })
    // 写入文件内容
    ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
        try {
            await fs.writeFile(filePath, content, 'utf-8')
            return {success: true}
        } catch (e) {
            return {success: false, error: e}
        }
    })

    // 新建文件/文件夹
    ipcMain.handle('create-item', async (_, parentPath: string, name: string, isDirectory: boolean) => {
        const targetPath = path.join(parentPath, isDirectory ? name : `${name}.md`)
        if (isDirectory) {
            await fs.mkdir(targetPath, {recursive: true})
        } else {
            await fs.writeFile(targetPath, '', 'utf-8')
        }
        return targetPath
    })

    // 重命名
    ipcMain.handle('rename-item', async (_, oldPath: string, newName: string) => {
        const dir = path.dirname(oldPath)
        const isDirectory = (await fs.stat(oldPath)).isDirectory()
        const newPath = path.join(dir, isDirectory ? newName : `${newName}.md`)
        await fs.rename(oldPath, newPath)
        return newPath
    })

    // 删除（移动到废纸篓，更安全）
    ipcMain.handle('delete-item', async (_, targetPath: string) => {
        await shell.trashItem(targetPath)
        return true
    })

    // 在资源管理器中显示
    ipcMain.handle('show-in-folder', async (_, targetPath: string) => {
        shell.showItemInFolder(targetPath)
    })

    // 获取文件/文件夹属性
    ipcMain.handle('get-item-properties', async (_, filePath: string) => {
        try {
            const stats = await fs.stat(filePath);
            const parsedPath = path.parse(filePath);
            return {
                name: parsedPath.base,
                location: parsedPath.dir,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                isDirectory: stats.isDirectory(),
                ext: parsedPath.ext,
            };
        } catch (error) {
            console.error(`获取属性失败: ${filePath}`, error);
            return null;
        }
    });

    // 获取父目录路径
    ipcMain.handle('get-dirname', async (_, filePath: string) => {
        return path.dirname(filePath);
    });
}
