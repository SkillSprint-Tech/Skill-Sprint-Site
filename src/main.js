import { createApp } from 'vue'
import './style.css'   // ✅ Import Tailwind here
import App from './App.vue'
import router from './router'
import { vMagnetic } from './motion/magnetic'

const app = createApp(App)
app.directive('magnetic', vMagnetic)
app.use(router)
app.mount('#app')