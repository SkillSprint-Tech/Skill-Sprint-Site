# SkillSprint Frontend Design System Specification

## 1. Style Anchor & Architectural Rules
The visual DNA of the untouched Homepage dictates the exact styling rules for all secondary views. Do not invent new design tokens. The secondary layouts expand upon the primary layout by using a clean, minimalist developer-centric aesthetic: high typographic legibility, sharp structural lines, high-contrast states, and no graphic filler.

---

## 2. Core Style Tokens (Tailwind CSS Mappings)

### Color Tokens
- **Surface Layout Backgrounds:** Clean, high-contrast layouts. (Dark Mode: Deep Slate `#0B0F19` / Tailwind `bg-slate-950` with card overlays at `bg-slate-900`; Light Mode: Pure White `#FFFFFF` with overlays at `bg-gray-50`).
- **Brand Accent Foundations:** Rely entirely on the single primary highlight color established on your homepage (e.g., Electric Teal `text-teal-500` or Cobalt `text-indigo-600`) purely for focus borders, live badges, and interactive anchor text.
- **Typography Tone Spectrum:**
  - Headings / Core Labels: High-contrast (Tailwind `text-slate-900` or `text-white`).
  - Body Copy / Explanations: Balanced readability (Tailwind `text-slate-600` or `text-slate-400`).
  - Metadata / Microcopy: Subdued visibility (Tailwind `text-slate-400` or `text-slate-500`).

### Typography Pairings
- **Interface / Content Elements:** Sans-Serif stack (Tailwind `font-sans`, optimizing for `Inter`, `System-UI`).
- **Data Attributes / Tags / Badges:** Monospace stack (Tailwind `font-mono`, optimizing for `JetBrains Mono` or `Fira Code`) to highlight the technical focus of the community.

---

## 3. Vue.js Reusable Atomic Component Blueprints

All secondary layouts must be built out using these highly structured, atomic Vue components rather than hardcoded raw HTML duplicate elements.

### A. `StatusBadge.vue`
A functional badge that changes styling dynamically based on project lifecycle variables.
```vue
<template>
  <span 
    class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border"
    :class="statusClasses"
  >
    <span v-if="status === 'Active'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['Active', 'Completed'].includes(value)
  }
});

const statusClasses = computed(() => {
  return props.status === 'Active'
    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
});
</script>
B. InitiativeCard.vue
The structural display block used to build out the grid system inside the /initiatives route.

Code snippet
<template>
  <div class="group relative flex flex-col justify-between p-6 bg-slate-900/40 border border-slate-800 rounded-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900">
    <div>
      <div class="flex items-center justify-between mb-4">
        <span class="font-mono text-xs text-indigo-400 uppercase tracking-wider">{{ tag }}</span>
        <StatusBadge :status="status"/>
      </div>
      <h3 class="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors duration-200">
        {{ title }}
      </h3>
      <p class="text-slate-400 text-sm leading-relaxed mb-6">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-2 mt-auto pt-4 border-t border-slate-800/60 font-mono text-xs text-slate-500">
      <span v-for="tech in techStack" :key="tech" class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
        {{ tech }}
      </span>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  status: { type: String, required: true },
  techStack: { type: Array, default: () => [] }
});
</script>
4. UI Layout Conventions & Spacing Directives
Section Structural Boundaries: Enforce generous vertical padding rules across views (py-16 sm:py-24 md:py-32) to provide optimal whitespace structure. Avoid cramming disparate topics into single content sections.

Border-First Architecture: Do not use soft, fuzzy, or blurry multi-layered CSS drop-shadow boxes. Define structural depth using clean, precise boundary lines (border border-slate-800 or divide-y divide-slate-800).

Interactive States Consistency: Hover and focus behaviors must use immediate color-tint modifications or subtle border shade shifts (transition-colors duration-200). Avoid using jarring transformation animations or geometric scaling changes that disrupt content layouts.