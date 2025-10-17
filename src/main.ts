import App from '@/App.vue'
import router from '@/router'
import '@/style.css'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
    ripple: true,
    unstyled: true
})
app.mount('#app')