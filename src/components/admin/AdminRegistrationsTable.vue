<template>
  <div class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
    <!-- ════════ TABLE TOP TOOLBAR: STATUS TABS & DUAL PAGINATION ════════ -->
    <div
      class="p-2.5 sm:p-3 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3"
    >
      <!-- 1-Click Segmented Status Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          @click="$emit('update:status-filter', tab.id)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          :class="
            statusFilter === tab.id
              ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25 font-semibold'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
          "
        >
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count != null"
            class="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold"
            :class="
              statusFilter === tab.id
                ? 'bg-blue-500 text-white'
                : tab.highlight
                  ? 'bg-amber-100 text-amber-800 border border-amber-200/60'
                  : 'bg-slate-200/80 text-slate-600'
            "
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Top Fast Pagination Controls -->
      <div class="flex items-center gap-2 text-xs font-mono">
        <!-- Scan QR Ticket Button -->
        <button
          type="button"
          @click="$emit('open-scanner')"
          class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
          title="Scan QR Tickets"
        >
          <svg class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
          </svg>
          <span class="hidden sm:inline">Scan QR</span>
        </button>

        <!-- Page size selector -->
        <div class="flex items-center gap-1 text-slate-500 font-sans text-xs">
          <span class="hidden sm:inline text-slate-400">Rows:</span>
          <select
            :value="limit"
            @change="$emit('update:limit', Number($event.target.value))"
            class="bg-white border border-slate-200/80 rounded-lg px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <!-- Page jump buttons -->
        <div class="flex items-center gap-1">
          <span class="text-slate-500 text-[11px] font-medium mr-1 tabular-nums">
            {{ total ? (page - 1) * limit + 1 : 0 }}–{{ Math.min(page * limit, total) }} of {{ total }}
          </span>
          <button
            type="button"
            @click="$emit('change-page', -1)"
            :disabled="page === 1 || loading"
            class="w-6 h-6 flex items-center justify-center rounded border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs active:scale-[0.95]"
            title="Previous page"
          >
            <svg class="w-3 h-3 text-slate-700" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 12l-4-4 4-4" />
            </svg>
          </button>
          <span class="px-1 text-xs font-bold text-slate-800">{{ page }} / {{ maxPages || 1 }}</span>
          <button
            type="button"
            @click="$emit('change-page', 1)"
            :disabled="page * limit >= total || loading"
            class="w-6 h-6 flex items-center justify-center rounded border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs active:scale-[0.95]"
            title="Next page"
          >
            <svg class="w-3 h-3 text-slate-700" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12l4-4-4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Selection Quick Action Bar -->
    <div
      v-if="selectedIds.length > 0"
      class="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in border-b border-slate-800"
    >
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
        <span class="font-semibold">{{ selectedIds.length }} attendee{{ selectedIds.length === 1 ? '' : 's' }} selected</span>
        <button
          type="button"
          @click="clearSelection"
          class="text-slate-400 hover:text-white underline text-[11px] cursor-pointer ml-1"
        >
          Deselect
        </button>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Target Workshop for Batch Check-in -->
        <div v-if="workshops.length" class="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1">
          <span class="text-[10px] text-slate-400 font-mono">Session:</span>
          <select
            v-model="batchWorkshopId"
            class="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer pr-3 font-medium"
          >
            <option
              v-for="(w, idx) in workshops"
              :key="w.id"
              :value="w.id"
              class="bg-slate-900 text-white"
            >
              #{{ idx + 1 }} {{ w.title }}
            </option>
          </select>
        </div>

        <button
          v-if="workshops.length"
          type="button"
          @click="emitBatchCheckIn"
          :disabled="batchCheckingIn"
          class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs shadow-emerald-500/30 active:scale-[0.98] flex items-center gap-1.5"
        >
          <span v-if="batchCheckingIn" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ batchCheckingIn ? 'Checking in…' : `Check In (${selectedIds.length})` }}</span>
        </button>

        <button
          type="button"
          @click="$emit('batch-send', selectedIds)"
          :disabled="batchSending"
          class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs shadow-blue-500/30 active:scale-[0.98]"
        >
          {{ batchSending ? 'Sending…' : `Send Email (${selectedIds.length})` }}
        </button>
      </div>
    </div>

    <!-- ════════ DESKTOP TABLE VIEW ════════ -->
    <div class="hidden md:block overflow-x-auto relative">
      <table class="w-full text-xs text-left border-collapse">
        <thead class="sticky top-0 bg-slate-50/95 z-20 backdrop-blur-xs border-b border-slate-200/80">
          <tr>
            <!-- Select All Checkbox -->
            <th class="px-3 py-2.5 w-8">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
            </th>
            <th
              v-for="h in ['Attendee', 'Email Address', 'University', 'Registered', 'Attendance', 'Email Status']"
              :key="h"
              class="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap"
            >
              <span v-if="h === 'Attendance' && activeWorkshopId">
                Attendance (Session)
              </span>
              <span v-else-if="h === 'Attendance' && workshops.length">
                Attendance ({{ workshops.length }} Sessions)
              </span>
              <span v-else>
                {{ h }}
              </span>
            </th>
            <!-- Sticky Action Column Header with Border Divider -->
            <th
              class="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap sticky right-0 bg-slate-50/95 border-l border-slate-200/80 text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 font-sans">
          <!-- Loading Skeletons -->
          <tr v-if="loading" v-for="n in 6" :key="n" class="animate-pulse">
            <td class="px-3 py-3"><div class="w-3.5 h-3.5 bg-slate-200 rounded"></div></td>
            <td class="px-3.5 py-3"><div class="h-3.5 bg-slate-200 rounded w-28"></div></td>
            <td class="px-3.5 py-3"><div class="h-3.5 bg-slate-200 rounded w-36"></div></td>
            <td class="px-3.5 py-3"><div class="h-3.5 bg-slate-200 rounded w-24"></div></td>
            <td class="px-3.5 py-3"><div class="h-3.5 bg-slate-200 rounded w-20"></div></td>
            <td class="px-3.5 py-3"><div class="h-4 bg-slate-200 rounded-full w-16"></div></td>
            <td class="px-3.5 py-3"><div class="h-4 bg-slate-200 rounded-full w-20"></div></td>
            <td class="px-4 py-3 sticky right-0 bg-white border-l border-slate-200/80"><div class="h-6 bg-slate-200 rounded-md w-16 ml-auto"></div></td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!registrations.length">
            <td colspan="8" class="px-4 py-16 text-center text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <svg class="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
                <p class="text-xs font-semibold text-slate-700">No attendees match this filter</p>
                <p class="text-[11px] text-slate-400">Try switching status tabs or adjusting search criteria</p>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-else
            v-for="r in registrations"
            :key="r.id"
            class="hover:bg-blue-50/30 transition-colors group cursor-pointer"
            :class="{ 'bg-blue-50/50': selectedIds.includes(r.id) }"
            @click="$emit('inspect', r)"
          >
            <!-- Checkbox -->
            <td class="px-3 py-2.5 w-8" @click.stop>
              <input
                type="checkbox"
                :value="r.id"
                v-model="selectedIds"
                class="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
            </td>

            <!-- Attendee Name & Monogram Avatar -->
            <td class="px-3.5 py-2.5 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 select-none"
                >
                  {{ initials(r.full_name) }}
                </div>
                <div>
                  <span class="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {{ r.full_name }}
                  </span>
                  <span v-if="r.phone" class="text-[10px] text-slate-400 font-mono ml-1.5">
                    {{ r.phone }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Email Address -->
            <td class="px-3.5 py-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
              {{ r.email }}
            </td>

            <!-- University -->
            <td class="px-3.5 py-2.5 whitespace-nowrap text-slate-700">
              <span>{{ r.university || "—" }}</span>
              <span v-if="r.year_of_study" class="text-[10px] text-slate-400 ml-1 font-mono">
                (Y{{ r.year_of_study }})
              </span>
            </td>

            <!-- Registered Date -->
            <td class="px-3.5 py-2.5 text-slate-400 font-mono text-[11px] tabular-nums whitespace-nowrap">
              {{ shortDate(r.created_at) }}
            </td>

            <!-- Attendance Status Pill Toggle (Per-Workshop Dynamic) -->
            <td class="px-3.5 py-2.5 whitespace-nowrap" @click.stop>
              <!-- Case A: A specific workshop is selected in Scope -->
              <div v-if="activeWorkshopId" class="flex items-center gap-2">
                <button
                  type="button"
                  @click="$emit('toggle-attended', { attendee: r, workshopId: activeWorkshopId })"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono tracking-wide border transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                  :class="isAttended(r, activeWorkshopId)
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="isAttended(r, activeWorkshopId) ? 'bg-emerald-500' : 'bg-slate-300'"
                  ></span>
                  {{ isAttended(r, activeWorkshopId) ? 'Attended' : 'Check-in' }}
                </button>
                <span v-if="workshops.length > 1" class="text-[10px] font-mono text-slate-400" :title="`${getAttendedCount(r)} of ${workshops.length} workshops attended`">
                  ({{ getAttendedCount(r) }}/{{ workshops.length }})
                </span>
              </div>

              <!-- Case B: Multi-workshop overview (depends on actual number of workshops) -->
              <div v-else-if="workshops.length" class="flex items-center gap-1.5">
                <div class="flex items-center gap-1">
                  <button
                    v-for="(w, idx) in workshops"
                    :key="w.id"
                    type="button"
                    @click="$emit('toggle-attended', { attendee: r, workshopId: w.id })"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono tracking-wide border transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                    :class="isAttended(r, w.id)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'"
                    :title="`${w.title}: ${isAttended(r, w.id) ? 'Checked In (click to cancel)' : 'Click to Check In'}`"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="isAttended(r, w.id) ? 'bg-emerald-500' : 'bg-slate-300'"
                    ></span>
                    <span>#{{ idx + 1 }}{{ isAttended(r, w.id) ? '✓' : '' }}</span>
                  </button>
                </div>
                <span
                  class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full"
                  :class="getAttendedCount(r) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'"
                >
                  {{ getAttendedCount(r) }}/{{ workshops.length }}
                </span>
              </div>

              <!-- Fallback if no workshops configured yet -->
              <span v-else class="text-[10px] font-mono text-slate-400">
                No sessions
              </span>
            </td>

            <!-- Status with Concentric Halo Dot -->
            <td class="px-3.5 py-2.5 whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase tracking-wide border"
                  :class="r.is_stuck ? 'bg-amber-50 text-amber-800 border-amber-300' : statusPillClass(r.email_status)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="r.is_stuck ? 'bg-amber-500 ring-2 ring-amber-500/20' : statusDotClass(r.email_status)"
                  ></span>
                  {{ r.is_stuck ? "Stuck" : r.email_status }}
                </span>

                <span
                  v-if="r.email_status === 'processing'"
                  class="text-[10px] font-mono text-slate-400"
                >
                  {{ lockAge(r.locked_at) }}
                </span>
              </div>

              <div
                v-if="r.last_error"
                class="text-[10px] text-rose-600 mt-0.5 max-w-[200px] truncate font-mono"
                :title="r.last_error"
              >
                {{ r.last_error }}
              </div>
            </td>

            <!-- ════ STICKY ACTION COLUMN (Divided by Crisp Border) ════ -->
            <td
              class="px-4 py-2.5 whitespace-nowrap sticky right-0 bg-white group-hover:bg-blue-50/40 transition-colors border-l border-slate-200/80 text-right"
              @click.stop
            >
              <button
                v-if="r.email_status !== 'delivered'"
                @click="$emit('send-one', r)"
                :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-[0.98]"
                :class="
                  r.is_stuck
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20'
                "
              >
                <svg
                  v-if="sendingId === r.id"
                  class="w-3 h-3 animate-spin text-white"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" class="opacity-25" />
                  <path d="M8 2a6 6 0 016 6" stroke="currentColor" stroke-width="2" class="opacity-75" />
                </svg>
                <span>{{ sendingId === r.id ? "Sending…" : getSendLabel(r) }}</span>
              </button>
              <span v-else class="text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1 font-mono">
                <svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8.5l3 3 6-6" />
                </svg>
                Delivered
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ════════ MOBILE CARDS VIEW (< 768px) ════════ -->
    <div class="md:hidden divide-y divide-slate-100">
      <div
        v-for="r in registrations"
        :key="r.id"
        class="p-3.5 hover:bg-blue-50/20 transition-colors flex flex-col gap-2"
        @click="$emit('inspect', r)"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 font-mono text-[10px] font-bold flex items-center justify-center shrink-0"
            >
              {{ initials(r.full_name) }}
            </div>
            <div>
              <div class="font-semibold text-slate-900 text-xs leading-tight">{{ r.full_name }}</div>
              <div class="text-[11px] font-mono text-slate-500">{{ r.email }}</div>
            </div>
          </div>

          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wide border"
            :class="r.is_stuck ? 'bg-amber-50 text-amber-800 border-amber-300' : statusPillClass(r.email_status)"
          >
            {{ r.is_stuck ? 'Stuck' : r.email_status }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>{{ r.university || 'No institution' }}</span>
          <span class="font-mono text-[10px] text-slate-400">{{ shortDate(r.created_at) }}</span>
        </div>

        <!-- Mobile Workshop Attendance Badges -->
        <div v-if="workshops.length" class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100" @click.stop>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono text-slate-400 font-semibold uppercase">Check-in:</span>
            <button
              v-for="(w, idx) in workshops"
              :key="w.id"
              type="button"
              @click.stop="$emit('toggle-attended', { attendee: r, workshopId: w.id })"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
              :class="isAttended(r, w.id)
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 active:bg-emerald-100'
                : 'bg-slate-50 text-slate-500 border-slate-200 active:bg-slate-100'"
              :title="`${w.title}: ${isAttended(r, w.id) ? 'Checked In' : 'Click to Check In'}`"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="isAttended(r, w.id) ? 'bg-emerald-500' : 'bg-slate-300'"></span>
              #{{ idx + 1 }} {{ isAttended(r, w.id) ? '✓' : '+' }}
            </button>
          </div>
          <span class="text-[10px] font-mono text-slate-400 font-bold shrink-0">
            {{ getAttendedCount(r) }}/{{ workshops.length }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <span class="text-[10px] text-slate-400">Tap to inspect profile</span>
          <button
            v-if="r.email_status !== 'delivered'"
            @click.stop="$emit('send-one', r)"
            :disabled="sendingId === r.id || (r.email_status === 'processing' && !r.is_stuck)"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-40 active:scale-[0.98] shadow-xs shadow-blue-500/20"
          >
            {{ sendingId === r.id ? 'Sending…' : getSendLabel(r) }}
          </button>
          <span v-else class="text-emerald-700 text-xs font-semibold font-mono">✓ Delivered</span>
        </div>
      </div>
    </div>

    <!-- ════════ BOTTOM PAGINATION BAR ════════ -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50/70 border-t border-slate-200/80 text-xs font-mono"
    >
      <span class="text-slate-500 tabular-nums text-[11px]">
        Showing {{ total ? (page - 1) * limit + 1 : 0 }}–{{ Math.min(page * limit, total) }} of {{ total.toLocaleString() }}
      </span>

      <div class="flex items-center gap-1.5">
        <button
          @click="$emit('change-page', -1)"
          :disabled="page === 1 || loading"
          class="px-2.5 py-1 rounded border border-slate-200/80 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-[11px] active:scale-[0.98]"
        >
          Previous
        </button>
        <span class="px-1 text-slate-700 font-bold text-xs">{{ page }} / {{ maxPages || 1 }}</span>
        <button
          @click="$emit('change-page', 1)"
          :disabled="page * limit >= total || loading"
          class="px-2.5 py-1 rounded border border-slate-200/80 bg-white text-slate-700 font-semibold hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-[11px] active:scale-[0.98]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  registrations: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 50,
  },
  total: {
    type: Number,
    default: 0,
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  sendingId: {
    type: [String, Number, null],
    default: null,
  },
  batchSending: {
    type: Boolean,
    default: false,
  },
  batchCheckingIn: {
    type: Boolean,
    default: false,
  },
  emailView: {
    type: String,
    default: 'welcome_schedule',
  },
  workshops: {
    type: Array,
    default: () => [],
  },
  activeWorkshopId: {
    type: String,
    default: null,
  },
  shortDate: {
    type: Function,
    required: true,
  },
  lockAge: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([
  'send-one',
  'batch-send',
  'batch-check-in',
  'change-page',
  'update:limit',
  'update:status-filter',
  'inspect',
  'toggle-attended',
  'open-scanner',
]);

const selectedIds = ref([]);
const batchWorkshopId = ref('');

watch(
  () => [props.activeWorkshopId, props.workshops],
  () => {
    if (props.activeWorkshopId) {
      batchWorkshopId.value = props.activeWorkshopId;
    } else if (!batchWorkshopId.value && props.workshops?.length) {
      batchWorkshopId.value = props.workshops[0].id;
    }
  },
  { immediate: true }
);

const emitBatchCheckIn = () => {
  if (!selectedIds.value.length || !batchWorkshopId.value) return;
  emit('batch-check-in', {
    ids: [...selectedIds.value],
    workshopId: batchWorkshopId.value,
  });
};

const clearSelection = () => {
  selectedIds.value = [];
};

const isAttended = (attendee, workshopId) => {
  if (!attendee?.checkins) {
    return Boolean(attendee?.attended);
  }
  return attendee.checkins.some((c) => c.workshop_id === workshopId);
};

const getAttendedCount = (attendee) => {
  if (!attendee?.checkins) {
    return attendee?.attended ? 1 : 0;
  }
  return attendee.checkins.length;
};

const isAllSelected = computed(() => {
  if (!props.registrations.length) return false;
  return props.registrations.every((r) => selectedIds.value.includes(r.id));
});

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedIds.value = props.registrations.map((r) => r.id);
  } else {
    selectedIds.value = [];
  }
};

const maxPages = computed(() => {
  if (!props.total || !props.limit) return 1;
  return Math.ceil(props.total / props.limit);
});

// 1-Click Status Filter Tabs
const filterTabs = computed(() => {
  const e = props.stats?.email || {};
  return [
    { id: 'all', label: 'All', count: props.stats?.totals.registrations },
    {
      id: 'not_received',
      label: 'Needs Action',
      count: e.notReceived,
      highlight: Boolean(e.notReceived && e.notReceived > 0),
    },
    { id: 'delivered', label: 'Delivered', count: e.delivered },
    { id: 'sent', label: 'In Transit', count: e.sent },
    { id: 'stuck', label: 'Stuck', count: e.stuck, highlight: Boolean(e.stuck && e.stuck > 0) },
    { id: 'failed', label: 'Failed', count: e.failed, highlight: Boolean(e.failed && e.failed > 0) },
  ];
});

const initials = (name) => {
  if (!name) return 'SS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const statusPillClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80';
    case 'sent':
      return 'bg-sky-50/80 text-sky-700 border-sky-200/80';
    case 'pending':
    case 'processing':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'deferred':
      return 'bg-amber-50/80 text-amber-700 border-amber-200';
    case 'failed':
    case 'bounced':
      return 'bg-rose-50/80 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};

const statusDotClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-500 ring-2 ring-emerald-500/20';
    case 'sent':
      return 'bg-sky-500 ring-2 ring-sky-500/20';
    case 'processing':
      return 'bg-slate-500 ring-2 ring-slate-500/20 animate-pulse';
    case 'deferred':
      return 'bg-amber-500 ring-2 ring-amber-500/20';
    case 'failed':
    case 'bounced':
      return 'bg-rose-500 ring-2 ring-rose-500/20';
    default:
      return 'bg-slate-400 ring-2 ring-slate-400/20';
  }
};

const getSendLabel = (r) => {
  if (r.is_stuck) return 'Release';
  if (r.email_status === 'processing') return 'Sending…';
  if (r.email_status === 'sent') return 'Resend';
  return props.emailView === 'welcome_schedule' ? 'Send' : 'Send Link';
};
</script>
