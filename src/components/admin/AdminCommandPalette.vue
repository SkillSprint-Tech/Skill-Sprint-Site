<template>
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh] animate-scale-in"
    >
      <!-- Search Input Header -->
      <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <svg class="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Type a command or search attendee (name, email)…"
          class="flex-1 bg-transparent border-0 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter.prevent="executeSelected"
          @keydown.esc="close"
        />
        <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-500 font-semibold">
          ESC
        </kbd>
      </div>

      <!-- Command List Body -->
      <div class="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[60vh]">
        <!-- Attendee Matches (if searching) -->
        <div v-if="filteredAttendees.length" class="pb-2">
          <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Matching Attendees ({{ filteredAttendees.length }})
          </div>
          <div class="space-y-0.5 mt-1">
            <button
              v-for="(att, idx) in filteredAttendees"
              :key="att.id"
              type="button"
              @click="selectAttendee(att)"
              class="w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer"
              :class="isSelected('att-' + att.id) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {{ initials(att.full_name) }}
                </span>
                <div class="truncate">
                  <span class="font-semibold truncate block">{{ att.full_name }}</span>
                  <span class="text-[11px] opacity-75 font-mono truncate block">{{ att.email }}</span>
                </div>
              </div>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold"
                :class="isSelected('att-' + att.id) ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
              >
                {{ (att.checkins || []).length }} workshops
              </span>
            </button>
          </div>
        </div>

        <!-- Quick Actions -->
        <div v-if="filteredActions.length" class="py-2">
          <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Quick Actions
          </div>
          <div class="space-y-0.5 mt-1">
            <button
              v-for="action in filteredActions"
              :key="action.id"
              type="button"
              @click="executeAction(action)"
              class="w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer"
              :class="isSelected('action-' + action.id) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-sm shrink-0">{{ action.icon }}</span>
                <span>{{ action.label }}</span>
              </div>
              <span v-if="action.hint" class="text-[10px] font-mono opacity-70">
                {{ action.hint }}
              </span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div v-if="filteredTabs.length" class="py-2">
          <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Navigation
          </div>
          <div class="space-y-0.5 mt-1">
            <button
              v-for="t in filteredTabs"
              :key="t.id"
              type="button"
              @click="switchTab(t.id)"
              class="w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer"
              :class="isSelected('tab-' + t.id) ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-sm shrink-0">{{ t.icon }}</span>
                <span>Go to {{ t.label }}</span>
              </div>
              <kbd class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                Jump
              </kbd>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!allItems.length" class="py-8 text-center text-xs text-slate-400">
          No matching commands or attendees found.
        </div>
      </div>

      <!-- Footer Info -->
      <div class="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div class="flex items-center gap-2">
          <span><kbd class="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded">↑</kbd> <kbd class="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded">↓</kbd> navigate</span>
          <span><kbd class="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded">↵</kbd> select</span>
        </div>
        <span>Press <kbd class="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded">Ctrl+K</kbd> anytime</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  workshops: { type: Array, default: () => [] },
  registrations: { type: Array, default: () => [] },
  currentTab: { type: String, default: 'people' },
})

const emit = defineEmits([
  'close',
  'switch-tab',
  'inspect-attendee',
  'open-scanner',
  'preview-email',
  'send-all',
  'export-csv',
  'toggle-live-sync',
  'toggle-dark-mode',
])

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref(null)

const ACTIONS = [
  { id: 'scan', label: 'Scan QR Ticket', icon: '📷', hint: 'Camera Check-in' },
  { id: 'preview-email', label: 'Preview Email Template', icon: '👁️', hint: 'Desktop / Mobile HTML' },
  { id: 'send-all', label: 'Send All Pending Emails', icon: '📤', hint: 'Batch Dispatch' },
  { id: 'export-view', label: 'Export Current View as CSV', icon: '📥', hint: 'Filtered List' },
  { id: 'export-all', label: 'Export Complete Database (CSV)', icon: '📊', hint: 'All Signups' },
  { id: 'live-sync', label: 'Toggle Live Event Auto-Sync (5s)', icon: '⚡', hint: 'Live Admissions Desk' },
  { id: 'dark-mode', label: 'Toggle Dark / Light Mode', icon: '🌓', hint: 'UI Theme' },
]

const TABS = [
  { id: 'people', label: 'Registrations & Attendees', icon: '👥' },
  { id: 'workshops', label: 'Workshops & Schedule', icon: '📅' },
  { id: 'certificates', label: 'Certificates Vault', icon: '📜' },
  { id: 'team', label: 'Team Members Roster', icon: '⭐' },
]

const initials = (name) => {
  if (!name) return 'SS'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const filteredAttendees = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return props.registrations
    .filter(
      (r) =>
        r.full_name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.university?.toLowerCase().includes(q)
    )
    .slice(0, 5)
})

const filteredActions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return ACTIONS
  return ACTIONS.filter(
    (a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q)
  )
})

const filteredTabs = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return TABS
  return TABS.filter((t) => t.label.toLowerCase().includes(q))
})

const allItems = computed(() => {
  const items = []
  for (const att of filteredAttendees.value) {
    items.push({ type: 'attendee', id: 'att-' + att.id, data: att })
  }
  for (const act of filteredActions.value) {
    items.push({ type: 'action', id: 'action-' + act.id, data: act })
  }
  for (const t of filteredTabs.value) {
    items.push({ type: 'tab', id: 'tab-' + t.id, data: t })
  }
  return items
})

const isSelected = (itemId) => {
  return allItems.value[selectedIndex.value]?.id === itemId
}

const moveSelection = (delta) => {
  const total = allItems.value.length
  if (!total) return
  selectedIndex.value = (selectedIndex.value + delta + total) % total
}

const executeSelected = () => {
  const item = allItems.value[selectedIndex.value]
  if (!item) return
  if (item.type === 'attendee') selectAttendee(item.data)
  else if (item.type === 'action') executeAction(item.data)
  else if (item.type === 'tab') switchTab(item.data.id)
}

const selectAttendee = (attendee) => {
  emit('inspect-attendee', attendee)
  close()
}

const executeAction = (action) => {
  if (action.id === 'scan') emit('open-scanner')
  else if (action.id === 'preview-email') emit('preview-email')
  else if (action.id === 'send-all') emit('send-all')
  else if (action.id === 'export-view') emit('export-csv', 'view')
  else if (action.id === 'export-all') emit('export-csv', 'all')
  else if (action.id === 'live-sync') emit('toggle-live-sync')
  else if (action.id === 'dark-mode') emit('toggle-dark-mode')
  close()
}

const switchTab = (tabId) => {
  emit('switch-tab', tabId)
  close()
}

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const onGlobalKeydown = (e) => {
  if (e.key === 'Escape') {
    close()
  }
}

watch(query, () => {
  selectedIndex.value = 0
})

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  nextTick(() => {
    inputRef.value?.focus()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})

defineExpose({ open, close })
</script>
