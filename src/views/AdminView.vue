<template>
  <div class="min-h-screen bg-slate-50">

    <!-- ═══════════════════ LOGIN ═══════════════════ -->
    <div v-if="!authed" class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Admin</h1>
          <p class="text-gray-500 text-sm mt-1">SkillSprint workshop registrations</p>
        </div>

        <form @submit.prevent="login" class="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-gray-700 text-sm font-semibold">Password</label>
            <input id="password" v-model="password" type="password" autocomplete="current-password"
                   autofocus
                   class="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900
                          focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors duration-200" />
          </div>
          <p v-if="loginError" class="text-red-600 text-sm">{{ loginError }}</p>
          <button type="submit" :disabled="loggingIn"
                  class="bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700
                         transition-colors duration-200 disabled:opacity-50 cursor-pointer">
            {{ loggingIn ? 'Checking…' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>

    <!-- ═══════════════════ DASHBOARD ═══════════════════ -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Registrations</h1>
          <p class="text-gray-500 text-sm mt-0.5">Workshop signups and email delivery</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="refreshAll" :disabled="loading"
                  class="border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold
                         hover:border-gray-300 transition-colors duration-200 disabled:opacity-50 cursor-pointer">
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
          <button @click="logout"
                  class="border border-gray-200 bg-white text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold
                         hover:border-gray-300 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
            Sign out
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 border-b border-gray-200">
        <button v-for="t in tabs" :key="t.id" @click="tab = t.id"
                class="px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors duration-200 cursor-pointer"
                :class="tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'">
          {{ t.label }}
        </button>
      </div>

      <!-- ─────────── PEOPLE TAB ─────────── -->
      <div v-show="tab === 'people'">

        <!-- Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div v-for="card in summaryCards" :key="card.label"
               class="bg-white border rounded-xl px-4 py-3"
               :class="card.accent || 'border-gray-200'">
            <div class="text-xs font-semibold uppercase tracking-wider mb-1"
                 :class="card.labelClass || 'text-gray-500'">{{ card.label }}</div>
            <div class="text-2xl font-extrabold tabular-nums"
                 :class="card.valueClass || 'text-gray-900'">{{ card.value }}</div>
          </div>
        </div>

        <!-- Quota -->
        <div v-if="stats" class="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-6">
              <div v-for="(q, name) in stats.quota.usage" :key="name" class="flex items-center gap-3">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-700 w-14">{{ name }}</span>
                <div class="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-[width] duration-500"
                       :class="q.remaining === 0 ? 'bg-amber-500' : 'bg-blue-600'"
                       :style="{ width: Math.min(100, (q.used / q.limit) * 100) + '%' }"></div>
                </div>
                <span class="text-xs font-mono tabular-nums text-gray-500">{{ q.used }}/{{ q.limit }}</span>
                <span v-if="!q.configured"
                      class="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  no key
                </span>
              </div>
            </div>
            <span class="text-xs text-gray-400 font-mono">resets {{ resetCountdown }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <input v-model="search" @input="debouncedLoad" type="search"
                 placeholder="Search name, email, university…"
                 class="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-white
                        focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors duration-200" />

          <select v-model="statusFilter" @change="loadRegistrations"
                  class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer
                         focus-visible:outline-2 focus-visible:outline-blue-600">
            <option value="all">All statuses</option>
            <option value="not_received">Not received</option>
            <option value="pending">Pending</option>
            <option value="deferred">Deferred</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="bounced">Bounced</option>
          </select>

          <button @click="sendAll" :disabled="sendingAll || !stats?.email.notReceived"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700
                         transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {{ sendingAll ? 'Sending…' : `Send all pending (${stats?.email.notReceived ?? 0})` }}
          </button>

          <button @click="downloadCsv('view')"
                  class="border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold
                         hover:border-gray-300 transition-colors duration-200 cursor-pointer">
            Download CSV
          </button>
          <button @click="downloadCsv('all')"
                  class="border border-gray-200 bg-white text-gray-500 px-3 py-2 rounded-lg text-xs font-semibold
                         hover:border-gray-300 transition-colors duration-200 cursor-pointer">
            All
          </button>
        </div>

        <!-- Table -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th v-for="h in ['Name', 'Email', 'University', 'Registered', 'Email status', 'Action']" :key="h"
                      class="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="px-4 py-10 text-center text-gray-400 text-sm">Loading…</td>
                </tr>
                <tr v-else-if="!registrations.length">
                  <td colspan="6" class="px-4 py-10 text-center text-gray-400 text-sm">
                    {{ search || statusFilter !== 'all' ? 'Nothing matches that filter.' : 'No registrations yet.' }}
                  </td>
                </tr>
                <tr v-for="r in registrations" :key="r.id"
                    class="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors duration-150">
                  <td class="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ r.full_name }}</td>
                  <td class="px-4 py-3 text-gray-600 font-mono text-xs">{{ r.email }}</td>
                  <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ r.university || '—' }}</td>
                  <td class="px-4 py-3 text-gray-400 text-xs whitespace-nowrap tabular-nums">{{ shortDate(r.created_at) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide"
                          :class="statusClass(r.email_status)">
                      {{ r.email_status }}
                    </span>
                    <span v-if="r.provider" class="ml-1.5 text-[10px] text-gray-400 font-mono">{{ r.provider }}</span>
                    <div v-if="r.last_error" class="text-[11px] text-red-500 mt-1 max-w-xs truncate" :title="r.last_error">
                      {{ r.last_error }}
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <button v-if="r.email_status !== 'delivered'"
                            @click="sendOne(r)" :disabled="sendingId === r.id"
                            class="text-blue-600 text-xs font-bold hover:text-blue-800 transition-colors duration-200
                                   disabled:opacity-40 cursor-pointer">
                      {{ sendingId === r.id ? 'Sending…' : (r.email_status === 'sent' ? 'Resend' : 'Send email') }}
                    </button>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="total > limit" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span class="text-xs text-gray-500 tabular-nums">
              {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }} of {{ total }}
            </span>
            <div class="flex gap-2">
              <button @click="changePage(-1)" :disabled="page === 1"
                      class="px-3 py-1 rounded border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 cursor-pointer">Prev</button>
              <button @click="changePage(1)" :disabled="page * limit >= total"
                      class="px-3 py-1 rounded border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ─────────── WORKSHOPS TAB ─────────── -->
      <div v-show="tab === 'workshops'">
        <div class="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 class="font-extrabold text-gray-900 mb-4">{{ editing ? 'Edit workshop' : 'Add a workshop' }}</h2>
          <form @submit.prevent="saveWorkshop" class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Title *</label>
              <input v-model="wForm.title" type="text" required :class="adminInput" placeholder="Git & GitHub for Beginners" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
              <textarea v-model="wForm.description" rows="2" :class="adminInput"
                        placeholder="What people will actually walk away able to do."></textarea>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Starts at *</label>
              <input v-model="wForm.starts_at" type="datetime-local" required :class="adminInput" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Duration (min)</label>
              <input v-model.number="wForm.duration_mins" type="number" min="15" step="15" :class="adminInput" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Speaker</label>
              <input v-model="wForm.speaker" type="text" :class="adminInput" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Focus area</label>
              <input v-model="wForm.speaker_role" type="text" :class="adminInput"
                     placeholder="CV Writing &amp; Optimisation" />
              <span class="text-[11px] text-gray-400">Shown on the card and in the email.</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Location</label>
              <input v-model="wForm.location" type="text" :class="adminInput" placeholder="Online — Google Meet" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Seats (blank = unlimited)</label>
              <input v-model="wForm.seats" type="number" min="0" :class="adminInput" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">
                Meeting link <span class="text-emerald-600">· private</span>
              </label>
              <input v-model="wForm.meeting_link" type="url" :class="adminInput"
                     placeholder="https://meet.google.com/abc-defg-hij" />
              <span class="text-[11px] text-gray-400">
                Never shown on the public page. Only emailed to registered people when you press
                <strong>Send link</strong>.
              </span>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
              <select v-model="wForm.status" :class="adminInput">
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="wForm.is_published" type="checkbox" class="w-4 h-4 cursor-pointer" />
              <span class="text-sm text-gray-700 font-medium">Published (visible on the site)</span>
            </label>

            <div class="sm:col-span-2 flex items-center gap-2">
              <button type="submit" :disabled="savingWorkshop"
                      class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700
                             transition-colors duration-200 disabled:opacity-50 cursor-pointer">
                {{ savingWorkshop ? 'Saving…' : (editing ? 'Save changes' : 'Add workshop') }}
              </button>
              <button v-if="editing" type="button" @click="resetWorkshopForm"
                      class="text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors duration-200 cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th v-for="h in ['When', 'Title', 'Status', 'Published', 'Meeting link', 'Actions']" :key="h"
                      class="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!workshops.length">
                  <td colspan="6" class="px-4 py-10 text-center text-gray-400 text-sm">
                    No workshops yet. Add one above and it appears on /workshops immediately.
                  </td>
                </tr>
                <tr v-for="w in workshops" :key="w.id" class="border-b border-gray-100 last:border-0">
                  <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap tabular-nums">{{ shortDate(w.starts_at) }}</td>
                  <td class="px-4 py-3 font-semibold text-gray-900">
                    {{ w.title }}
                    <div v-if="w.speaker" class="text-xs font-normal text-gray-400">{{ w.speaker }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <select :value="w.status" @change="changeStatus(w, $event.target.value)"
                            :disabled="updatingId === w.id"
                            class="px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide border-0
                                   cursor-pointer disabled:opacity-50"
                            :class="statusClass(w.status)">
                      <option v-for="opt in WORKSHOP_STATUSES" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <button @click="togglePublished(w)" :disabled="updatingId === w.id"
                            class="text-xs font-bold transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                            :class="w.is_published ? 'text-emerald-600 hover:text-emerald-800' : 'text-gray-400 hover:text-gray-600'"
                            :title="w.is_published ? 'Visible on /workshops — click to unpublish' : 'Hidden from /workshops — click to publish'">
                      {{ w.is_published ? 'Live on site' : 'Draft' }}
                    </button>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="!w.meeting_link"
                          class="text-xs font-semibold"
                          :class="needsLink(w) ? 'text-amber-600' : 'text-gray-400'">
                      {{ needsLink(w) ? '⚠ Not set' : 'Not set' }}
                    </span>
                    <template v-else>
                      <span class="text-xs text-emerald-600 font-semibold">Set</span>
                      <div v-if="w.link_sent_at" class="text-[11px] text-gray-400 tabular-nums">
                        sent {{ shortDate(w.link_sent_at) }}
                      </div>
                      <div v-else class="text-[11px] font-semibold"
                           :class="needsLink(w) ? 'text-amber-600' : 'text-gray-400'">
                        not emailed yet
                      </div>
                    </template>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <button @click="sendLink(w)" :disabled="sendingLinkId === w.id || !w.meeting_link"
                            class="text-emerald-600 text-xs font-bold hover:text-emerald-800 mr-3
                                   disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                            :title="w.meeting_link ? 'Email the link to everyone registered' : 'Add a meeting link first'">
                      {{ sendingLinkId === w.id ? 'Sending…' : (w.link_sent_at ? 'Resend link' : 'Send link') }}
                    </button>
                    <button @click="editWorkshop(w)" class="text-blue-600 text-xs font-bold hover:text-blue-800 mr-3 cursor-pointer">Edit</button>
                    <button @click="deleteWorkshop(w)" class="text-red-500 text-xs font-bold hover:text-red-700 cursor-pointer">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ─────────── TEAM TAB ─────────── -->
      <div v-show="tab === 'team'">
        <div class="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 class="font-extrabold text-gray-900 mb-1">Add a team member</h2>
          <p class="text-gray-500 text-sm mb-4">They appear on the public /team page straight away.</p>

          <form @submit.prevent="saveMember" class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Name *</label>
              <input v-model="tForm.name" type="text" required :class="adminInput" placeholder="Ayesha Khan" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Role *</label>
              <input v-model="tForm.role" type="text" required :class="adminInput" placeholder="Core Engineering Lead" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Bio *</label>
              <textarea v-model="tForm.bio" rows="3" required :class="adminInput"
                        placeholder="What they actually do here."></textarea>
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label class="text-xs font-bold uppercase tracking-wider text-gray-500">Photo</label>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0
                            flex items-center justify-center">
                  <img v-if="tForm.image" :src="tForm.image" alt="" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-300 text-xl" aria-hidden="true">👤</span>
                </div>
                <div class="flex flex-col gap-1">
                  <input ref="memberFile" type="file" accept="image/*" @change="pickImage"
                         class="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg
                                file:border file:border-gray-200 file:bg-white file:text-xs file:font-semibold
                                file:text-gray-700 file:cursor-pointer cursor-pointer" />
                  <span class="text-[11px] text-gray-400">JPG or PNG, under 2MB. Resized to 400px before saving.</span>
                  <button v-if="tForm.image" type="button" @click="clearImage"
                          class="text-red-500 text-[11px] font-bold text-left hover:text-red-700 cursor-pointer">
                    Remove photo
                  </button>
                </div>
              </div>
            </div>

            <div class="sm:col-span-2 flex items-center gap-3">
              <button type="submit" :disabled="savingMember"
                      class="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700
                             transition-colors duration-200 disabled:opacity-50 cursor-pointer">
                {{ savingMember ? 'Saving…' : 'Add member' }}
              </button>
              <span v-if="memberError" class="text-red-600 text-sm">{{ memberError }}</span>
            </div>
          </form>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th v-for="h in ['', 'Name', 'Role', 'Bio', 'Actions']" :key="h"
                      class="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!members.length">
                  <td colspan="5" class="px-4 py-10 text-center text-gray-400 text-sm">
                    No team members yet. Add one above and they appear on /team.
                  </td>
                </tr>
                <tr v-for="m in members" :key="m.id" class="border-b border-gray-100 last:border-0">
                  <td class="px-4 py-3">
                    <div class="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img v-if="m.image" :src="m.image" alt="" class="w-full h-full object-cover" />
                      <span v-else class="text-gray-300 text-xs" aria-hidden="true">👤</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ m.name }}</td>
                  <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ m.role }}</td>
                  <td class="px-4 py-3 text-gray-400 text-xs max-w-md truncate" :title="m.bio">{{ m.bio }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <button @click="deleteMember(m)" class="text-red-500 text-xs font-bold hover:text-red-700 cursor-pointer">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ TOASTS ═══════════════════ -->
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
      <div v-for="t in toasts" :key="t.id"
           class="border rounded-xl px-4 py-3 shadow-lg text-sm"
           :class="toastClass(t.kind)">
        <p class="font-bold mb-0.5">{{ t.title }}</p>
        <p v-if="t.body" class="text-xs leading-relaxed opacity-90">{{ t.body }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const adminInput =
  'border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 bg-white ' +
  'focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors duration-200'

// ── Auth ────────────────────────────────────────────────────────────────────
const authed = ref(false)
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const login = async () => {
  loginError.value = ''
  loggingIn.value = true
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok && data.authenticated) {
      authed.value = true
      password.value = ''
      refreshAll()
    } else {
      loginError.value = data.message || 'Could not sign in.'
    }
  } catch {
    loginError.value = 'Could not reach the server.'
  } finally {
    loggingIn.value = false
  }
}

const logout = async () => {
  await fetch('/api/admin/login', { method: 'DELETE' }).catch(() => {})
  authed.value = false
}

const checkAuth = async () => {
  try {
    const res = await fetch('/api/admin/login')
    const data = await res.json().catch(() => ({}))
    authed.value = Boolean(data.authenticated)
    if (authed.value) refreshAll()
  } catch { /* stay on the login screen */ }
}

// ── Toasts ──────────────────────────────────────────────────────────────────
const toasts = ref([])
let toastSeq = 0

const toast = (kind, title, body = '', ms = 6000) => {
  const id = ++toastSeq
  toasts.value.push({ id, kind, title, body })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, ms)
}

const toastClass = (kind) => ({
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warn: 'bg-amber-50 border-amber-300 text-amber-900',
  error: 'bg-red-50 border-red-200 text-red-900',
}[kind] || 'bg-white border-gray-200 text-gray-900')

// ── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'people', label: 'Registrations' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'team', label: 'Team' },
]
const tab = ref('people')

// ── Data ────────────────────────────────────────────────────────────────────
const stats = ref(null)
const registrations = ref([])
const workshops = ref([])
const total = ref(0)
const page = ref(1)
const limit = 50
const loading = ref(false)
const search = ref('')
const statusFilter = ref('all')

const summaryCards = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  return [
    { label: 'Registered', value: s.totals.registrations },
    { label: 'Last 7 days', value: s.totals.registrations_7d },
    { label: 'Sent', value: s.email.sent },
    { label: 'Delivered', value: s.email.delivered, valueClass: 'text-emerald-600' },
    {
      label: 'Not received', value: s.email.notReceived,
      accent: s.email.notReceived ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200',
      valueClass: s.email.notReceived ? 'text-amber-700' : 'text-gray-900',
    },
    {
      label: 'Failed', value: s.email.failed,
      valueClass: s.email.failed ? 'text-red-600' : 'text-gray-900',
    },
  ]
})

const now = ref(Date.now())
let ticker = null

const resetCountdown = computed(() => {
  if (!stats.value) return '—'
  const ms = new Date(stats.value.quota.resets_at).getTime() - now.value
  if (ms <= 0) return 'now'
  const h = Math.floor(ms / 3.6e6)
  const m = Math.floor((ms % 3.6e6) / 6e4)
  return `in ${h}h ${m}m`
})

const shortDate = (v) =>
  new Date(v).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })

const statusClass = (status) => ({
  delivered: 'bg-emerald-50 text-emerald-700',
  sent: 'bg-blue-50 text-blue-700',
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-gray-100 text-gray-600',
  deferred: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
  bounced: 'bg-red-50 text-red-700',
  upcoming: 'bg-blue-50 text-blue-700',
  live: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-700',
}[status] || 'bg-gray-100 text-gray-600')

// ── Loading ─────────────────────────────────────────────────────────────────
const loadStats = async () => {
  try {
    const res = await fetch('/api/admin/stats')
    const data = await res.json().catch(() => ({}))
    if (data.ok) stats.value = data
  } catch { /* the refresh button surfaces this */ }
}

const loadRegistrations = async () => {
  loading.value = true
  try {
    const qs = new URLSearchParams({
      search: search.value, status: statusFilter.value,
      page: String(page.value), limit: String(limit),
    })
    const res = await fetch(`/api/admin/registrations?${qs}`)
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      registrations.value = data.registrations
      total.value = data.total
    }
  } catch {
    toast('error', 'Could not load registrations', 'Check your connection and try again.')
  } finally {
    loading.value = false
  }
}

const loadWorkshops = async () => {
  try {
    const res = await fetch('/api/workshops?all=1')
    const data = await res.json().catch(() => ({}))
    if (data.ok) workshops.value = data.workshops
  } catch { /* table shows its empty state */ }
}

const refreshAll = () =>
  Promise.all([loadStats(), loadRegistrations(), loadWorkshops(), loadMembers()])

let debounceTimer = null
const debouncedLoad = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; loadRegistrations() }, 300)
}

const changePage = (delta) => {
  page.value = Math.max(1, page.value + delta)
  loadRegistrations()
}

// ── Sending ─────────────────────────────────────────────────────────────────
const sendingId = ref(null)
const sendingAll = ref(false)

/** Shared handling so single and bulk sends report quota exhaustion identically. */
const reportSendResult = (data, successTitle) => {
  if (data.ok && data.code !== 'QUOTA_EXHAUSTED') {
    toast('success', successTitle, data.provider ? `Sent via ${data.provider}.` : '')
    return
  }
  if (data.code === 'QUOTA_EXHAUSTED') {
    const u = data.usage || {}
    const detail = Object.entries(u)
      .filter(([, q]) => q.configured)
      .map(([name, q]) => `${name} ${q.used}/${q.limit}`)
      .join(', ')
    toast('warn', 'Daily limit reached',
      `${detail ? detail + '. ' : ''}Still queued — it will send automatically after the limit resets ${resetCountdown.value}.`, 9000)
    return
  }
  if (data.code === 'NO_PROVIDER') {
    toast('warn', 'No email provider configured',
      'Add RESEND_API_KEY or BREVO_API_KEY. The email stays queued until then.', 9000)
    return
  }
  toast('error', 'Could not send', data.message || 'Unknown error.')
}

const sendOne = async (row) => {
  sendingId.value = row.id
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row.job_id ? { jobId: row.job_id } : { registrationId: row.id }),
    })
    const data = await res.json().catch(() => ({}))
    reportSendResult(data, `Email sent to ${row.full_name}`)
  } catch {
    toast('error', 'Could not send', 'Could not reach the server.')
  } finally {
    sendingId.value = null
    await Promise.all([loadStats(), loadRegistrations()])
  }
}

const sendAll = async () => {
  sendingAll.value = true
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.code === 'QUOTA_EXHAUSTED' || data.code === 'NO_PROVIDER') {
      reportSendResult(data, '')
    } else if (data.ok) {
      const s = data.summary || {}
      toast('success', `Sent ${s.sent ?? 0} email${s.sent === 1 ? '' : 's'}`,
        [s.deferred ? `${s.deferred} deferred` : '', s.failed ? `${s.failed} failed` : '']
          .filter(Boolean).join(' · '))
    } else {
      toast('error', 'Could not send', data.message || 'Unknown error.')
    }
  } catch {
    toast('error', 'Could not send', 'Could not reach the server.')
  } finally {
    sendingAll.value = false
    await Promise.all([loadStats(), loadRegistrations()])
  }
}

const downloadCsv = (scope) => {
  const qs = new URLSearchParams({ scope, search: search.value, status: statusFilter.value })
  window.location.href = `/api/admin/export?${qs}`
}

// ── Workshops CRUD ──────────────────────────────────────────────────────────
const WORKSHOP_STATUSES = ['upcoming', 'live', 'completed', 'cancelled']

const blankWorkshop = () => ({
  title: '', description: '', speaker: '', speaker_role: '',
  starts_at: '', duration_mins: 90, location: 'Online', seats: '',
  status: 'upcoming', is_published: true, meeting_link: '',
})

const updatingId = ref(null)

/**
 * A session people are about to join needs a link. This is what drives the amber warning
 * in the table and the confirmation before going live — a workshop that is live, or
 * starts within the day, and has no link, is not actually ready to run.
 */
const needsLink = (w) => {
  if (w.status === 'completed' || w.status === 'cancelled') return false
  if (w.status === 'live') return true
  const hoursAway = (new Date(w.starts_at).getTime() - Date.now()) / 3.6e6
  return hoursAway <= 24
}

/**
 * Patch a single field and refresh from the server rather than mutating the local row.
 * The row shown in the table is then always what /workshops will serve, so there is no
 * way for the panel to claim a change that did not land.
 */
const patchWorkshop = async (w, changes, successTitle, successBody = '') => {
  updatingId.value = w.id
  try {
    const res = await fetch(`/api/workshops?id=${w.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    })
    const data = await res.json().catch(() => ({}))
    if (!data.ok) {
      toast('error', 'Could not update', data.message || 'The change was not saved.')
      return null
    }
    toast('success', successTitle, successBody)
    await loadWorkshops()
    return data.workshop
  } catch {
    toast('error', 'Could not update', 'Could not reach the server.')
    return null
  } finally {
    updatingId.value = null
  }
}

const changeStatus = async (w, status) => {
  if (status === w.status) return

  // Going live without a join link means registrants get a "we're live" card and nothing
  // to click. Worth stopping for.
  if (status === 'live' && !w.meeting_link) {
    const proceed = window.confirm(
      `"${w.title}" has no meeting link yet.\n\n` +
      'Mark it live anyway? Nobody will have a link to join with until you add one and press Send link.'
    )
    if (!proceed) {
      await loadWorkshops() // put the select back where it was
      return
    }
  }

  if (status === 'cancelled' && !window.confirm(
    `Cancel "${w.title}"?\n\nIt moves to the "Called Off" section on /workshops straight away.`
  )) {
    await loadWorkshops()
    return
  }

  const WHERE_IT_SHOWS = {
    upcoming: "Showing under “What's Coming Up” on /workshops.",
    live: 'Showing as happening now on /workshops.',
    completed: 'Moved to "Already Delivered" on /workshops.',
    cancelled: 'Moved to "Called Off" on /workshops.',
  }

  const updated = await patchWorkshop(w, { status }, `Status set to ${status}`,
    w.is_published ? WHERE_IT_SHOWS[status] : 'Saved — still a draft, so not on the site yet.')

  if (updated && status === 'live' && updated.meeting_link && !updated.link_sent_at) {
    toast('warn', 'Link not emailed yet',
      'This session is live but nobody has been sent the join link. Press Send link.', 9000)
  }
}

const togglePublished = (w) =>
  patchWorkshop(w, { is_published: !w.is_published },
    w.is_published ? 'Unpublished' : 'Published',
    w.is_published ? 'Removed from /workshops.' : "It's on /workshops now.")

// ── Meeting link ────────────────────────────────────────────────────────────
const sendingLinkId = ref(null)

const sendLink = async (w) => {
  const count = stats.value?.totals.registrations ?? 0
  if (!window.confirm(
    `Email the meeting link for "${w.title}" to ${count} registered ${count === 1 ? 'person' : 'people'}?` +
    (w.link_sent_at ? '\n\nAlready sent once — only people who registered since will receive it.' : '')
  )) return

  sendingLinkId.value = w.id
  try {
    const res = await fetch('/api/admin/send-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshopId: w.id }),
    })
    const data = await res.json().catch(() => ({}))

    if (data.code === 'NO_LINK') {
      toast('warn', 'No meeting link set', 'Add one to this workshop first, then send.')
    } else if (data.code === 'QUOTA_EXHAUSTED' || data.code === 'NO_PROVIDER') {
      reportSendResult(data, '')
    } else if (data.ok) {
      const s = data.summary || {}
      toast('success', `Meeting link sent — ${s.sent ?? 0} email${s.sent === 1 ? '' : 's'}`,
        data.newlyQueued === 0
          ? 'Everyone registered had already received it.'
          : `${data.newlyQueued} newly queued.` + (s.deferred ? ` ${s.deferred} deferred.` : ''))
    } else {
      toast('error', 'Could not send the link', data.message || 'Unknown error.')
    }
  } catch {
    toast('error', 'Could not send the link', 'Could not reach the server.')
  } finally {
    sendingLinkId.value = null
    await Promise.all([loadWorkshops(), loadStats(), loadRegistrations()])
  }
}

const wForm = reactive(blankWorkshop())
const editing = ref(null)
const savingWorkshop = ref(false)

const resetWorkshopForm = () => {
  Object.assign(wForm, blankWorkshop())
  editing.value = null
}

/** datetime-local needs `YYYY-MM-DDTHH:mm` in local time, not an ISO UTC string. */
const toLocalInput = (iso) => {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const editWorkshop = (w) => {
  Object.assign(wForm, {
    title: w.title, description: w.description, speaker: w.speaker,
    speaker_role: w.speaker_role, starts_at: toLocalInput(w.starts_at),
    duration_mins: w.duration_mins, location: w.location,
    seats: w.seats ?? '', status: w.status, is_published: w.is_published,
    meeting_link: w.meeting_link || '',
  })
  editing.value = w.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveWorkshop = async () => {
  if (!wForm.title.trim()) {
    toast('error', 'Title is required')
    return
  }
  if (!wForm.starts_at || Number.isNaN(new Date(wForm.starts_at).getTime())) {
    toast('error', 'A valid start date is required')
    return
  }
  // Same check the table's status control makes, applied on the way in.
  if (wForm.status === 'live' && !wForm.meeting_link.trim() && !window.confirm(
    'This workshop is marked live but has no meeting link.\n\nSave anyway?'
  )) return

  savingWorkshop.value = true
  try {
    const payload = { ...wForm, starts_at: new Date(wForm.starts_at).toISOString() }
    if (payload.seats === '' || payload.seats == null) payload.seats = null

    const url = editing.value ? `/api/workshops?id=${editing.value}` : '/api/workshops'
    const res = await fetch(url, {
      method: editing.value ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      const saved = data.workshop || {}
      toast('success', editing.value ? 'Workshop updated' : 'Workshop added',
        wForm.is_published ? "It's on /workshops now." : 'Saved as a draft, not on the site yet.')
      if (saved.meeting_link && !saved.link_sent_at) {
        toast('warn', 'Join link not emailed yet',
          'The link is saved but nobody has received it. Press Send link when you are ready.', 9000)
      }
      resetWorkshopForm()
      await Promise.all([loadWorkshops(), loadStats()])
    } else {
      toast('error', 'Could not save', data.message || 'Check the fields and try again.')
    }
  } catch {
    toast('error', 'Could not save', 'Could not reach the server.')
  } finally {
    savingWorkshop.value = false
  }
}

const deleteWorkshop = async (w) => {
  if (!window.confirm(`Delete "${w.title}"? This cannot be undone.`)) return
  try {
    const res = await fetch(`/api/workshops?id=${w.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      toast('success', 'Workshop deleted')
      await Promise.all([loadWorkshops(), loadStats()])
    } else {
      toast('error', 'Could not delete', data.message || '')
    }
  } catch {
    toast('error', 'Could not delete', 'Could not reach the server.')
  }
}

// ── Team members ────────────────────────────────────────────────────────────
const members = ref([])
const memberFile = ref(null)
const savingMember = ref(false)
const memberError = ref('')
const tForm = reactive({ name: '', role: '', bio: '', image: '' })

const loadMembers = async () => {
  try {
    const res = await fetch('/api/team-members')
    const data = await res.json().catch(() => ({}))
    if (data.ok) members.value = data.members || []
  } catch { /* table shows its empty state */ }
}

/**
 * Downscale to 400px and re-encode as JPEG before upload.
 * The old form stored the raw file as base64, so a 2MB photo became a ~2.7MB database
 * row that every visitor to /team then downloaded. This keeps rows small.
 */
const resizeImage = (file, max = 400) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not a readable image.'))
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })

const pickImage = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  memberError.value = ''

  if (!file.type.startsWith('image/')) {
    memberError.value = 'Please choose an image file.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    memberError.value = 'That image is over 2MB. Please pick a smaller one.'
    return
  }

  try {
    tForm.image = await resizeImage(file)
  } catch (error) {
    memberError.value = error.message
  }
}

const clearImage = () => {
  tForm.image = ''
  if (memberFile.value) memberFile.value.value = ''
}

const saveMember = async () => {
  memberError.value = ''
  savingMember.value = true
  try {
    const res = await fetch('/api/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: tForm.name.trim(),
        role: tForm.role.trim(),
        bio: tForm.bio.trim(),
        focus: ['Core Builder', 'Collaborator'],
        image: tForm.image,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      toast('success', 'Team member added', `${tForm.name.trim()} is now on /team.`)
      Object.assign(tForm, { name: '', role: '', bio: '', image: '' })
      if (memberFile.value) memberFile.value.value = ''
      await loadMembers()
    } else {
      memberError.value = data.message || 'Could not save. Check the fields and try again.'
    }
  } catch {
    memberError.value = 'Could not reach the server.'
  } finally {
    savingMember.value = false
  }
}

const deleteMember = async (m) => {
  if (!window.confirm(`Remove ${m.name} from the team page? This cannot be undone.`)) return
  try {
    const res = await fetch(`/api/team-members?id=${m.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      toast('success', 'Team member removed')
      await loadMembers()
    } else {
      toast('error', 'Could not remove', data.message || '')
    }
  } catch {
    toast('error', 'Could not remove', 'Could not reach the server.')
  }
}

// ── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  document.title = 'Admin — SkillSprint'
  checkAuth()
  ticker = setInterval(() => { now.value = Date.now() }, 30_000)
})
onUnmounted(() => clearInterval(ticker))
</script>
