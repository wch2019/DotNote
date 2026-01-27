<template>
  <div class="about-settings">
    <div class="about-card">
      <img src="/src/assets/dotCode.png" alt="DotNote Logo" class="app-logo">
      <n-gradient-text type="info" :size="32" class="app-title">
        DotNote
      </n-gradient-text>
      <p class="app-tagline">
        用 Electron 驱动的强大工具，让桌面应用开发更简单。
      </p>


      <div class="info-item">
        <n-icon>
          <CodeWorking/>
        </n-icon>
        <span>版本</span>
        <n-tag type="success" round size="small">
          v1.0.0
        </n-tag>
        <n-icon>
          <Planet/>
        </n-icon>
        <span>发布日期</span>
        <n-tag type="info" round size="small">
          2026-01-23
        </n-tag>
        <n-icon>
          <LogoGithub/>
        </n-icon>
        <span>源码地址</span>
        <n-button text tag="a" href="https://github.com/wch2019/DotNote" target="_blank" type="primary">
          GitHub 仓库
          <template #icon>
            <n-icon>
              <ArrowForwardOutline/>
            </n-icon>
          </template>
        </n-button>
      </div>


      <n-divider/>

      <p class="copyright">
        &copy; 2026 DotNote Team. All Rights Reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {NGradientText, NDivider, NTag, NButton, NIcon} from 'naive-ui';
import {CodeWorking, Planet, LogoGithub, ArrowForwardOutline} from '@vicons/ionicons5';
</script>

<style scoped>
.about-settings {
  margin: 17px auto;
  display: flex;
  flex-direction: column;
  /* 关键：水平垂直双向居中 */
  justify-content: center;
  align-items: center;
  height: calc(100vh - 172px);
  overflow-y: auto;
  padding: 16px 0;
  box-sizing: border-box;
}

.about-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.app-logo {
  width: 90px;
  height: 90px;
  margin: 0 auto 16px;
  display: block;
  border-radius: 20px; /* 轻微圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin-bottom: 20px;
  font-weight: bold;
}

.app-tagline {
  color: var(--n-text-color);
  margin-bottom: 40px;
  font-size: 15px;
  line-height: 1.6;
}

.n-divider {
  margin: 30px 0;
  width: 80%; /* 让分割线居中且不沾满 */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--n-text-color);
  width: 100%;
  justify-content: center; /* 居中显示 */
  margin-bottom: 20px;
}

.link-item .n-button {
  margin-left: 8px;
}

.copyright, .made-with {
  font-size: 13px;
  color: var(--n-text-color);
  line-height: 1.5;
}

</style>
