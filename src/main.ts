import App from '@/App.vue'
import router from '@/router'
import '@/style.css'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

// Initialize app (no client-side schema obfuscation; schemas are saved to localStorage)
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    ripple: true,
    unstyled: true
})
app.mount('#app')