import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useOsTheme, darkTheme } from 'naive-ui'
import { useConfigStore } from './config'

export const useThemeStore = defineStore('theme', () => {
    const osTheme = useOsTheme()
    const configStore = useConfigStore()

    // 从 configStore 初始化主题，并建立响应式链接
    const userTheme = ref<'light' | 'dark' | 'auto'>(configStore.theme)
    watch(() => configStore.theme, (newTheme) => {
        if (userTheme.value !== newTheme) {
            userTheme.value = newTheme
        }
    })

    // 侧边栏折叠状态
    const isMiddlePanelCollapsed = ref(false)

    // 当前是否暗色模式（计算得出）
    const isDark = computed(() => {
        if (userTheme.value === 'auto') return osTheme.value === 'dark'
        return userTheme.value === 'dark'
    })

    // naive-ui 的主题
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

    // 设置主题并同步保存到 configStore
    async function setTheme(value: 'light' | 'dark' | 'auto') {
        // 更新 configStore，它会负责持久化并触发状态更新
        await configStore.saveConfig({ ...configStore.$state, theme: value })
    }

    // 切换侧边栏折叠状态
    function toggleMiddlePanel() {
        isMiddlePanelCollapsed.value = !isMiddlePanelCollapsed.value
    }

    // 更新 DOM 类（适配 Tailwind / 自定义样式）
    watch(isDark, (val) => {
        document.documentElement.classList.toggle('dark', val)
    }, { immediate: true })

    return {
        userTheme,
        isDark,
        naiveTheme,
        isMiddlePanelCollapsed,
        setTheme,
        toggleMiddlePanel,
    }
})
