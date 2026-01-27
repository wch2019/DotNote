<template>
  <div class="contact-page">
    <div class="contact-card">
      <div class="contact-header">
        <n-gradient-text type="warning" :size="28" font-weight="bold">
          交流与支持
        </n-gradient-text>
        <p class="description">如果你觉得 DotNote 很有帮助，欢迎通过以下方式与我交流或请我喝杯咖啡 ☕</p>
      </div>

      <div class="contact-content">
        <div class="contact-methods">
          <div class="method-item">
            <n-avatar
                round
                :size="64"
                src="src/assets/readme/wechat-avatar.jpg"
            />
            <div class="method-info">
              <span class="label">开发者微信号</span>
              <span class="value">XHDotcode</span>
              <n-button quaternary type="primary" size="tiny" @click="copyWeChat">点击复制</n-button>
            </div>
          </div>
        </div>

        <n-divider title-placement="center">打赏支持</n-divider>

        <div class="donation-area">
          <n-tabs type="segment" animated class="donation-tabs">
            <n-tab-pane name="wechat" tab="微信支付">
              <div class="qr-container">
                <img src="/src/assets/readme/wechat-pay.jpg" alt="微信收款码" class="qr-code">
                <p class="qr-tip">感谢你的慷慨解囊！</p>
              </div>
            </n-tab-pane>
            <n-tab-pane name="alipay" tab="支付宝">
              <div class="qr-container">
                <img src="/src/assets/readme/alipay-pay.jpg" alt="支付宝收款码" class="qr-code">
                <p class="qr-tip">用支付宝扫描二维码</p>
              </div>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'

const message = useMessage()

function copyWeChat() {
  navigator.clipboard.writeText('XHDotcode')
  message.success('微信号已复制到剪贴板')
}
</script>

<style scoped>
.contact-page {
  margin: 17px auto;
  height: calc(100vh - 172px);
  overflow-y: auto;
  padding: 16px 0;
}

.contact-card {
  max-width: 600px;
  width: 100%;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
}

.contact-header .description {
  margin-top: 12px;
  color: var(--n-text-color);
  font-size: 14px;
}

.contact-content {
  margin-top: 32px;
}

.contact-methods {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.method-item:hover {
  transform: translateY(-2px);
}

.method-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.method-info .label {
  font-size: 12px;
  color: var(--n-text-color);
}

.method-info .value {
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0;
}

.donation-area {
  margin-top: 20px;
}

.donation-tabs {
  max-width: 320px;
  margin: 0 auto;
}

.qr-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  border: 4px solid var(--n-border-color);
  padding: 8px;
}

.qr-tip {
  margin-top: 12px;
  font-size: 13px;
  color: var(--n-text-color);
}
</style>
