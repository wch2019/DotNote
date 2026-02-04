import { defineStore } from 'pinia'
import { type AppConfig, defaultConfig } from '@/types/defaultConfig'
import { toRaw } from 'vue'

export const useConfigStore = defineStore('config', {
  state: (): AppConfig => ({
    ...defaultConfig
  }),
  actions: {
    async loadConfig() {
      try {
        const config = await window.electronAPI.readConfig()
        this.$patch(config)
        return this.$state
      } catch (error) {
        console.error('Failed to load config:', error)
        return this.$state
      }
    },
    async saveConfig(newConfig: AppConfig) {
      try {
        await window.electronAPI.writeConfig(toRaw(newConfig))
        this.$patch(newConfig)
      } catch (error) {
        console.error('Failed to save config:', error)
      }
    },
    setConfig(config: AppConfig) {
      this.$patch(config)
    }
  }
})
