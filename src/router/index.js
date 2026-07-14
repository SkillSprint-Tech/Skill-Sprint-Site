import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutUs from '../components/AboutUs.vue'
import ContactUs from '../components/ContactUs.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/AboutUs', component: AboutUs },
  { path: '/contact-us', component: ContactUs }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router