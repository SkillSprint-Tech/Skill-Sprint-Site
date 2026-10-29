<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="px-4 sm:px-6 relative bg-[#F8FAFC] pt-12 sm:pt-16 md:pt-24 pb-14 md:pb-20 text-center overflow-hidden">
      <!-- Ambient light & blueprint grid -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14]"></div>
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-500/15 blur-[140px] rounded-full"></div>
        <div class="absolute -right-20 top-1/3 w-[450px] h-[450px] bg-indigo-500/12 blur-[130px] rounded-full"></div>
      </div>

      <!-- Floating Annotations with Mouse Parallax -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[15%] top-[18%] -rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🏆 student builders
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[15%] top-[14%] rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🌍 11 universities
        </div>
        <div class="absolute left-2 md:left-[8%] lg:left-[12%] top-[34%] rotate-8
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          💪🏼 flex but deserved
        </div>
        <div class="absolute right-2 md:right-[8%] lg:right-[12%] top-[32%] -rotate-4
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🔥 1500+ strong
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="flex justify-center mb-6">
          <span class="inline-flex items-center gap-2 bg-blue-50/90 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-200/60 uppercase tracking-widest shadow-sm">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Collaborative Mesh
          </span>
        </div>

        <h1 class="hero-heading h-display text-gray-900 leading-[1.08] mb-5">
          Built by Students,<br/>
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">For Students.</span>
        </h1>

        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-600 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2 font-normal">
          A nationwide network of student engineers, mentors, and community builders shipping real software, hosting localized hackathons, and learning in public across 11 universities.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <a :href="whatsappGroup.url" target="_blank" rel="noopener noreferrer" v-magnetic>
            <button class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-lg shadow-emerald-600/25 flex items-center gap-2.5">
              <i class="fab fa-whatsapp text-lg"></i>
              Join 1,500+ on WhatsApp
            </button>
          </a>
          <router-link to="/workshops" v-magnetic>
            <button class="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-sm">
              Explore Live Workshops
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- KINETIC VELOCITY MARQUEE -->
    <!-- ═══════════════════════════════════════ -->
    <div ref="marqueeScope" class="kinetic-marquee-container py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-mono text-xs sm:text-sm font-black uppercase tracking-widest overflow-hidden shadow-lg select-none">
      <div class="marquee-track flex whitespace-nowrap gap-10">
        <span v-for="n in 6" :key="n" class="flex items-center gap-8">
          <span>11 UNIVERSITIES</span>
          <span class="text-blue-300">✦</span>
          <span>1500+ BUILDERS</span>
          <span class="text-blue-300">✦</span>
          <span>ZERO GATEKEEPING</span>
          <span class="text-blue-300">✦</span>
          <span>REAL PRODUCTION REPOS</span>
          <span class="text-blue-300">✦</span>
          <span>20+ MENTORS</span>
          <span class="text-blue-300">✦</span>
          <span>STUDENT RUN</span>
          <span class="text-blue-300">✦</span>
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- COMMUNITY STATS (Cyber Holographic Section) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="statsScope" class="bg-slate-50 section overflow-hidden border-y border-gray-100 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
              Live Metrics
            </div>
            <h2 class="stats-heading text-gray-900 h-section leading-tight">
              Our Footprint So Far
            </h2>
            <p class="stats-sub text-gray-500 text-base sm:text-lg mt-2 font-medium">
              Real telemetry from active cohorts, workshops, and verified engineering pipelines.
            </p>
          </div>

          <!-- Network Active Beacon -->
          <div class="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-200/80 shadow-sm">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span class="font-mono text-xs font-extrabold text-gray-800 tracking-wider uppercase">
              NETWORK STATUS: ALL 11 HUBS ACTIVE
            </span>
          </div>
        </div>

        <!-- 3 Holographic Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.12)] hover:border-blue-300 transition-all duration-300 relative group overflow-hidden"
          >
            <!-- Corner Crosshair HUD Details -->
            <div class="absolute top-4 right-4 font-mono text-[10px] text-gray-300 font-bold group-hover:text-blue-500 transition-colors">
              0{{ stat.index }} // METRIC
            </div>

            <div class="flex items-baseline gap-1 mb-2">
              <span class="stat-number text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight font-mono group-hover:text-blue-600 transition-colors">
                {{ stat.displayValue }}
              </span>
              <span class="text-3xl sm:text-4xl font-black text-blue-600">+</span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 uppercase tracking-tight mb-1">
              {{ stat.label }}
            </h3>
            <p class="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider mb-4">
              {{ stat.subtext }}
            </p>

            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full stat-bar transition-all duration-1000" :style="{ width: stat.barWidth }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PAST ENDEAVOUR: PARTNER EVENT (LoopVerse) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="partnerScope" :id="partnerEvent.anchor" class="bg-[#0B101B] section relative overflow-hidden text-white">
      <!-- Ambient Starfield / Mesh Glow -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/15 blur-[160px] rounded-full"></div>
        <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-600/15 blur-[160px] rounded-full"></div>
        <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      <div class="max-w-5xl mx-auto relative z-10 px-4 sm:px-6">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <!-- 3D Poster Tilt with Specular Sheen -->
          <div ref="posterCard" class="flex-shrink-0 w-full max-w-xs sm:max-w-sm partner-poster relative perspective-1000 group">
            <div class="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.7)] group-hover:border-violet-400/50 transition-all duration-500 transform-gpu">
              <img :src="partnerEvent.poster" :alt="partnerEvent.posterAlt" width="1025" height="1535"
                   class="w-full h-auto object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              
              <!-- Specular Light Reflection Overlay -->
              <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div class="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/20 text-white/95 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-xl">
                <i class="fa-solid fa-flag-checkered text-violet-400" aria-hidden="true"></i>
                <span>Concluded</span>
              </div>
            </div>
          </div>

          <div class="flex-1 text-center lg:text-left partner-copy">
            <div class="flex flex-wrap items-center gap-2.5 justify-center lg:justify-start mb-6">
              <span class="inline-flex items-center gap-2 bg-violet-500/15 text-violet-300 text-xs font-mono font-extrabold
                           px-4 py-1.5 rounded-full border border-violet-500/30 uppercase tracking-widest">
                <i class="fa-solid fa-clock-rotate-left text-xs" aria-hidden="true"></i>
                Past Endeavour
              </span>
              <span class="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 text-xs font-mono font-semibold
                           px-3 py-1.5 rounded-full border border-white/10">
                <i class="fa-solid fa-handshake text-violet-400 text-xs" aria-hidden="true"></i>
                Outreach Partner
              </span>
            </div>

            <h2 class="text-white h-section leading-[1.12] mb-5 font-extrabold">
              Proud Outreach Partner for<br />
              <span class="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                {{ partnerEvent.name }}.
              </span>
            </h2>

            <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 font-normal">
              Skill Sprint proudly served as an official Outreach Partner for {{ partnerEvent.host }}'s
              {{ partnerEvent.name }}. Seven intensive modules bringing student builders together to create,
              compete under pressure, and ship real projects across modern engineering domains.
            </p>

            <ul class="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
              <li v-for="module in partnerEvent.modules" :key="module"
                  class="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/40 text-gray-300 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full transition-colors">
                {{ module }}
              </li>
            </ul>

            <dl class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-sm text-gray-300 mb-8 justify-center lg:justify-start">
              <div class="flex items-center gap-2.5 bg-white/[0.05] px-4 py-2.5 rounded-xl border border-white/[0.08]">
                <dt class="sr-only">Date</dt>
                <i class="fa-regular fa-calendar-check text-violet-300 text-sm" aria-hidden="true"></i>
                <dd class="font-medium">{{ partnerEvent.date }} · <span class="text-emerald-400 font-semibold">Concluded</span></dd>
              </div>
              <div class="flex items-center gap-2.5 bg-white/[0.05] px-4 py-2.5 rounded-xl border border-white/[0.08]">
                <dt class="sr-only">Venue</dt>
                <i class="fa-solid fa-location-dot text-violet-300 text-sm" aria-hidden="true"></i>
                <dd class="font-medium">{{ partnerEvent.venue }}</dd>
              </div>
            </dl>

            <div class="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <span class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-5 py-3 rounded-full text-sm font-semibold">
                <i class="fa-solid fa-circle-check text-emerald-400 text-xs" aria-hidden="true"></i>
                Event Completed
              </span>
              <a
                v-if="partnerEvent.websiteUrl"
                :href="partnerEvent.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                v-magnetic
                class="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
              >
                <span>Visit {{ partnerEvent.host }}</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs text-violet-300" aria-hidden="true"></i>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- WALL OF FAME (Student Receipts) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="testimonialScope" class="bg-[#F8FAFC] section overflow-hidden relative">
      <div class="max-w-3xl mx-auto text-center mb-12 md:mb-20 relative z-10 px-4">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Unfiltered Feedback
        </div>
        <h2 class="wall-heading text-gray-900 h-section mb-3">
          Student Receipts
        </h2>
        <p class="wall-sub text-gray-500 text-base sm:text-lg font-medium">
          Students said this. We didn't make it up. Real quotes from real contributors.
        </p>
        <img src="/rightarrow.png" alt="" aria-hidden="true"
             class="hidden md:block absolute left-[15%] top-[85%] w-24 opacity-80 -rotate-12 pointer-events-none" />
      </div>

      <!-- Mobile: vertical stack -->
      <div class="flex flex-col gap-4 max-w-sm mx-auto md:hidden w-full px-4">
        <div v-for="(t, i) in testimonials" :key="i"
             class="bg-white border border-gray-100 shadow-md p-6 rounded-3xl w-full testimonial-mobile">
          <p class="text-gray-600 text-[15px] leading-relaxed mb-5 italic">"{{ t.quote }}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm" :class="t.avatarClass">
              {{ t.initials }}
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">{{ t.name }}</p>
              <p class="text-xs text-gray-400 font-mono">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: organic floating 3D cards with hover elevate -->
      <div class="hidden md:block relative max-w-5xl mx-auto h-[600px] lg:h-[540px]">
        <div v-for="(t, i) in testimonials" :key="i"
             class="absolute bg-white/95 backdrop-blur-sm border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 rounded-3xl
                    transition-all duration-300 hover:scale-[1.06] hover:z-50 hover:shadow-[0_30px_70px_rgba(37,99,235,0.18)] hover:border-blue-200 cursor-default testimonial-desktop"
             :style="t.desktopStyle">
          <p class="text-gray-600 text-[14px] leading-relaxed mb-5 italic font-normal">"{{ t.quote }}"</p>
          <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm" :class="t.avatarClass">
              {{ t.initials }}
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">{{ t.name }}</p>
              <p class="text-[11px] text-gray-400 font-mono font-medium">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- EVENT HIGHLIGHTS GALLERY -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="galleryScope" class="bg-slate-50 section-tight border-y border-gray-100 overflow-hidden">
      <div class="max-w-3xl mx-auto text-center mb-10 px-4">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Photo Stream
        </div>
        <h2 class="gallery-heading text-gray-900 h-section mb-3">
          Sprint Highlights
        </h2>
        <p class="gallery-sub text-gray-500 text-base sm:text-lg font-medium">
          Real events. Real people. Real code being written in person.
        </p>
      </div>

      <div class="w-full overflow-x-auto pb-6 -mx-4 px-4" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
        <div class="flex gap-4 sm:gap-6 md:justify-center md:flex-wrap w-max md:w-full mx-auto flex-wrap px-4">
          <div v-for="(img, i) in images" :key="i"
               class="gallery-card flex-shrink-0 w-[170px] sm:w-[220px] md:w-[280px] h-[130px] sm:h-[160px] md:h-[210px]
                      rounded-3xl overflow-hidden bg-gray-200 border-4 border-white
                      shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.07] hover:shadow-[0_25px_60px_rgba(37,99,235,0.2)] hover:z-20 cursor-pointer"
               :class="[
                 i === 0 ? 'md:rotate-2 md:translate-y-3' : '',
                 i === 1 ? 'md:-rotate-2' : '',
                 i === 2 ? 'md:rotate-3 md:translate-y-4' : '',
                 i === 3 ? 'md:-rotate-1' : '',
               ]">
            <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- WHATSAPP COMMUNITY -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="whatsappScope" class="bg-[#0B101B] section relative overflow-hidden text-white">
      <!-- Emerald ambient glow -->
      <div class="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div class="max-w-5xl mx-auto relative z-10 px-4 sm:px-6">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div class="flex-1 text-center lg:text-left whatsapp-copy">
            <span class="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 text-xs font-mono font-extrabold
                         px-4 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest mb-6">
              <i class="fab fa-whatsapp text-sm" aria-hidden="true"></i>
              Active Group Chat
            </span>
            <h2 class="text-white h-section leading-[1.12] mb-5 font-extrabold">
              Where it actually<br />
              <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                happens.
              </span>
            </h2>
            <p class="text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 font-normal">
              Workshop announcements, debugging at midnight, internship leads, and people who
              answer when you're stuck. No fees, no vetting — just show up.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a :href="whatsappGroup.url" target="_blank" rel="noopener noreferrer" v-magnetic
                 class="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white
                        px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-500/25
                        transition-all duration-200 active:scale-95">
                <i class="fab fa-whatsapp text-xl" aria-hidden="true"></i>
                Join the WhatsApp Group
              </a>
              <router-link to="/workshops" v-magnetic
                           class="inline-flex items-center justify-center border border-white/20 text-gray-300
                                  px-8 py-4 rounded-full font-semibold hover:border-white/40 hover:text-white
                                  transition-colors duration-200">
                See the Workshops
              </router-link>
            </div>
          </div>

          <!-- Mock chat with live typing styling -->
          <div class="flex-shrink-0 w-full max-w-sm whatsapp-card">
            <div class="bg-[#111B21] rounded-3xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              <div class="flex items-center gap-3 px-5 py-4 bg-[#202C33] border-b border-white/5">
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <i class="fab fa-whatsapp text-emerald-400 text-lg" aria-hidden="true"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-white text-sm font-bold truncate">SkillSprint Community</p>
                  <p class="text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    1,520 members · 48 online
                  </p>
                </div>
              </div>
              <div class="p-4 sm:p-5 flex flex-col gap-3">
                <div v-for="(msg, i) in chatPreview" :key="i"
                     class="max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm"
                     :class="msg.own
                       ? 'bg-emerald-600 text-white self-end rounded-br-none'
                       : 'bg-[#202C33] text-gray-200 self-start rounded-bl-none'">
                  <p v-if="!msg.own" class="text-[11px] font-bold text-emerald-400 mb-0.5 font-mono">{{ msg.from }}</p>
                  <p class="text-[13px] leading-snug">{{ msg.text }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] section overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative bg-white/95 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(37,99,235,0.12)] border border-white/60 px-6 sm:px-12 py-12 md:py-16 text-center overflow-hidden cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none opacity-80" aria-hidden="true">
            <img ref="ctaMascot" src="/sidelogo.png" alt="" class="w-40 sm:w-56 md:w-72 h-auto object-contain" style="transform: rotate(-12deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest mb-4">
              Get In Touch
            </span>
            <h2 class="h-sub text-gray-900 leading-snug mb-4">
              Become Part of the
              <span class="text-blue-600 relative inline-block ml-1">Network
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
              Connect with fellow student engineers, get your questions answered, and ship real code together.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link to="/contact-us" v-magnetic>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/contact-us" v-magnetic>
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200">
                  Contact Us
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import { SplitText } from '../motion/gsap'
import { whatsappGroup } from '../data/site'
import { partnerEvent } from '../data/partnerEvent'

const pageScope = ref(null)
const heroScope = ref(null)
const marqueeScope = ref(null)
const statsScope = ref(null)
const partnerScope = ref(null)
const posterCard = ref(null)
const testimonialScope = ref(null)
const galleryScope = ref(null)
const whatsappScope = ref(null)
const ctaMascot = ref(null)

// Stats data
const stats = reactive([
  { index: 1, target: 1500, displayValue: 0, label: 'Students', subtext: 'Active Squad Expanding', barWidth: '92%' },
  { index: 2, target: 11,   displayValue: 0, label: 'Universities', subtext: 'Formal MOUs Signed', barWidth: '78%' },
  { index: 3, target: 20,   displayValue: 0, label: 'Mentors', subtext: 'Senior Engineers Helping', barWidth: '85%' },
])

// Testimonials data
const testimonials = [
  { quote: 'SkillSprint gave me my first real pull request experience. No classroom can replicate that feeling of shipping code.', name: 'Aisha K.', role: 'Full Stack Track · FAST-NUCES', initials: 'AK', avatarClass: 'bg-blue-100 text-blue-600', desktopStyle: 'width:290px; top:30px; left:0; z-index:20; transform:rotate(-5deg);' },
  { quote: 'I went from watching tutorials to actually building and deploying. The mentorship framework changed everything for me.', name: 'Omar R.', role: 'DevOps Track · Superior Univ', initials: 'OR', avatarClass: 'bg-indigo-100 text-indigo-600', desktopStyle: 'width:320px; top:0; left:290px; z-index:30; transform:rotate(2deg);' },
  { quote: 'The bootcamps are intense but that\'s why they work. You come out actually knowing how to structure a real project.', name: 'Sara M.', role: 'Frontend Track · UMT', initials: 'SM', avatarClass: 'bg-pink-100 text-pink-600', desktopStyle: 'width:290px; top:25px; right:0; z-index:20; transform:rotate(5deg);' },
  { quote: 'Being part of an open-source track as a freshman was intimidating but the peer reviews taught me more than any course ever did.', name: 'Hassan A.', role: 'Open Source Track · COMSATS', initials: 'HA', avatarClass: 'bg-emerald-100 text-emerald-600', desktopStyle: 'width:295px; bottom:20px; left:60px; z-index:15; transform:rotate(-3deg);' },
  { quote: 'No paywalls, no gatekeeping. Just students helping students get better at engineering. That\'s rare.', name: 'Fatima Z.', role: 'AI Engineering · ITU', initials: 'FZ', avatarClass: 'bg-amber-100 text-amber-600', desktopStyle: 'width:295px; bottom:20px; right:70px; z-index:15; transform:rotate(3deg);' },
]

// WhatsApp preview
const chatPreview = [
  { from: 'Hassan', text: 'anyone free to look at my CV before the Sunday session?' },
  { from: 'Ayesha', text: 'send it, I just did mine in the workshop 😄' },
  { own: true, text: 'reminder: Git & GitHub session tonight at 7 ⚡' },
  { from: 'Sara', text: 'got my first interview from the job search session!! 🎉' },
]

// Event images
const images = [
  { src: '/Speaker.jpg.jpeg', alt: 'Speaker at Skill Sprint event' },
  { src: '/Short Group.jpg.jpeg', alt: 'Group of Skill Sprint students' },
  { src: '/Long Group.jpg.jpeg', alt: 'Large Skill Sprint community group' },
  { src: '/Crowd.JPG.jpeg', alt: 'Skill Sprint event crowd' },
]

// Unified GSAP Animations
useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Hero SplitText & Tag Parallax
  const headingEl = selector('.hero-heading')[0]
  if (headingEl) {
    const split = SplitText.create(headingEl, { type: 'words,chars', wordsClass: 'hw' })
    gsap.from(split.chars, {
      y: 50,
      opacity: 0,
      rotateX: -45,
      stagger: 0.02,
      duration: 1,
      ease: 'power3.out',
    })
  }

  gsap.from(selector('.hero-sub'), {
    y: 30,
    opacity: 0,
    duration: 0.9,
    delay: 0.3,
    ease: 'power3.out',
  })

  const labels = selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.6 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=8', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // 2. Kinetic Marquee Scroll Scrub
  const marqueeTrack = selector('.marquee-track')[0]
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: marqueeScope.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      }
    })
  }

  // 3. Stats Pure GSAP Countups on ScrollTrigger
  ScrollTrigger.create({
    trigger: statsScope.value,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      stats.forEach((stat) => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            stat.displayValue = Math.floor(obj.val)
          }
        })
      })
    }
  })

  const statCards = selector('.stat-card')
  if (statCards.length > 0) {
    gsap.from(statCards, {
      scrollTrigger: { trigger: statsScope.value, start: 'top 82%', toggleActions: 'play none none reverse' },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out'
    })
  }

  // 4. Partner 3D Poster & Copy Reveal
  if (posterCard.value) {
    gsap.from(posterCard.value, {
      scrollTrigger: { trigger: partnerScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
      y: 60,
      rotateY: -15,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.4)'
    })
  }

  gsap.from(selector('.partner-copy'), {
    scrollTrigger: { trigger: partnerScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
    x: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  // 5. Testimonial 3D Floating Reveal & Gentle Mouse Drift
  const desktopTestimonials = selector('.testimonial-desktop')
  if (desktopTestimonials.length > 0) {
    gsap.from(desktopTestimonials, {
      scrollTrigger: { trigger: testimonialScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
      y: 80,
      scale: 0.85,
      opacity: 0,
      duration: 1.1,
      stagger: 0.1,
      ease: 'back.out(1.3)'
    })

    // Ambient floating oscillation
    desktopTestimonials.forEach((card, idx) => {
      gsap.to(card, {
        y: (idx % 2 === 0 ? '-=8' : '+=8'),
        rotation: (idx % 2 === 0 ? '+=1.5' : '-=1.5'),
        duration: 3 + idx * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: idx * 0.3
      })
    })
  }

  // 6. Gallery Cards Stagger
  const galleryCards = selector('.gallery-card')
  if (galleryCards.length > 0) {
    gsap.from(galleryCards, {
      scrollTrigger: { trigger: galleryScope.value, start: 'top 82%', toggleActions: 'play none none reverse' },
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'back.out(1.4)'
    })
  }

  // 7. WhatsApp Card Reveal
  gsap.from(selector('.whatsapp-card'), {
    scrollTrigger: { trigger: whatsappScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
    scale: 0.9,
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.4)'
  })

  // 8. CTA Mascot Parallax
  if (ctaMascot.value) {
    gsap.from(ctaMascot.value, {
      scrollTrigger: { trigger: '.cta-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      xPercent: 30,
      yPercent: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    })
  }
}, pageScope)
</script>

<style scoped>
.hero-heading :deep(.hw) {
  display: inline-block;
  overflow: clip;
}
.perspective-1000 {
  perspective: 1000px;
}
div::-webkit-scrollbar {
  display: none;
}
</style>
