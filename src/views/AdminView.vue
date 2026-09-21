<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
    <!-- ═══════════════════ LOGIN SCREEN ═══════════════════ -->
    <div
      v-if="!authed"
      class="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-900 relative overflow-hidden"
    >
      <div class="w-full max-w-sm relative z-10">
        <!-- Logo & Header -->
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 text-white font-black text-base shadow-sm border border-slate-700 mb-3"
          >
            ⚡
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight">
            SkillSprint Admin Console
          </h1>
          <p class="text-slate-400 text-xs mt-1">
            Sign in to manage attendees, workshops & delivery
          </p>
        </div>

        <form
          @submit.prevent="login"
          class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
        >
          <div class="flex flex-col gap-1.5">
            <label
              for="password"
              class="text-slate-300 text-[11px] font-bold uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter admin password"
              autofocus
              class="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus-visible:outline-2 focus-visible:outline-slate-400 transition-all"
            />
          </div>

          <div
            v-if="loginError"
            class="p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-semibold"
          >
            {{ loginError }}
          </div>

          <button
            type="submit"
            :disabled="loggingIn"
            class="bg-white hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <svg
              v-if="loggingIn"
              class="w-3.5 h-3.5 animate-spin text-slate-900"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>{{ loggingIn ? "Verifying…" : "Sign In" }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- ═══════════════════ DASHBOARD SHELL ═══════════════════ -->
    <div v-else class="min-h-screen flex flex-col">
      <!-- Top Navigation Bar -->
      <header
        class="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-14 gap-4">
            <!-- Brand & Status Badges -->
            <div class="flex items-center gap-3">
              <div
                class="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-xs"
              >
                ⚡
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 tracking-tight text-sm">
                  SkillSprint
                </span>
                <span
                  class="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/80 px-1.5 py-0.2 rounded"
                >
                  Admin
                </span>
              </div>

              <!-- Database Active Pill -->
              <span
                class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.2 rounded-full ml-1"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                DB Live
              </span>
            </div>

            <!-- Right Controls: Live Time, Refresh, Sign Out -->
            <div class="flex items-center gap-2 sm:gap-3">
              <!-- Live Site Time in PKT -->
              <div
                class="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg"
                title="Site time in Pakistan Standard Time (UTC+5)"
              >
                <span>🕒 {{ currentSiteTime }}</span>
              </div>

              <!-- Refresh Button -->
              <button
                @click="refreshAll"
                :disabled="loading"
                class="inline-flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                title="Refresh registrations and stats"
              >
                <svg
                  class="w-3.5 h-3.5 transition-transform duration-500"
                  :class="{ 'animate-spin': loading }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span class="hidden sm:inline">{{ loading ? "Syncing…" : "Refresh" }}</span>
              </button>

              <!-- Sign Out -->
              <button
                @click="logout"
                class="border border-slate-200 bg-white hover:bg-slate-50 hover:text-rose-600 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Sign out
              </button>
            </div>
          </div>

          <!-- Segmented Tab Navigation -->
          <nav
            class="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Dashboard Tabs"
          >
            <button
              v-for="t in tabs"
              :key="t.id"
              @click="tab = t.id"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
              :class="
                tab === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              "
            >
              <span>{{ t.label }}</span>
              <span
                v-if="t.count != null"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold"
                :class="
                  tab === t.id
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-200/80 text-slate-600'
                "
              >
                {{ t.count }}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <!-- Main Dashboard Container -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full flex-1">
        <!-- ═══════════════════ REGISTRATIONS TAB ═══════════════════ -->
        <div v-show="tab === 'people'">
          <!-- Compact Executive Metric Strip (~70px height) -->
          <AdminHeroStats
            :stats="stats"
            :email-view="emailView"
            :reset-countdown="resetCountdown"
            :sender-summary="senderSummary"
            :sender-warning="senderWarning"
            :stuck-warning="stuckWarning"
            :show-analytics="showAnalytics"
            @toggle-analytics="showAnalytics = !showAnalytics"
            @release-stuck="sendAll"
            @retry-failed="retryFailed"
          />

          <!-- Collapsible Analytics & Trends Drawer (Tucked away by default) -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-if="showAnalytics" class="mb-4">
              <AdminMetricsChart
                :trend="stats?.trend"
                :top-universities="stats?.topUniversities"
                :stats="stats"
              />
            </div>
          </transition>

          <!-- Compact Operational Toolbar (Above the Table) -->
          <div
            class="bg-white border border-slate-200/90 rounded-2xl p-3 mb-3 shadow-2xs flex flex-wrap items-center justify-between gap-3"
          >
            <!-- Left: Scope Selector + Search Input -->
            <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <!-- Campaign Scope -->
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Scope:
                </span>
                <select
                  v-model="emailView"
                  @change="onEmailViewChange"
                  class="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-slate-50 text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900"
                >
                  <option :value="WELCOME_TEMPLATE">
                    Welcome Campaign
                  </option>
                  <option
                    v-for="w in workshops"
                    :key="w.id"
                    :value="`reminder:${w.id}`"
                  >
                    Meeting link — {{ w.title }}
                  </option>
                </select>
              </div>

              <!-- Search input -->
              <div class="relative flex-1 min-w-[180px] max-w-sm">
                <input
                  v-model="search"
                  @input="debouncedLoad"
                  type="search"
                  placeholder="Filter name, email, university…"
                  class="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 placeholder-slate-400 focus-visible:outline-2 focus-visible:outline-slate-900 transition-all"
                />
                <svg
                  class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Right: Action Buttons Group -->
            <div class="flex items-center gap-2">
              <button
                @click="sendAll"
                :disabled="sendingAll || !stats?.email.notReceived"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <svg
                  v-if="sendingAll"
                  class="w-3 h-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>
                  {{
                    sendingAll
                      ? "Sending…"
                      : `Send All Pending (${stats?.email.notReceived ?? 0})`
                  }}
                </span>
              </button>

              <button
                v-if="stats?.email.failed"
                @click="retryFailed"
                :disabled="sendingAll"
                class="border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                title="Requeue failed emails"
              >
                Retry Failed ({{ stats.email.failed }})
              </button>

              <!-- Export CSV Dropdown -->
              <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <button
                  @click="downloadCsv('view')"
                  class="bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 text-xs font-semibold transition-colors border-r border-slate-200 cursor-pointer"
                  title="Download current filtered list as CSV"
                >
                  CSV
                </button>
                <button
                  @click="downloadCsv('all')"
                  class="bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 px-2 py-1 text-xs font-semibold transition-colors cursor-pointer"
                  title="Export complete database registrations"
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <!-- Registrations Table (Starts Immediately Below the Toolbar!) -->
          <AdminRegistrationsTable
            :registrations="registrations"
            :stats="stats"
            :loading="loading"
            :page="page"
            :limit="limit"
            :total="total"
            :status-filter="statusFilter"
            :sending-id="sendingId"
            :batch-sending="batchSending"
            :email-view="emailView"
            :short-date="shortDate"
            :lock-age="lockAge"
            @send-one="sendOne"
            @batch-send="sendBatch"
            @change-page="changePage"
            @update:limit="updateLimit"
            @update:status-filter="updateStatusFilter"
            @inspect="openAttendeeDrawer"
          />

          <!-- Attendee Detail Slide-Over Inspector Drawer -->
          <AdminAttendeeDrawer
            :attendee="inspectedAttendee"
            :sending-id="sendingId"
            :short-date="shortDate"
            @close="inspectedAttendee = null"
            @send-one="sendOne"
          />
        </div>

        <!-- ═══════════════════ WORKSHOPS TAB ═══════════════════ -->
        <div v-show="tab === 'workshops'">
          <!-- Top Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                Workshops & Sessions
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Manage schedule, meeting links, and public visibility
              </p>
            </div>

            <button
              type="button"
              @click="toggleWorkshopDrawer"
              class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{{ showWorkshopForm ? "Hide Form" : "+ Add Workshop" }}</span>
            </button>
          </div>

          <!-- Collapsible Add/Edit Workshop Drawer -->
          <div
            v-if="showWorkshopForm"
            class="bg-white border border-slate-200/90 rounded-2xl p-5 mb-5 shadow-xs transition-all"
          >
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                {{ editing ? "Edit Workshop" : "Add a New Workshop" }}
              </h3>
              <button
                type="button"
                @click="resetWorkshopForm"
                class="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form @submit.prevent="saveWorkshop" class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Title *
                </label>
                <input
                  v-model="wForm.title"
                  type="text"
                  required
                  :class="adminInput"
                  placeholder="e.g. Mastering Full-Stack Next.js & TypeScript"
                />
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  v-model="wForm.description"
                  rows="2"
                  :class="adminInput"
                  placeholder="What attendees will learn."
                ></textarea>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Starts at *
                  <span class="text-indigo-600">({{ SITE_TIME_ZONE_LABEL }})</span>
                </label>
                <input
                  v-model="wForm.starts_at"
                  type="datetime-local"
                  required
                  :class="adminInput"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Duration (min)
                </label>
                <input
                  v-model.number="wForm.duration_mins"
                  type="number"
                  min="15"
                  step="15"
                  :class="adminInput"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Speaker
                </label>
                <input v-model="wForm.speaker" type="text" :class="adminInput" placeholder="Ali Raza" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Focus Area / Role
                </label>
                <input
                  v-model="wForm.speaker_role"
                  type="text"
                  :class="adminInput"
                  placeholder="Senior Solutions Architect"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Location
                </label>
                <input
                  v-model="wForm.location"
                  type="text"
                  :class="adminInput"
                  placeholder="Online — Google Meet"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Seats (blank = unlimited)
                </label>
                <input
                  v-model="wForm.seats"
                  type="number"
                  min="0"
                  :class="adminInput"
                  placeholder="Unlimited"
                />
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Meeting Link <span class="text-emerald-600">· Confidential</span>
                </label>
                <input
                  v-model="wForm.meeting_link"
                  type="url"
                  :class="adminInput"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
                <span class="text-[11px] text-slate-400">
                  Only emailed to registered attendees when you press <strong>Send link</strong>.
                </span>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </label>
                <select v-model="wForm.status" :class="adminInput">
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div class="flex items-center pt-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="wForm.is_published"
                    type="checkbox"
                    class="w-4 h-4 rounded text-slate-900 cursor-pointer"
                  />
                  <span class="text-xs text-slate-800 font-semibold">
                    Published on /workshops page
                  </span>
                </label>
              </div>

              <div class="sm:col-span-2 flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  :disabled="savingWorkshop"
                  class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {{ savingWorkshop ? "Saving…" : editing ? "Save Changes" : "Create Workshop" }}
                </button>
                <button
                  type="button"
                  @click="resetWorkshopForm"
                  class="text-slate-500 text-xs font-semibold hover:text-slate-800 px-3 py-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Test Send Box -->
          <div
            v-if="testWorkshop"
            class="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-5 shadow-2xs"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 class="font-bold text-slate-900 text-sm">
                  Send Test Email for “{{ testWorkshop.title }}”
                </h3>
                <p class="text-slate-500 text-xs mt-0.5">
                  Sends real template to a single inbox without affecting registration delivery states.
                </p>
              </div>
              <button
                type="button"
                @click="testWorkshop = null"
                class="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form @submit.prevent="sendTest" class="flex flex-wrap items-center gap-2 mt-3">
              <input
                v-model="testEmail"
                type="email"
                required
                placeholder="your.email@example.com"
                class="flex-1 min-w-[240px] border border-slate-300 rounded-xl px-3 py-1.5 text-xs bg-white focus-visible:outline-2 focus-visible:outline-slate-900"
              />
              <button
                type="submit"
                :disabled="sendingTest"
                class="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {{ sendingTest ? "Sending…" : "Dispatch Test" }}
              </button>
            </form>
          </div>

          <!-- Workshops Table -->
          <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/80">
                    <th
                      v-for="h in ['Starts At', 'Workshop', 'Status', 'Site Visibility', 'Meeting Link', 'Actions']"
                      :key="h"
                      class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="!workshops.length">
                    <td colspan="6" class="px-4 py-12 text-center text-slate-400 text-sm">
                      No workshops scheduled yet. Click "+ Add Workshop" to schedule one.
                    </td>
                  </tr>

                  <tr
                    v-for="w in workshops"
                    :key="w.id"
                    class="hover:bg-slate-50/70 transition-colors"
                  >
                    <td class="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap tabular-nums">
                      {{ shortDate(w.starts_at) }}
                    </td>

                    <td class="px-4 py-3">
                      <div class="font-bold text-slate-900 leading-tight">
                        {{ w.title }}
                      </div>
                      <div v-if="w.speaker" class="text-xs text-slate-500 mt-0.5">
                        {{ w.speaker }}
                        <span v-if="w.speaker_role" class="text-slate-400">· {{ w.speaker_role }}</span>
                      </div>
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap">
                      <select
                        :value="w.status"
                        @change="changeStatus(w, $event.target.value)"
                        :disabled="updatingId === w.id"
                        class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border-0 cursor-pointer disabled:opacity-50"
                        :class="statusClass(w.status)"
                      >
                        <option v-for="opt in WORKSHOP_STATUSES" :key="opt" :value="opt">
                          {{ opt }}
                        </option>
                      </select>
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap">
                      <button
                        @click="togglePublished(w)"
                        :disabled="updatingId === w.id"
                        class="inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                        :class="w.is_published ? 'text-emerald-700' : 'text-slate-400'"
                      >
                        <span
                          class="w-2 h-2 rounded-full"
                          :class="w.is_published ? 'bg-emerald-500' : 'bg-slate-300'"
                        ></span>
                        {{ w.is_published ? "Live" : "Draft" }}
                      </button>
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        v-if="!w.meeting_link"
                        class="text-xs font-bold px-2 py-0.5 rounded"
                        :class="needsLink(w) ? 'bg-amber-100 text-amber-800' : 'text-slate-400'"
                      >
                        {{ needsLink(w) ? "⚠ Not set" : "Not set" }}
                      </span>
                      <div v-else>
                        <span class="text-xs text-emerald-700 font-bold">✓ Ready</span>
                        <div v-if="w.link_sent_at" class="text-[10px] text-slate-400 font-mono">
                          Sent {{ shortDate(w.link_sent_at) }}
                        </div>
                        <div
                          v-else
                          class="text-[10px] font-semibold"
                          :class="needsLink(w) ? 'text-amber-700' : 'text-slate-400'"
                        >
                          Not emailed yet
                        </div>
                      </div>
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap text-xs">
                      <div class="flex items-center gap-2">
                        <button
                          @click="sendLink(w)"
                          :disabled="sendingLinkId === w.id || !w.meeting_link"
                          class="text-emerald-700 font-bold hover:text-emerald-900 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {{
                            sendingLinkId === w.id
                              ? sendProgress
                                ? `Sending… ${sendProgress.sent}`
                                : "Sending…"
                              : w.link_sent_at
                                ? "Send to new"
                                : "Send link"
                          }}
                        </button>
                        <button
                          v-if="w.link_sent_at"
                          @click="sendLink(w, { resendAll: true })"
                          :disabled="sendingLinkId === w.id || !w.meeting_link"
                          class="text-amber-700 font-bold hover:text-amber-900 disabled:text-slate-300 cursor-pointer"
                          title="Resend to all registered"
                        >
                          Resend all
                        </button>
                        <button
                          @click="openTest(w)"
                          :disabled="!w.meeting_link"
                          class="text-slate-600 font-bold hover:text-slate-900 disabled:text-slate-300 cursor-pointer"
                        >
                          Test
                        </button>
                        <button
                          @click="editWorkshop(w)"
                          class="text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteWorkshop(w)"
                          class="text-rose-600 font-bold hover:text-rose-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═══════════════════ TEAM TAB ═══════════════════ -->
        <div v-show="tab === 'team'">
          <!-- Top Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                Core Team Roster
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Manage team profiles shown on the public /team page
              </p>
            </div>

            <button
              type="button"
              @click="showTeamForm = !showTeamForm"
              class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {{ showTeamForm ? "Hide Form" : "+ Add Member" }}
            </button>
          </div>

          <!-- Collapsible Add Member Drawer -->
          <div
            v-if="showTeamForm"
            class="bg-white border border-slate-200/90 rounded-2xl p-5 mb-5 shadow-xs"
          >
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">
                Add Team Member
              </h3>
              <button
                type="button"
                @click="showTeamForm = false"
                class="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form @submit.prevent="saveMember" class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Name *</label>
                <input
                  v-model="tForm.name"
                  type="text"
                  required
                  :class="adminInput"
                  placeholder="Ayesha Khan"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Role *</label>
                <input
                  v-model="tForm.role"
                  type="text"
                  required
                  :class="adminInput"
                  placeholder="Core Engineering Lead"
                />
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Bio *</label>
                <textarea
                  v-model="tForm.bio"
                  rows="3"
                  required
                  :class="adminInput"
                  placeholder="What they contribute to the initiative."
                ></textarea>
              </div>

              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Photo</label>
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs"
                  >
                    <img
                      v-if="tForm.image"
                      :src="tForm.image"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-slate-300 text-lg" aria-hidden="true">👤</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <input
                      ref="memberFile"
                      type="file"
                      accept="image/*"
                      @change="pickImage"
                      class="text-xs text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-slate-200 file:bg-white file:text-xs file:font-semibold file:text-slate-700 cursor-pointer"
                    />
                    <span class="text-[11px] text-slate-400">
                      JPG/PNG under 2MB. Auto-optimized to 400px.
                    </span>
                    <button
                      v-if="tForm.image"
                      type="button"
                      @click="clearImage"
                      class="text-rose-600 text-[11px] font-bold text-left hover:text-rose-800 cursor-pointer"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2 flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="savingMember"
                  class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {{ savingMember ? "Saving…" : "Save Member" }}
                </button>
                <span v-if="memberError" class="text-rose-600 text-xs font-semibold">
                  {{ memberError }}
                </span>
              </div>
            </form>
          </div>

          <!-- Team Table -->
          <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/80">
                    <th
                      v-for="h in ['', 'Member', 'Role', 'Bio', 'Actions']"
                      :key="h"
                      class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="!members.length">
                    <td colspan="5" class="px-4 py-12 text-center text-slate-400 text-sm">
                      No team members added yet. Click "+ Add Member" to add someone.
                    </td>
                  </tr>

                  <tr
                    v-for="m in members"
                    :key="m.id"
                    class="hover:bg-slate-50/70 transition-colors"
                  >
                    <td class="px-4 py-3 w-12">
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-2xs"
                      >
                        <img
                          v-if="m.image"
                          :src="m.image"
                          alt=""
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-slate-300 text-xs">👤</span>
                      </div>
                    </td>

                    <td class="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {{ m.name }}
                    </td>

                    <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap font-medium">
                      {{ m.role }}
                    </td>

                    <td class="px-4 py-3 text-slate-500 text-xs max-w-md truncate" :title="m.bio">
                      {{ m.bio }}
                    </td>

                    <td class="px-4 py-3 whitespace-nowrap">
                      <button
                        @click="deleteMember(m)"
                        class="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═══════════════════ CERTIFICATES TAB ═══════════════════ -->
        <div v-if="certificatesOpened" v-show="tab === 'certificates'">
          <CertificatesTab ref="certificatesTab" :toast="toast" />
        </div>
      </main>
    </div>

    <!-- ═══════════════════ TOAST NOTIFICATIONS ═══════════════════ -->
    <div
      class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="border rounded-xl px-3.5 py-2.5 shadow-xl text-xs transition-all flex items-start gap-2.5 backdrop-blur-md"
        :class="toastClass(t.kind)"
      >
        <span class="text-sm mt-0.5 leading-none">{{ toastIcon(t.kind) }}</span>
        <div class="flex-1">
          <p class="font-bold">{{ t.title }}</p>
          <p v-if="t.body" class="text-[11px] leading-relaxed mt-0.5 opacity-90">
            {{ t.body }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  dateTime,
  toZonedInput,
  fromZonedInput,
  SITE_TIME_ZONE_LABEL,
} from "../utils/datetime";
import CertificatesTab from "../components/admin/CertificatesTab.vue";
import AdminHeroStats from "../components/admin/AdminHeroStats.vue";
import AdminMetricsChart from "../components/admin/AdminMetricsChart.vue";
import AdminRegistrationsTable from "../components/admin/AdminRegistrationsTable.vue";
import AdminAttendeeDrawer from "../components/admin/AdminAttendeeDrawer.vue";
import { apiPost } from "../utils/adminApi.js";

const adminInput =
  "border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 bg-white " +
  "focus-visible:outline-2 focus-visible:outline-slate-900 transition-colors";

// ── Auth ────────────────────────────────────────────────────────────────────
const authed = ref(false);
const password = ref("");
const loginError = ref("");
const loggingIn = ref(false);

const login = async () => {
  loginError.value = "";
  loggingIn.value = true;
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.value }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok && data.authenticated) {
      authed.value = true;
      password.value = "";
      refreshAll();
    } else {
      loginError.value = data.message || "Could not sign in.";
    }
  } catch {
    loginError.value = "Could not reach server.";
  } finally {
    loggingIn.value = false;
  }
};

const logout = async () => {
  await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
  authed.value = false;
};

const checkAuth = async () => {
  try {
    const res = await fetch("/api/admin/login");
    const data = await res.json().catch(() => ({}));
    authed.value = Boolean(data.authenticated);
    if (authed.value) refreshAll();
  } catch {
    /* stay on login */
  }
};

// ── Toasts ──────────────────────────────────────────────────────────────────
const toasts = ref([]);
let toastSeq = 0;

const toast = (kind, title, body = "", ms = 5000) => {
  const id = ++toastSeq;
  toasts.value.push({ id, kind, title, body });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, ms);
};

const toastClass = (kind) =>
  ({
    success: "bg-slate-900 border-slate-800 text-white",
    info: "bg-slate-900 border-slate-800 text-white",
    warn: "bg-amber-950 border-amber-800 text-amber-100",
    error: "bg-rose-950 border-rose-800 text-rose-100",
  })[kind] || "bg-slate-900 border-slate-800 text-white";

const toastIcon = (kind) =>
  ({
    success: "✓",
    info: "ℹ",
    warn: "⚠",
    error: "✕",
  })[kind] || "•";

// ── Tabs ────────────────────────────────────────────────────────────────────
const tab = ref("people");
const certificatesTab = ref(null);
const certificatesOpened = ref(false);

const tabs = computed(() => [
  { id: "people", label: "Registrations", count: stats.value?.totals.registrations },
  { id: "workshops", label: "Workshops", count: workshops.value.length },
  { id: "team", label: "Team", count: members.value.length },
  { id: "certificates", label: "Certificates" },
]);

watch(
  tab,
  (t) => {
    if (t === "certificates") certificatesOpened.value = true;
  },
  { immediate: true },
);

// ── Data & Controls ─────────────────────────────────────────────────────────
const stats = ref(null);
const registrations = ref([]);
const workshops = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(50);
const loading = ref(false);
const search = ref("");
const statusFilter = ref("all");
const showAnalytics = ref(false);
const inspectedAttendee = ref(null);

const WELCOME_TEMPLATE = "welcome_schedule";
const emailView = ref(WELCOME_TEMPLATE);

const onEmailViewChange = () => {
  page.value = 1;
  statusFilter.value = "all";
  return Promise.all([loadStats(), loadRegistrations()]);
};

const updateLimit = (newLimit) => {
  limit.value = newLimit;
  page.value = 1;
  loadRegistrations();
};

const updateStatusFilter = (newStatus) => {
  statusFilter.value = newStatus;
  page.value = 1;
  loadRegistrations();
};

const openAttendeeDrawer = (attendee) => {
  inspectedAttendee.value = attendee;
};

const now = ref(Date.now());
let ticker = null;

const currentSiteTime = computed(() => dateTime(new Date(now.value)));

const lockAge = (lockedAt) => {
  if (!lockedAt) return "";
  const mins = Math.floor((now.value - new Date(lockedAt).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  return h < 24 ? `${h}h ${mins % 60}m` : `${Math.floor(h / 24)}d ${h % 24}h`;
};

const stuckWarning = computed(() => {
  const email = stats.value?.email;
  if (!email?.stuck) return null;
  const n = email.stuck;
  return {
    title: `${n} email${n === 1 ? "" : "s"} stranded mid-send`,
    body: `A background job held them without completion. Press Release to unstick.`,
  };
});

const senderWarning = computed(() => {
  const sender = stats.value?.sender;
  if (!sender) return null;

  const envVar = { resend: "RESEND_FROM", brevo: "BREVO_FROM" };
  for (const name of ["resend", "brevo"]) {
    const configured = stats.value.quota.usage?.[name]?.configured;
    if (!configured) continue;

    const info = sender[name];
    if (info?.placeholder) {
      return {
        title: `${envVar[name]} has example domain`,
        body: `Update ${envVar[name]} to your verified domain and press Retry failed.`,
      };
    }
    if (!info?.set) {
      return {
        title: `${envVar[name]} missing`,
        body: `Set ${envVar[name]} to enable dispatch.`,
      };
    }
  }
  return null;
});

const senderSummary = computed(() => {
  const sender = stats.value?.sender;
  if (!sender) return "";
  return ["resend", "brevo"]
    .filter((name) => stats.value.quota.usage?.[name]?.configured)
    .map((name) => `${name} @${sender[name]?.domain || "(not set)"}`)
    .join(" · ");
});

const resetCountdown = computed(() => {
  if (!stats.value) return "—";
  const ms = new Date(stats.value.quota.resets_at).getTime() - now.value;
  if (ms <= 0) return "now";
  const h = Math.floor(ms / 3.6e6);
  const m = Math.floor((ms % 3.6e6) / 6e4);
  return `in ${h}h ${m}m`;
});

const shortDate = (v) => dateTime(v);

const statusClass = (status) =>
  ({
    delivered: "bg-emerald-50 text-emerald-700",
    sent: "bg-sky-50 text-sky-700",
    pending: "bg-slate-100 text-slate-600",
    processing: "bg-slate-100 text-slate-600",
    not_queued: "bg-slate-100 text-slate-500",
    deferred: "bg-amber-50 text-amber-700",
    failed: "bg-rose-50 text-rose-700",
    bounced: "bg-rose-50 text-rose-700",
    upcoming: "bg-slate-100 text-slate-700",
    live: "bg-emerald-50 text-emerald-700 font-bold",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-rose-50 text-rose-700",
  })[status] || "bg-slate-100 text-slate-600";

// ── Loading ─────────────────────────────────────────────────────────────────
const loadStats = async () => {
  try {
    const res = await fetch(
      `/api/admin/stats?template=${encodeURIComponent(emailView.value)}`,
    );
    const data = await res.json().catch(() => ({}));
    if (data.ok) stats.value = data;
  } catch {
    /* silent fallback */
  }
};

const loadRegistrations = async () => {
  loading.value = true;
  try {
    const qs = new URLSearchParams({
      search: search.value,
      status: statusFilter.value,
      template: emailView.value,
      page: String(page.value),
      limit: String(limit.value),
    });
    const res = await fetch(`/api/admin/registrations?${qs}`);
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      registrations.value = data.registrations;
      total.value = data.total;
    }
  } catch {
    toast("error", "Could not load registrations", "Check network connection.");
  } finally {
    loading.value = false;
  }
};

const loadWorkshops = async () => {
  try {
    const res = await fetch("/api/workshops?all=1");
    const data = await res.json().catch(() => ({}));
    if (data.ok) workshops.value = data.workshops;
  } catch {
    /* empty */
  }
};

const refreshAll = () =>
  Promise.all([
    loadStats(),
    loadRegistrations(),
    loadWorkshops(),
    loadMembers(),
    certificatesTab.value?.reload(),
  ]);

let debounceTimer = null;
const debouncedLoad = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    loadRegistrations();
  }, 250);
};

const changePage = (delta) => {
  page.value = Math.max(1, page.value + delta);
  loadRegistrations();
};

// ── Sending Actions ─────────────────────────────────────────────────────────
const sendingId = ref(null);
const sendingAll = ref(false);
const batchSending = ref(false);

const reportSendResult = (data, successTitle) => {
  if (data.ok && data.code !== "QUOTA_EXHAUSTED") {
    toast("success", successTitle, data.provider ? `Sent via ${data.provider}.` : "");
    return;
  }
  if (data.code === "QUOTA_EXHAUSTED") {
    toast("warn", "Daily limit reached", "Queued — sends after reset.");
    return;
  }
  if (data.code === "NO_PROVIDER") {
    toast("warn", "No email provider configured", "Add RESEND_API_KEY or BREVO_API_KEY.");
    return;
  }
  toast("error", "Could not send", data.message || "Unknown error.");
};

const sendOne = async (row) => {
  sendingId.value = row.id;
  try {
    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        row.job_id
          ? { jobId: row.job_id }
          : { registrationId: row.id, template: emailView.value },
      ),
    });
    const data = await res.json().catch(() => ({}));
    reportSendResult(data, `Email dispatched to ${row.full_name}`);
    if (inspectedAttendee.value && inspectedAttendee.value.id === row.id) {
      inspectedAttendee.value.email_status = data.ok ? "sent" : "failed";
    }
  } catch {
    toast("error", "Could not send", "Network error.");
  } finally {
    sendingId.value = null;
    await Promise.all([loadStats(), loadRegistrations()]);
  }
};

const sendBatch = async (ids) => {
  if (!ids.length) return;
  batchSending.value = true;
  let sentCount = 0;
  try {
    for (const id of ids) {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: id, template: emailView.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) sentCount++;
    }
    toast("success", `Batch send complete`, `Dispatched ${sentCount} of ${ids.length} emails.`);
  } catch {
    toast("error", "Batch send failed", "Network error occurred.");
  } finally {
    batchSending.value = false;
    await Promise.all([loadStats(), loadRegistrations()]);
  }
};

const sendAll = async () => {
  sendingAll.value = true;
  try {
    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.code === "QUOTA_EXHAUSTED" || data.code === "NO_PROVIDER") {
      reportSendResult(data, "");
    } else if (data.ok) {
      const s = data.summary || {};
      toast("success", `Sent ${s.sent ?? 0} email${s.sent === 1 ? "" : "s"}`);
    } else {
      toast("error", "Could not send", data.message || "Unknown error.");
    }
  } catch {
    toast("error", "Could not send", "Network error.");
  } finally {
    sendingAll.value = false;
    await Promise.all([loadStats(), loadRegistrations()]);
  }
};

const retryFailed = async () => {
  if (!window.confirm(`Requeue and retry failed emails?`)) return;

  sendingAll.value = true;
  try {
    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retryFailed: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", `Requeued ${data.requeued ?? 0} failed emails.`);
    } else {
      toast("error", "Could not retry", data.message || "Error.");
    }
  } catch {
    toast("error", "Could not retry", "Network error.");
  } finally {
    sendingAll.value = false;
    await Promise.all([loadStats(), loadRegistrations()]);
  }
};

const downloadCsv = (scope) => {
  const qs = new URLSearchParams({
    scope,
    search: search.value,
    status: statusFilter.value,
    template: emailView.value,
  });
  window.location.href = `/api/admin/export?${qs}`;
};

// ── Workshops CRUD ──────────────────────────────────────────────────────────
const WORKSHOP_STATUSES = ["upcoming", "live", "completed", "cancelled"];
const showWorkshopForm = ref(false);

const toggleWorkshopDrawer = () => {
  showWorkshopForm.value = !showWorkshopForm.value;
  if (!showWorkshopForm.value && editing.value) resetWorkshopForm();
};

const blankWorkshop = () => ({
  title: "",
  description: "",
  speaker: "",
  speaker_role: "",
  starts_at: "",
  duration_mins: 90,
  location: "Online",
  seats: "",
  status: "upcoming",
  is_published: true,
  meeting_link: "",
});

const updatingId = ref(null);

const needsLink = (w) => {
  if (w.status === "completed" || w.status === "cancelled") return false;
  if (w.status === "live") return true;
  const hoursAway = (new Date(w.starts_at).getTime() - Date.now()) / 3.6e6;
  return hoursAway <= 24;
};

const patchWorkshop = async (w, changes, successTitle, successBody = "") => {
  updatingId.value = w.id;
  try {
    const res = await fetch(`/api/workshops?id=${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) {
      toast("error", "Could not update", data.message || "Not saved.");
      return null;
    }
    toast("success", successTitle, successBody);
    await loadWorkshops();
    return data.workshop;
  } catch {
    toast("error", "Could not update", "Network error.");
    return null;
  } finally {
    updatingId.value = null;
  }
};

const changeStatus = async (w, status) => {
  if (status === w.status) return;

  if (status === "live" && !w.meeting_link) {
    const proceed = window.confirm(`"${w.title}" has no meeting link yet. Mark live anyway?`);
    if (!proceed) {
      await loadWorkshops();
      return;
    }
  }

  if (status === "cancelled" && !window.confirm(`Cancel "${w.title}"?`)) {
    await loadWorkshops();
    return;
  }

  await patchWorkshop(w, { status }, `Status: ${status}`);
};

const togglePublished = (w) =>
  patchWorkshop(
    w,
    { is_published: !w.is_published },
    w.is_published ? "Unpublished" : "Published",
  );

const sendingLinkId = ref(null);
const sendProgress = ref(null);
const testWorkshop = ref(null);
const testEmail = ref("");
const sendingTest = ref(false);

const openTest = (w) => {
  testWorkshop.value = w;
  if (!testEmail.value) testEmail.value = "";
};

const sendTest = async () => {
  const w = testWorkshop.value;
  if (!w) return;

  sendingTest.value = true;
  try {
    const res = await fetch("/api/admin/send-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopId: w.id,
        testEmail: testEmail.value.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok && data.test) {
      toast("success", `Test sent to ${data.to}`);
    } else {
      reportSendResult(data, "");
    }
  } catch {
    toast("error", "Could not send test", "Network error.");
  } finally {
    sendingTest.value = false;
    await loadStats();
  }
};

const sendLink = async (w, { resendAll = false } = {}) => {
  const count = stats.value?.totals.registrations ?? 0;
  const who = `${count} registered attendee${count === 1 ? "" : "s"}`;

  const message = resendAll
    ? `Resend meeting link for "${w.title}" to ALL ${who}?`
    : `Email meeting link for "${w.title}" to ${who}?`;

  if (!window.confirm(message)) return;

  sendingLinkId.value = w.id;
  try {
    const MAX_PASSES = 12;
    let data = {};
    let totalSent = 0;

    for (let pass = 0; pass < MAX_PASSES; pass++) {
      const res = await fetch("/api/admin/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: w.id,
          resendAll: resendAll && pass === 0,
        }),
      });

      data = await res.json().catch(() => ({}));
      if (!data.ok) break;

      const s = data.summary || {};
      totalSent += s.sent ?? 0;
      if (!data.remaining || !(s.sent ?? 0)) break;
      sendProgress.value = { sent: totalSent, remaining: data.remaining };
    }

    sendProgress.value = null;
    if (data.ok) {
      toast("success", `Dispatched meeting link — ${totalSent} emails sent.`);
    } else {
      reportSendResult(data, "");
    }
  } catch {
    toast("error", "Could not send link", "Network error.");
  } finally {
    sendingLinkId.value = null;
    await Promise.all([loadWorkshops(), loadStats(), loadRegistrations()]);
  }
};

const wForm = reactive(blankWorkshop());
const editing = ref(null);
const savingWorkshop = ref(false);

const resetWorkshopForm = () => {
  Object.assign(wForm, blankWorkshop());
  editing.value = null;
  showWorkshopForm.value = false;
};

const toLocalInput = (iso) => toZonedInput(iso);

const editWorkshop = (w) => {
  Object.assign(wForm, {
    title: w.title,
    description: w.description,
    speaker: w.speaker,
    speaker_role: w.speaker_role,
    starts_at: toLocalInput(w.starts_at),
    duration_mins: w.duration_mins,
    location: w.location,
    seats: w.seats ?? "",
    status: w.status,
    is_published: w.is_published,
    meeting_link: w.meeting_link || "",
  });
  editing.value = w.id;
  showWorkshopForm.value = true;
};

const saveWorkshop = async () => {
  if (!wForm.title.trim()) {
    toast("error", "Title is required");
    return;
  }
  const startsAtIso = fromZonedInput(wForm.starts_at);
  if (!startsAtIso) {
    toast("error", "Valid start date required");
    return;
  }

  savingWorkshop.value = true;
  try {
    const payload = { ...wForm, starts_at: startsAtIso };
    if (payload.seats === "" || payload.seats == null) payload.seats = null;

    const url = editing.value ? `/api/workshops?id=${editing.value}` : "/api/workshops";
    const res = await fetch(url, {
      method: editing.value ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", editing.value ? "Workshop updated" : "Workshop created");
      resetWorkshopForm();
      await Promise.all([loadWorkshops(), loadStats()]);
    } else {
      toast("error", "Could not save", data.message || "Error.");
    }
  } catch {
    toast("error", "Could not save", "Network error.");
  } finally {
    savingWorkshop.value = false;
  }
};

const deleteWorkshop = async (w) => {
  if (!window.confirm(`Delete "${w.title}"?`)) return;
  try {
    const res = await fetch(`/api/workshops?id=${w.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", "Workshop deleted");
      await Promise.all([loadWorkshops(), loadStats()]);
    } else {
      toast("error", "Could not delete", data.message || "");
    }
  } catch {
    toast("error", "Could not delete", "Network error.");
  }
};

// ── Team CRUD ───────────────────────────────────────────────────────────────
const members = ref([]);
const memberFile = ref(null);
const savingMember = ref(false);
const memberError = ref("");
const showTeamForm = ref(false);
const tForm = reactive({ name: "", role: "", bio: "", image: "" });

const loadMembers = async () => {
  try {
    const res = await fetch("/api/team-members");
    const data = await res.json().catch(() => ({}));
    if (data.ok) members.value = data.members || [];
  } catch {
    /* empty */
  }
};

const resizeImage = (file, max = 400) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const pickImage = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  memberError.value = "";

  if (!file.type.startsWith("image/")) {
    memberError.value = "Choose an image file.";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    memberError.value = "Image over 2MB.";
    return;
  }

  try {
    tForm.image = await resizeImage(file);
  } catch (error) {
    memberError.value = error.message;
  }
};

const clearImage = () => {
  tForm.image = "";
  if (memberFile.value) memberFile.value.value = "";
};

const saveMember = async () => {
  memberError.value = "";
  savingMember.value = true;
  try {
    const res = await fetch("/api/team-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tForm.name.trim(),
        role: tForm.role.trim(),
        bio: tForm.bio.trim(),
        focus: ["Core Builder", "Collaborator"],
        image: tForm.image,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", "Team member saved");
      Object.assign(tForm, { name: "", role: "", bio: "", image: "" });
      if (memberFile.value) memberFile.value.value = "";
      showTeamForm.value = false;
      await loadMembers();
    } else {
      memberError.value = data.message || "Could not save.";
    }
  } catch {
    memberError.value = "Network error.";
  } finally {
    savingMember.value = false;
  }
};

const deleteMember = async (m) => {
  if (!window.confirm(`Remove ${m.name}?`)) return;
  try {
    const res = await fetch(`/api/team-members?id=${m.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", "Team member removed");
      await loadMembers();
    } else {
      toast("error", "Could not remove", data.message || "");
    }
  } catch {
    toast("error", "Could not remove", "Network error.");
  }
};

// ── Canva OAuth Callback ────────────────────────────────────────────────────
const route = useRoute();
const router = useRouter();
let pendingCanva =
  route.path === "/admin/canva/callback"
    ? {
        code: route.query.code,
        state: route.query.state,
        error: route.query.error,
      }
    : null;
if (pendingCanva) tab.value = "certificates";

const finishCanvaConnect = async () => {
  if (!pendingCanva) return;
  const { code, state, error } = pendingCanva;
  pendingCanva = null;
  router.replace("/admin");

  if (error) {
    toast("warn", "Canva connect cancelled", String(error));
    return;
  }
  const data = await apiPost("/api/admin/canva", {
    op: "callback",
    code,
    state,
  });
  if (data.ok) {
    toast("success", "Canva connected", data.displayName ? `As ${data.displayName}` : "");
  } else {
    toast("error", "Could not connect Canva", data.message, 10000);
  }
  certificatesTab.value?.reload();
};

watch(authed, (value) => {
  if (value) finishCanvaConnect();
});

// ── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  document.title = "Admin Console — SkillSprint";
  checkAuth();
  ticker = setInterval(() => {
    now.value = Date.now();
  }, 10_000);
});

onUnmounted(() => clearInterval(ticker));
</script>
