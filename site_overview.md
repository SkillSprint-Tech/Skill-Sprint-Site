# SkillSprint System & Architectural Overview

## 1. Core Identity & Institutional Positioning
SkillSprint is a student-driven, non-profit technical ecosystem focused on open-source engineering collaboration, peer mentorship, and zero-cost technical workshops. It strictly rejects any commercial EdTech, Learning Management System (LMS), marketplace, or monetized training models. 

The application is built using **Vue.js** and **Tailwind CSS**. The structural mission of this rebuild is to strip out commercial template bloat while expanding proof-of-work pages that validate the community's active presence, without modifying the existing Homepage or Contact page configurations.

---

## 2. Global Route Audit & Disposition Matrix

To transform the site from a generic SaaS/course template into a high-signal community ledger, routes must be audited according to the following strict disposition rules:

| Route Path | Template Target | Action | Technical Justification |
| :--- | :--- | :--- | :--- |
| `/` | Homepage | **UNTOUCHED** | Retain original landing code, layouts, and style anchors completely. |
| `/contact` | Contact Page | **UNTOUCHED** | Retain original form processing logic and messaging layouts. |
| `/courses` | Course Catalog | **DELETE** | Eliminates commercial positioning; SkillSprint does not host structured, paid educational tracks. |
| `/pricing` | Pricing Tiers | **DELETE** | Zero-fee non-profit entities require no commercial financial matrices. |
| `/features` | Platform Features | **DELETE** | Removes SaaS boilerplate describing software features rather than human initiatives. |
| `/about` | Company Background | **OVERHAUL** | Transition from corporate boilerplate to a deep `/team` roster and community roadmap ledger. |
| `/initiatives` | None (New Route) | **CREATE** | Establishes a dedicated repository and workshop showcase to serve as the community's social proof engine. |

---

## 3. Vue Router Configuration Schema (`/src/router/index.js`)

The secondary architecture relies on a flat, clean navigation hierarchy. Below is the explicit configuration state for the updated Vue Router setup, ensuring lazy-loading for heavy data-driven views:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ContactView from '../views/ContactView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { KeepUntouched: true }
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: { KeepUntouched: true }
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/TeamView.vue'),
    meta: { requiresDataFetch: true }
  },
  {
    path: '/initiatives',
    name: 'initiatives',
    component: () => import('../views/InitiativesView.vue'),
    meta: { requiresDataFetch: true }
  },
  // Catch-all wildcards to prevent dead links from removed commercial pages
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

export default router;

4. State Management & Component Data Ingestion Flow
To maintain modularity and avoid polluting Vue components with unorganized copy strings, data states for the new and overhauled pages must flow systematically:

                  [ context.md Raw Static Datasets ]
                                 │
                                 ▼
                     [ /src/data/store.js ]
                     (Reactive State Module)
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [ InitiativesView.vue ]                     [ TeamView.vue ]
  Loops over dynamic arrays                   Maps core profiles
  via <InitiativeCard/>                      via <TeamMemberCard/>
Reactive Filtering: The /initiatives route utilizes inline reactive state switches (const activeFilter = ref('all')) to sort objects by taxonomy (Engineering, Education) or lifecycles (Active, Completed) instantly without hitting external database instances.

Fail-safe Destructuring: Component props must declare strict type definitions and structural defaults to guard against hydration errors during asynchronous template rendering blocks.