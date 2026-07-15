import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutUs from '../components/AboutUs.vue'
import ContactUs from '../components/ContactUs.vue'
import Community from '../views/Community.vue'
import Sprints from '../views/Sprints.vue'
import Team from '../views/Team.vue'
import TeamForm from '../views/TeamForm.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/AboutUs', component: AboutUs },
  { path: '/contact-us', component: ContactUs },
  { path: '/community', component: Community },
  { path: '/sprints', component: Sprints },
  { path: '/team', component: Team },
  { path: '/team-members-form', component: TeamForm },
  { path: '/team-form', component: TeamForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router