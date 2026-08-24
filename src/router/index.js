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
    path: '/workshops',
    name: 'workshops',
    component: () => import('../views/WorkshopsView.vue')
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
  // Team management moved into the admin panel (Team tab) so it sits behind the same
  // login as everything else. These paths were public and unauthenticated — redirect
  // rather than 404 so old bookmarks land somewhere useful.
  { path: '/team-members-form', redirect: '/admin' },
  { path: '/team-form', redirect: '/admin' },
  // Target of the unsubscribe link in every email. Kept out of nav; noindex so the
  // parameterised URLs never get crawled.
  {
    path: '/unsubscribe',
    name: 'unsubscribe',
    component: () => import('../views/UnsubscribeView.vue'),
    meta: { noindex: true }
  },
  // Admin panel — intentionally absent from nav and footer, and marked noindex below.
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { noindex: true, bareLayout: true }
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
router.afterEach((to) => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }

  // Keep admin out of search results. Added/removed per navigation so it never leaks
  // onto a public route.
  if (typeof document === 'undefined') return
  const existing = document.querySelector('meta[name="robots"]')
  if (to.meta?.noindex) {
    if (existing) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
  } else if (existing) {
    existing.remove()
  }
})

export default router