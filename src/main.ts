import {createApp} from 'vue'
import '@/style/style.css'
import '@/style/tailwind.css';
import App from './App.vue'
import {createPinia} from 'pinia'
import router from '@/router/index'
import naive from 'naive-ui'
import '@/utils/ipc'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(naive)

app.mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
