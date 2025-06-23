import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import MultipleDatePicker from '../src/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(MultipleDatePicker)

app.mount('#app')