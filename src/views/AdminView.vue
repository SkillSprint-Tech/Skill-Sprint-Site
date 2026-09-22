<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
    <!-- Spatial Ambient Backlight (Subtle soft blue light originating from the top) -->
    <div
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent blur-3xl"
      ></div>
      <div
        class="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl"
      ></div>
    </div>

    <!-- ═══════════════════ LOGIN SCREEN ═══════════════════ -->
    <div
      v-if="!authed"
      class="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden"
    >
      <!-- Spatial ambient glow spheres -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div class="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[90px]"></div>
      </div>

      <div class="w-full max-w-sm relative z-10">
        <!-- Logo & Header -->
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 border border-blue-400/30 mb-3.5 transform transition-transform hover:scale-105"
          >
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-xl font-extrabold text-white tracking-tight">
            SkillSprint Console
          </h1>
          <p class="text-slate-400 text-xs mt-1 font-sans">
            Enter administrative credentials to proceed
          </p>
        </div>

        <form
          @submit.prevent="login"
          class="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col gap-4"
        >
          <div class="flex flex-col gap-1.5">
            <label
              for="password"
              class="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••••••"
              autofocus
              class="bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus-visible:outline-2 focus-visible:outline-blue-500 focus:border-blue-500/50 transition-all font-mono"
            />
          </div>

          <div
            v-if="loginError"
            class="p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2"
          >
            <svg class="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="8" r="6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 5v3m0 2.5h.01" />
            </svg>
            <span>{{ loginError }}</span>
          </div>

          <button
            type="submit"
            :disabled="loggingIn"
            class="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] mt-1"
          >
            <svg
              v-if="loggingIn"
              class="w-3.5 h-3.5 animate-spin text-white"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" class="opacity-25" />
              <path d="M8 2a6 6 0 016 6" stroke="currentColor" stroke-width="2" class="opacity-75" />
            </svg>
            <span>{{ loggingIn ? "Verifying…" : "Sign In" }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- ═══════════════════ DASHBOARD SHELL ═══════════════════ -->
    <div v-else class="min-h-screen flex flex-col relative z-10">
      <!-- Top Navigation Bar -->
      <header
        class="bg-white/80 border-b border-slate-200/70 sticky top-0 z-30 shadow-[0_2px_10px_0_rgba(0,0,0,0.03)] backdrop-blur-xl"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-14 gap-4">
            <!-- Brand & Context Trail -->
            <div class="flex items-center gap-2.5">
              <div
                class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/30 border border-blue-500/30"
              >
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div class="flex items-center gap-1.5 text-xs">
                <span class="font-extrabold text-slate-900 tracking-tight">
                  SkillSprint
                </span>
                <span class="text-slate-300">/</span>
                <span class="font-mono text-blue-600 font-semibold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  Console
                </span>
              </div>

              <!-- Database Active Pill -->
              <span
                class="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 px-2 py-0.5 rounded-full ml-1"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                DB Live
              </span>
            </div>

            <!-- Right Controls: Live Time, Refresh, Sign Out -->
            <div class="flex items-center gap-2">
              <!-- Live Site Time in PKT -->
              <div
                class="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50/80 border border-slate-200/70 px-2.5 py-1 rounded-lg"
                title="Current site schedule time (PKT UTC+5)"
              >
                <svg class="w-3 h-3 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="8" cy="8" r="6" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 4.5v4l2.5 1.5" />
                </svg>
                <span>{{ currentSiteTime }}</span>
              </div>

              <!-- Refresh Button -->
              <button
                @click="refreshAll"
                :disabled="loading"
                class="inline-flex items-center gap-1.5 border border-slate-200/80 bg-white hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50 shadow-2xs active:scale-[0.98]"
                title="Refresh registrations and metrics"
              >
                <svg
                  class="w-3.5 h-3.5 text-slate-500 transition-transform duration-500"
                  :class="{ 'animate-spin': loading }"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 8A5.5 5.5 0 118 2.5a5.48 5.48 0 013.9 1.6L14 6m0 0v-4m0 4h-4" />
                </svg>
                <span class="hidden sm:inline">{{ loading ? "Syncing…" : "Refresh" }}</span>
              </button>

              <!-- Sign Out -->
              <button
                @click="logout"
                class="inline-flex items-center gap-1 border border-slate-200/80 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5H3a1 1 0 01-1-1v-9a1 1 0 011-1h3m4 8.5l3.5-3.5L10 5m3.5 3.5H6" />
                </svg>
                <span class="hidden sm:inline">Sign out</span>
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
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-[0.98]"
              :class="
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
              "
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="t.id === 'people'" stroke-linecap="round" stroke-linejoin="round" d="M10.5 13.5v-1a2.5 2.5 0 00-2.5-2.5H4a2.5 2.5 0 00-2.5 2.5v1m9-7a2 2 0 11-4 0 2 2 0 014 0zm3.5 7v-.5a2.5 2.5 0 00-2-2.45M12 4.5a2 2 0 010 3.9" />
                <path v-else-if="t.id === 'workshops'" stroke-linecap="round" stroke-linejoin="round" d="M2.5 5.5h11m-11 0v7a1 1 0 001 1h9a1 1 0 001-1v-7m-11 0a1 1 0 011-1h9a1 1 0 011 1M5 2.5v2m6-2v2" />
                <path v-else-if="t.id === 'team'" stroke-linecap="round" stroke-linejoin="round" d="M8 2.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.7l4-.6L8 2.5z" />
                <path v-else-if="t.id === 'certificates'" stroke-linecap="round" stroke-linejoin="round" d="M13.5 10V4.5a1 1 0 00-1-1h-9a1 1 0 00-1 1V10m0 0l5.5 3.5L13.5 10zM5.5 7.5h5" />
              </svg>
              <span>{{ t.label }}</span>
              <span
                v-if="t.count != null"
                class="px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold"
                :class="
                  tab === t.id
                    ? 'bg-blue-500 text-white'
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

          <!-- Collapsible Analytics & Trends Drawer -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-if="showAnalytics" class="mb-3">
              <AdminMetricsChart
                :trend="stats?.trend"
                :top-universities="stats?.topUniversities"
                :stats="stats"
              />
            </div>
          </transition>

          <!-- Compact Operational Toolbar (Above the Table) -->
          <div
            class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-3 mb-3.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3"
          >
            <!-- Left: Scope Selector + Search Input -->
            <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Scope:
                </span>
                <select
                  v-model="emailView"
                  @change="onEmailViewChange"
                  class="border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-slate-50/80 text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
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

              <!-- Search input with clean search SVG -->
              <div class="relative flex-1 min-w-[180px] max-w-sm">
                <input
                  v-model="search"
                  @input="debouncedLoad"
                  type="search"
                  placeholder="Filter name, email, university…"
                  class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200/80 bg-slate-50/70 focus:bg-white text-slate-900 placeholder-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 focus:border-blue-400 transition-all"
                />
                <svg
                  class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 10.5L14 14" />
                </svg>
              </div>
            </div>

            <!-- Right: Action Buttons Group -->
            <div class="flex items-center gap-2">
              <button
                @click="sendAll"
                :disabled="sendingAll || !stats?.email.notReceived"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
              >
                <svg
                  v-if="sendingAll"
                  class="w-3 h-3 animate-spin text-white"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" class="opacity-25" />
                  <path d="M8 2a6 6 0 016 6" stroke="currentColor" stroke-width="2" class="opacity-75" />
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
                class="border border-amber-300/80 bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                title="Requeue failed emails"
              >
                Retry Failed ({{ stats.email.failed }})
              </button>

              <!-- Export CSV Dropdown -->
              <div class="flex items-center border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs font-mono text-xs bg-white">
                <button
                  @click="downloadCsv('view')"
                  class="bg-white hover:bg-blue-50/60 hover:text-blue-700 text-slate-700 px-2.5 py-1.5 font-semibold transition-colors border-r border-slate-200/80 cursor-pointer"
                  title="Download current filtered list as CSV"
                >
                  CSV
                </button>
                <button
                  @click="downloadCsv('all')"
                  class="bg-white hover:bg-blue-50/60 hover:text-blue-700 text-slate-500 hover:text-slate-700 px-2 py-1.5 font-semibold transition-colors cursor-pointer"
                  title="Export complete database registrations"
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <!-- Registrations Table (Starts Immediately Above The Fold!) -->
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
            @toggle-attended="toggleAttendeeCheckIn"
            @open-scanner="showQrScanner = true"
          />

          <!-- Attendee Detail Slide-Over Inspector Drawer -->
          <AdminAttendeeDrawer
            :attendee="inspectedAttendee"
            :sending-id="sendingId"
            :short-date="shortDate"
            @close="inspectedAttendee = null"
            @send-one="sendOne"
            @toggle-attended="toggleAttendeeCheckIn"
          />

          <!-- Live QR Check-in Scanner Modal -->
          <AdminQrScannerModal
            v-if="showQrScanner"
            :toast="toast"
            @close="showQrScanner = false"
            @checked-in="onQrCheckedIn"
          />
        </div>

        <!-- ═══════════════════ WORKSHOPS TAB ═══════════════════ -->
        <div v-show="tab === 'workshops'">
          <!-- Top Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <h2 class="text-sm font-bold text-slate-900 tracking-tight">
                Workshops & Sessions
              </h2>
              <p class="text-[11px] text-slate-400">
                Manage schedule, meeting links, and public visibility
              </p>
            </div>

            <button
              type="button"
              @click="toggleWorkshopDrawer"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-xs shadow-blue-500/25 cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>{{ showWorkshopForm ? "Hide Form" : "+ Add Workshop" }}</span>
            </button>
          </div>

          <!-- Collapsible Add/Edit Workshop Drawer -->
          <div
            v-if="showWorkshopForm"
            class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 mb-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all"
          >
            <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-xs">
                {{ editing ? "Edit Workshop" : "Add a New Workshop" }}
              </h3>
              <button
                type="button"
                @click="resetWorkshopForm"
                class="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form @submit.prevent="saveWorkshop" class="grid gap-3.5 sm:grid-cols-2">
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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

              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Description
                </label>
                <textarea
                  v-model="wForm.description"
                  rows="2"
                  :class="adminInput"
                  placeholder="What attendees will learn."
                ></textarea>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Starts at *
                  <span class="text-blue-600 font-normal">({{ SITE_TIME_ZONE_LABEL }})</span>
                </label>
                <input
                  v-model="wForm.starts_at"
                  type="datetime-local"
                  required
                  :class="adminInput"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Speaker
                </label>
                <input v-model="wForm.speaker" type="text" :class="adminInput" placeholder="Ali Raza" />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Focus Area / Role
                </label>
                <input
                  v-model="wForm.speaker_role"
                  type="text"
                  :class="adminInput"
                  placeholder="Senior Solutions Architect"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Location
                </label>
                <input
                  v-model="wForm.location"
                  type="text"
                  :class="adminInput"
                  placeholder="Online — Google Meet"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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

              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Meeting Link <span class="text-emerald-700 font-normal">· Confidential</span>
                </label>
                <input
                  v-model="wForm.meeting_link"
                  type="url"
                  :class="adminInput"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
                <span class="text-[10px] text-slate-400">
                  Only emailed to registered attendees when you click <strong>Send link</strong>.
                </span>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Status
                </label>
                <select v-model="wForm.status" :class="adminInput">
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div class="flex items-center pt-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="wForm.is_published"
                    type="checkbox"
                    class="w-3.5 h-3.5 rounded text-slate-900 focus:ring-slate-900/20 cursor-pointer"
                  />
                  <span class="text-xs text-slate-800 font-medium">
                    Published on /workshops page
                  </span>
                </label>
              </div>

              <!-- ─── Post-Event Resource Hub Inputs ─── -->
              <div class="sm:col-span-2 pt-3 border-t border-slate-100 space-y-2">
                <span class="text-[11px] font-bold text-slate-800 block">
                  Post-Event Resources & Materials (Public on /workshops)
                </span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Recording URL (YouTube/Loom)
                    </label>
                    <input
                      v-model="wForm.recording_url"
                      type="url"
                      :class="adminInput"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Slides URL (Canva/Google Slides)
                    </label>
                    <input
                      v-model="wForm.slides_url"
                      type="url"
                      :class="adminInput"
                      placeholder="https://docs.google.com/..."
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      GitHub Repo URL
                    </label>
                    <input
                      v-model="wForm.repo_url"
                      type="url"
                      :class="adminInput"
                      placeholder="https://github.com/SkillSprint-Tech/..."
                    />
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2 flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  :disabled="savingWorkshop"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs shadow-blue-500/25 active:scale-[0.98]"
                >
                  {{ savingWorkshop ? "Saving…" : editing ? "Save Changes" : "Create Workshop" }}
                </button>
                <button
                  type="button"
                  @click="resetWorkshopForm"
                  class="text-slate-500 text-xs font-medium hover:text-slate-800 px-3 py-1.5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Test Send Box -->
          <div
            v-if="testWorkshop"
            class="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 mb-4 shadow-2xs"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 class="font-bold text-slate-900 text-xs">
                  Send Test Email for “{{ testWorkshop.title }}”
                </h3>
                <p class="text-slate-500 text-[11px] mt-0.5">
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

            <form @submit.prevent="sendTest" class="flex flex-wrap items-center gap-2 mt-2">
              <input
                v-model="testEmail"
                type="email"
                required
                placeholder="your.email@example.com"
                class="flex-1 min-w-[240px] border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
              />
              <button
                type="submit"
                :disabled="sendingTest"
                class="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer active:scale-[0.98] shadow-xs shadow-blue-500/25"
              >
                {{ sendingTest ? "Sending…" : "Dispatch Test" }}
              </button>
            </form>
          </div>

          <!-- Workshops Table -->
          <div class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/80">
                    <th
                      v-for="h in ['Starts At', 'Workshop', 'Status', 'Site Visibility', 'Meeting Link', 'Actions']"
                      :key="h"
                      class="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="!workshops.length">
                    <td colspan="6" class="px-4 py-12 text-center text-slate-400 text-xs">
                      No workshops scheduled yet. Click "+ Add Workshop" to schedule one.
                    </td>
                  </tr>

                  <tr
                    v-for="w in workshops"
                    :key="w.id"
                    class="hover:bg-slate-50/70 transition-colors"
                  >
                    <td class="px-3.5 py-2.5 text-slate-500 font-mono text-[11px] whitespace-nowrap tabular-nums">
                      {{ shortDate(w.starts_at) }}
                    </td>

                    <td class="px-3.5 py-2.5">
                      <div class="font-semibold text-slate-900 leading-tight">
                        {{ w.title }}
                      </div>
                      <div v-if="w.speaker" class="text-[11px] text-slate-400 mt-0.5">
                        {{ w.speaker }}
                        <span v-if="w.speaker_role" class="text-slate-400">· {{ w.speaker_role }}</span>
                      </div>
                      <!-- Post-event resources indicator chips -->
                      <div v-if="w.recording_url || w.slides_url || w.repo_url" class="flex flex-wrap items-center gap-1 mt-1.5">
                        <span v-if="w.recording_url" class="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200/60 font-mono">🎥 Video</span>
                        <span v-if="w.slides_url" class="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200/60 font-mono">📑 Slides</span>
                        <span v-if="w.repo_url" class="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-mono">💻 Code</span>
                      </div>
                    </td>

                    <td class="px-3.5 py-2.5 whitespace-nowrap">
                      <select
                        :value="w.status"
                        @change="changeStatus(w, $event.target.value)"
                        :disabled="updatingId === w.id"
                        class="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wide border-0 cursor-pointer disabled:opacity-50"
                        :class="statusClass(w.status)"
                      >
                        <option v-for="opt in WORKSHOP_STATUSES" :key="opt" :value="opt">
                          {{ opt }}
                        </option>
                      </select>
                    </td>

                    <td class="px-3.5 py-2.5 whitespace-nowrap">
                      <button
                        @click="togglePublished(w)"
                        :disabled="updatingId === w.id"
                        class="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                        :class="w.is_published ? 'text-emerald-700' : 'text-slate-400'"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full"
                          :class="w.is_published ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-300'"
                        ></span>
                        {{ w.is_published ? "Live" : "Draft" }}
                      </button>
                    </td>

                    <td class="px-3.5 py-2.5 whitespace-nowrap">
                      <span
                        v-if="!w.meeting_link"
                        class="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded"
                        :class="needsLink(w) ? 'bg-amber-100 text-amber-800' : 'text-slate-400'"
                      >
                        {{ needsLink(w) ? "Not set" : "Not set" }}
                      </span>
                      <div v-else>
                        <span class="text-[11px] text-emerald-700 font-semibold font-mono">Ready</span>
                        <div v-if="w.link_sent_at" class="text-[10px] text-slate-400 font-mono">
                          Sent {{ shortDate(w.link_sent_at) }}
                        </div>
                        <div
                          v-else
                          class="text-[10px] font-semibold"
                          :class="needsLink(w) ? 'text-amber-700' : 'text-slate-400'"
                        >
                          Not emailed
                        </div>
                      </div>
                    </td>

                    <td class="px-3.5 py-2.5 whitespace-nowrap text-xs">
                      <div class="flex items-center gap-2.5">
                        <button
                          @click="sendLink(w)"
                          :disabled="sendingLinkId === w.id || !w.meeting_link"
                          class="text-emerald-700 font-semibold hover:text-emerald-900 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer"
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
                          class="text-amber-700 font-semibold hover:text-amber-900 disabled:text-slate-300 cursor-pointer"
                          title="Resend to all registered"
                        >
                          Resend all
                        </button>
                        <button
                          @click="openTest(w)"
                          :disabled="!w.meeting_link"
                          class="text-slate-600 font-semibold hover:text-slate-900 disabled:text-slate-300 cursor-pointer"
                        >
                          Test
                        </button>
                        <button
                          @click="editWorkshop(w)"
                          class="text-slate-600 font-semibold hover:text-slate-900 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteWorkshop(w)"
                          class="text-rose-600 font-semibold hover:text-rose-800 cursor-pointer"
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
          <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <h2 class="text-sm font-bold text-slate-900 tracking-tight">
                Core Team Roster
              </h2>
              <p class="text-[11px] text-slate-400">
                Manage team profiles shown on the public /team page
              </p>
            </div>

            <button
              type="button"
              @click="openAddMember"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-xs shadow-blue-500/25 cursor-pointer active:scale-[0.98]"
            >
              {{ showTeamForm && !editingMemberId ? "Hide Form" : "+ Add Member" }}
            </button>
          </div>

          <!-- Collapsible Add/Edit Member Drawer -->
          <div
            v-if="showTeamForm"
            class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl p-5 mb-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
          >
            <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span>{{ editingMemberId ? "Edit Team Member" : "Add Team Member" }}</span>
                <span v-if="editingMemberId" class="text-[10px] font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Editing
                </span>
              </h3>
              <button
                type="button"
                @click="cancelMemberForm"
                class="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form @submit.prevent="saveMember" class="grid gap-3.5 sm:grid-cols-2">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Name *</label>
                <input
                  v-model="tForm.name"
                  type="text"
                  required
                  :class="adminInput"
                  placeholder="Ayesha Khan"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Role *</label>
                <input
                  v-model="tForm.role"
                  type="text"
                  required
                  :class="adminInput"
                  placeholder="Core Engineering Lead"
                />
              </div>

              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Bio *</label>
                <textarea
                  v-model="tForm.bio"
                  rows="3"
                  required
                  :class="adminInput"
                  placeholder="What they contribute to the initiative."
                ></textarea>
              </div>

              <div class="flex flex-col gap-1 sm:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Photo</label>
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs"
                  >
                    <img
                      v-if="tForm.image"
                      :src="tForm.image"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <svg v-else class="w-4 h-4 text-slate-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="8" cy="5" r="3" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4" />
                    </svg>
                  </div>
                  <div class="flex flex-col gap-1">
                    <input
                      ref="memberFile"
                      type="file"
                      accept="image/*"
                      @change="pickImage"
                      class="text-xs text-slate-600 file:mr-2.5 file:py-1 file:px-2 file:rounded file:border file:border-slate-200 file:bg-white file:text-xs file:font-medium file:text-slate-700 cursor-pointer"
                    />
                    <span class="text-[10px] text-slate-400">
                      JPG/PNG under 2MB. Optimized to 400px.
                    </span>
                    <button
                      v-if="tForm.image"
                      type="button"
                      @click="clearImage"
                      class="text-rose-600 text-[10px] font-semibold text-left hover:text-rose-800 cursor-pointer"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2 flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  :disabled="savingMember"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs shadow-blue-500/25 active:scale-[0.98]"
                >
                  {{ savingMember ? "Saving…" : (editingMemberId ? "Save Changes" : "Save Member") }}
                </button>
                <button
                  v-if="editingMemberId"
                  type="button"
                  @click="cancelMemberForm"
                  class="text-xs text-slate-500 hover:text-slate-700 font-semibold px-3 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <span v-if="memberError" class="text-rose-600 text-xs font-semibold">
                  {{ memberError }}
                </span>
              </div>
            </form>
          </div>

          <!-- Team Table -->
          <div class="bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/80">
                    <th
                      v-for="h in ['Order', '', 'Member', 'Role', 'Bio', 'Actions']"
                      :key="h"
                      class="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="!members.length">
                    <td colspan="6" class="px-4 py-12 text-center text-slate-400 text-xs">
                      No team members added yet. Click "+ Add Member" to add someone.
                    </td>
                  </tr>

                  <tr
                    v-for="(m, idx) in members"
                    :key="m.id"
                    class="hover:bg-slate-50/70 transition-colors"
                    :class="{ 'bg-blue-50/40': editingMemberId === m.id }"
                  >
                    <!-- Order Reorder Controls -->
                    <td class="px-3 py-2.5 w-16 whitespace-nowrap">
                      <div class="flex items-center gap-1.5">
                        <span class="text-[11px] font-mono text-slate-400 w-4 text-center">{{ idx + 1 }}</span>
                        <div class="flex flex-col">
                          <button
                            type="button"
                            :disabled="idx === 0 || reordering"
                            @click="moveMember(idx, -1)"
                            title="Move Up"
                            class="text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer p-0.5"
                          >
                            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                              <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                              <path fill-rule="evenodd" d="M4.646 6.854a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 4.207 5.354 6.854a.5.5 0 0 1-.708 0z"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            :disabled="idx === members.length - 1 || reordering"
                            @click="moveMember(idx, 1)"
                            title="Move Down"
                            class="text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400 cursor-pointer p-0.5"
                          >
                            <svg class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                              <path fill-rule="evenodd" d="M8 12.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 1 0v8a.5.5 0 0 1-.5.5z"/>
                              <path fill-rule="evenodd" d="M11.354 9.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L8 11.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td class="px-3.5 py-2.5 w-10">
                      <div
                        class="w-7 h-7 rounded bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-2xs"
                      >
                        <img
                          v-if="m.image"
                          :src="m.image"
                          alt=""
                          class="w-full h-full object-cover"
                        />
                        <svg v-else class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                          <circle cx="8" cy="5" r="3" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4" />
                        </svg>
                      </div>
                    </td>

                    <td class="px-3.5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                      {{ m.name }}
                    </td>

                    <td class="px-3.5 py-2.5 text-slate-600 whitespace-nowrap font-medium">
                      {{ m.role }}
                    </td>

                    <td class="px-3.5 py-2.5 text-slate-400 text-[11px] max-w-md truncate" :title="m.bio">
                      {{ m.bio }}
                    </td>

                    <td class="px-3.5 py-2.5 whitespace-nowrap">
                      <div class="flex items-center gap-2.5">
                        <button
                          @click="editMember(m)"
                          class="text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <span class="text-slate-200">|</span>
                        <button
                          @click="deleteMember(m)"
                          class="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
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

        <!-- ═══════════════════ CERTIFICATES TAB ═══════════════════ -->
        <div v-if="certificatesOpened" v-show="tab === 'certificates'">
          <CertificatesTab ref="certificatesTab" :toast="toast" />
        </div>
      </main>
    </div>

    <!-- ═══════════════════ TOAST NOTIFICATIONS ═══════════════════ -->
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="border rounded-lg px-3 py-2 shadow-xl text-xs transition-all flex items-start gap-2 backdrop-blur-md"
        :class="toastClass(t.kind)"
      >
        <svg v-if="t.kind === 'success'" class="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8.5l3 3 6-6" />
        </svg>
        <svg v-else-if="t.kind === 'error'" class="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4l8 8m0-8l-8 8" />
        </svg>
        <svg v-else-if="t.kind === 'warn'" class="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 2l6 12H2L8 2zm0 5v3m0 2h.01" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="8" cy="8" r="6" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 5v3m0 2.5h.01" />
        </svg>
        <div class="flex-1">
          <p class="font-semibold">{{ t.title }}</p>
          <p v-if="t.body" class="text-[10px] leading-relaxed mt-0.5 opacity-80 font-mono">
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
import AdminQrScannerModal from "../components/admin/AdminQrScannerModal.vue";
import { apiPost } from "../utils/adminApi.js";

const adminInput =
  "border border-slate-200/80 rounded-lg px-3 py-2 text-xs text-slate-900 bg-white " +
  "focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors shadow-2xs";

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
    success: "bg-slate-900/95 border-slate-800 text-white shadow-xl shadow-blue-900/10",
    info: "bg-slate-900/95 border-slate-800 text-white shadow-xl",
    warn: "bg-amber-950/95 border-amber-800 text-amber-100 shadow-xl",
    error: "bg-rose-950/95 border-rose-800 text-rose-100 shadow-xl",
  })[kind] || "bg-slate-900/95 border-slate-800 text-white";

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
    body: `A background worker held them without completion.`,
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
    /* silent */
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
const showQrScanner = ref(false);

const toggleAttendeeCheckIn = async (attendee) => {
  const newStatus = !attendee.attended;
  try {
    const res = await fetch("/api/admin/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: attendee.id, attended: newStatus }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", newStatus ? "Checked in" : "Check-in removed", attendee.full_name);
      attendee.attended = newStatus;
      attendee.checked_in_at = newStatus ? new Date().toISOString() : null;
      await loadRegistrations();
    } else {
      toast("error", "Check-in failed", data.message || "");
    }
  } catch {
    toast("error", "Network error during check-in");
  }
};

const onQrCheckedIn = async () => {
  await loadRegistrations();
};

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
    toast("error", "Batch send failed", "Network error.");
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
  recording_url: "",
  slides_url: "",
  repo_url: "",
  resources_notes: "",
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
    recording_url: w.recording_url || "",
    slides_url: w.slides_url || "",
    repo_url: w.repo_url || "",
    resources_notes: w.resources_notes || "",
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
const editingMemberId = ref(null);
const reordering = ref(false);
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

const openAddMember = () => {
  if (showTeamForm.value && !editingMemberId.value) {
    showTeamForm.value = false;
  } else {
    resetTeamForm();
    showTeamForm.value = true;
  }
};

const editMember = (m) => {
  editingMemberId.value = m.id;
  memberError.value = "";
  Object.assign(tForm, {
    name: m.name || "",
    role: m.role || "",
    bio: m.bio || "",
    image: m.image || "",
  });
  showTeamForm.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetTeamForm = () => {
  editingMemberId.value = null;
  memberError.value = "";
  Object.assign(tForm, { name: "", role: "", bio: "", image: "" });
  if (memberFile.value) memberFile.value.value = "";
};

const cancelMemberForm = () => {
  resetTeamForm();
  showTeamForm.value = false;
};

const moveMember = async (index, direction) => {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= members.value.length) return;

  const item = members.value[index];
  members.value.splice(index, 1);
  members.value.splice(targetIndex, 0, item);

  const reorderPayload = members.value.map((m, idx) => ({
    id: m.id,
    sort_order: idx + 1,
  }));

  try {
    reordering.value = true;
    const res = await fetch("/api/team-members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorder: reorderPayload }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) {
      toast("success", "Order saved");
    } else {
      toast("error", "Could not save order", data.message || "");
      await loadMembers();
    }
  } catch {
    toast("error", "Network error updating order");
    await loadMembers();
  } finally {
    reordering.value = false;
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
    const isEdit = Boolean(editingMemberId.value);
    const url = isEdit
      ? `/api/team-members?id=${editingMemberId.value}`
      : "/api/team-members";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
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
      toast("success", isEdit ? "Team member updated" : "Team member added");
      resetTeamForm();
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
