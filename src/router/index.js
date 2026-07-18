import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ContactUs from '../components/ContactUs.vue'

// Prevent native browser scroll restoration behavior
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { KeepUntouched: true }
  },
  {
    path: '/contact-us',
    name: 'contact',
    component: ContactUs,
    meta: { KeepUntouched: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/initiatives',
    name: 'initiatives',
    component: () => import('../views/InitiativesView.vue')
  },
  {
    path: '/sprints',
    name: 'sprints',
    component: () => import('../views/SprintsView.vue')
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('../views/CommunityView.vue')
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/TeamView.vue')
  },
  {
    path: '/mission',
    name: 'mission',
    component: () => import('../views/MissionView.vue')
  },
  {
    path: '/team-members-form',
    name: 'team-members-form',
    component: () => import('../views/TeamForm.vue')
  },
  {
    path: '/team-form',
    name: 'team-form',
    component: () => import('../views/TeamForm.vue')
  },
  // Catch-all redirect
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

// Force manual scroll reset immediately on completion of route transitions
router.afterEach(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }
})

export default router