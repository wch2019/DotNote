<template>
  <div :id="id" class="vditor-container" :style="{ minHeight: height + 'px' }"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: 'vditor' },
  placeholder: { type: String, default: '请输入内容...' },
  height: { type: [Number, String], default: 360},
  options: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'after']);
const vditor = ref(null);

const setMode = (mode) => {
  if (vditor.value) {
    vditor.value.setMode(mode);
  }
};
onMounted( () => {
  vditor.value = new Vditor(props.id, {
    lang: 'zh_CN',
    placeholder: props.placeholder,
    mode: 'ir',
    toolbarConfig: {
      // 是否隐藏工具栏
      hide: false,
      // 是否固定工具栏
      pin: true,
    },
    icon: 'material',
    value: props.modelValue,
    // --- 高度自适应核心配置 ---
    height: props.height,
    minHeight: props.height,
    // 如果你想让编辑器随内容自动长高，取消下面这行的注释
    // autoHeight: true,

    input: (value) => {
      emit('update:modelValue', value);
    },
    after: () => {
      emit('after', vditor.value);
    },
    ...props.options,
    cache: { enable: false },
  });
});

// 监听高度变化：当父组件修改 height 属性时，同步调整编辑器
watch(() => props.height, (newHeight) => {
  if (vditor.value) {
    // Vditor 动态调整大小的方法
    vditor.value.resize(undefined, newHeight);
  }
});

// 监听内容变化（外部手动修改 modelValue）
watch(() => props.modelValue, (newValue) => {
  if (vditor.value && newValue !== vditor.value.getValue()) {
    vditor.value.setValue(newValue);
  }
});
watch(() => props.modelValue, (newVal) => {
  console.log('编辑器收到新数据:', newVal.length, '字');
})

onBeforeUnmount(() => {
  if (vditor.value) {
    // 显式销毁，Vditor 会清空 DOM 并释放内存
    vditor.value.destroy?.();
    vditor.value = null;
  }
});
defineExpose({
  setMode
});

</script>

<style scoped>
.vditor-container {
  width: 100%;
  /* 确保在加载出编辑器前，页面不会因高度塌陷而闪烁 */
  box-sizing: border-box;
}

/* 移除 Vditor 的外边框 */
.vditor {
  border: none;
}
:deep(.vditor-toolbar) {
  border: none;
}

/* 响应式工具栏：在小屏幕上实现单行滚动 */
:deep(.vditor-toolbar) {
  padding: 0 30px !important;
  //display: flex;
  //flex-wrap: nowrap !important;
  //overflow-x: auto !important;
  //overflow-y: hidden !important;
}
@media (max-width: 1000px) {
}
</style>
