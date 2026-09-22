<template>
  <Teleport to="body">
    <Transition name="quiz-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden relative flex flex-col max-h-[90vh] transition-all"
        >
          <!-- Top Header & Progress Bar -->
          <div class="px-6 pt-6 pb-4 border-b border-slate-100 relative">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  SS
                </span>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Track Matchmaker Quiz
                </span>
              </div>

              <button
                type="button"
                @click="close"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition-colors cursor-pointer"
                aria-label="Close quiz"
              >
                ✕
              </button>
            </div>

            <!-- Progress Bar (Only during questions) -->
            <div v-if="!quizComplete" class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-semibold text-slate-500 font-mono">
                <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
                <span>{{ Math.round(((currentQuestionIndex + 1) / questions.length) * 100) }}%</span>
              </div>
              <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  class="bg-blue-600 h-full rounded-full transition-all duration-300"
                  :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Question Content Slide -->
          <div v-if="!quizComplete" class="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 font-mono block mb-1">
                {{ currentQuestion.category }}
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {{ currentQuestion.title }}
              </h2>
              <p v-if="currentQuestion.subtitle" class="text-xs sm:text-sm text-slate-500 mt-1">
                {{ currentQuestion.subtitle }}
              </p>
            </div>

            <!-- Options Grid -->
            <div class="space-y-3">
              <button
                v-for="(option, idx) in currentQuestion.options"
                :key="idx"
                type="button"
                @click="selectOption(option)"
                class="w-full text-left p-4 rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/40 active:scale-[0.99] transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors">
                  <span>{{ option.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                    {{ option.text }}
                  </span>
                  <span v-if="option.desc" class="text-xs text-slate-500 mt-0.5 block">
                    {{ option.desc }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Result Slide -->
          <div v-else class="p-6 sm:p-8 overflow-y-auto space-y-6 text-center">
            <!-- Animated Match Badge -->
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mx-auto shadow-xs">
              {{ bestTrack.icon }}
            </div>

            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200/70 mb-2">
                <span>🎯</span>
                <span>{{ matchPercentage }}% Match for Your Goals</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {{ bestTrack.title }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                {{ bestTrack.description }}
              </p>
            </div>

            <!-- Track Specifications Box -->
            <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 sm:p-5 text-left space-y-3">
              <div class="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                <span class="text-slate-400 font-mono uppercase tracking-wider text-[10px]">Track Duration</span>
                <span class="font-bold text-slate-800">{{ bestTrack.duration }}</span>
              </div>

              <div>
                <span class="text-slate-400 font-mono uppercase tracking-wider text-[10px] block mb-1.5">Technologies You'll Master</span>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tech in bestTrack.techStack"
                    :key="tech"
                    class="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-mono font-semibold text-slate-700 shadow-2xs"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2.5 pt-2">
              <router-link
                :to="`/contact-us?track=${encodeURIComponent(bestTrack.title)}`"
                @click="close"
                class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for this Track &rarr;</span>
              </router-link>

              <button
                type="button"
                @click="resetQuiz"
                class="text-xs font-semibold text-slate-400 hover:text-slate-700 py-1 transition-colors cursor-pointer"
              >
                ↺ Retake Quiz
              </button>
            </div>
          </div>

          <!-- Bottom Footer Info -->
          <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>SkillSprint Engineering Matchmaker</span>
            <span v-if="!quizComplete && currentQuestionIndex > 0">
              <button
                type="button"
                @click="currentQuestionIndex--"
                class="text-blue-600 hover:underline cursor-pointer"
              >
                &larr; Back
              </button>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const currentQuestionIndex = ref(0)
const quizComplete = ref(false)
const matchPercentage = ref(94)

const scores = ref({
  frontend: 0,
  backend: 0,
  mentorship: 0,
})

const trackData = {
  frontend: {
    icon: '🔧',
    title: 'Open-Source Frontend Architecture',
    duration: 'Semester-Long Track',
    description: 'Design and build performant, modular web applications with production-grade UI design systems, micro-interactions, and component-driven architecture.',
    techStack: ['Vue.js 3', 'Tailwind CSS', 'TypeScript', 'Vite', 'GSAP'],
  },
  backend: {
    icon: '🧪',
    title: 'API Design & Systems Architecture',
    duration: '6-Week Intensive Sprint',
    description: 'Construct resilient REST & GraphQL APIs, implement cryptographic authentication, optimize relational database queries, and deploy Docker container pipelines.',
    techStack: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Neon DB'],
  },
  mentorship: {
    icon: '🤝',
    title: 'Peer-to-Peer Engineering Mentorship',
    duration: 'Rolling Enrollment',
    description: 'Get paired 1-on-1 with experienced upperclassmen to master Git workflows, clean code discipline, software architecture paradigms, and interview prep.',
    techStack: ['Git & GitHub CI', 'Code Reviews', 'Interview Prep', 'Architecture'],
  },
}

const questions = [
  {
    category: 'Question 1 of 4 • Craft & Passion',
    title: 'What kind of problems do you enjoy solving most?',
    subtitle: 'Choose what feels most engaging when you open your IDE.',
    options: [
      {
        icon: '🎨',
        text: 'Slick user interfaces, fluid animations, and design tokens',
        desc: 'Crafting responsive layouts that look stunning on all screen sizes',
        points: { frontend: 3, backend: 0, mentorship: 0 },
      },
      {
        icon: '⚡',
        text: 'Databases, API routing, server architecture, and security',
        desc: 'Writing bulletproof backend logic and optimizing query execution',
        points: { frontend: 0, backend: 3, mentorship: 0 },
      },
      {
        icon: '🤝',
        text: 'Code reviews, software best practices, and team collaboration',
        desc: 'Learning with peers and getting guidance on real project hurdles',
        points: { frontend: 0, backend: 0, mentorship: 3 },
      },
    ],
  },
  {
    category: 'Question 2 of 4 • Experience Level',
    title: 'Where are you currently on your coding journey?',
    subtitle: 'Be honest — every sprint track welcomes different starting points.',
    options: [
      {
        icon: '🌱',
        text: 'Know HTML/CSS/JS basics, looking for real team experience',
        desc: 'Ready to build production-ready projects with experienced peers',
        points: { frontend: 2, backend: 1, mentorship: 2 },
      },
      {
        icon: '🛠️',
        text: 'Have built full-stack hobby projects, seeking industrial rigor',
        desc: 'Want to master architecture, database design, and testing standards',
        points: { frontend: 1, backend: 3, mentorship: 0 },
      },
      {
        icon: '🚀',
        text: 'Want 1-on-1 guidance from advanced engineers',
        desc: 'Looking for a mentor to unblock technical bottlenecks and guide me',
        points: { frontend: 0, backend: 0, mentorship: 3 },
      },
    ],
  },
  {
    category: 'Question 3 of 4 • Target Outcome',
    title: 'What is your primary goal for this semester?',
    subtitle: 'What accomplishment would make this term a total victory for you?',
    options: [
      {
        icon: '💼',
        text: 'Land a high-paying frontend or product engineering role',
        desc: 'Build standout live projects that impress technical recruiters',
        points: { frontend: 3, backend: 0, mentorship: 1 },
      },
      {
        icon: '🧠',
        text: 'Master backend reliability and scalable system design',
        desc: 'Understand how databases and servers scale under production load',
        points: { frontend: 0, backend: 3, mentorship: 0 },
      },
      {
        icon: '📈',
        text: 'Accelerate my growth and gain strong engineering discipline',
        desc: 'Build good coding habits, Git hygiene, and technical confidence',
        points: { frontend: 1, backend: 1, mentorship: 3 },
      },
    ],
  },
  {
    category: 'Question 4 of 4 • Technology Stack',
    title: 'Which technical ecosystem excites you the most?',
    subtitle: 'Select the stack you want to see everyday in your terminal.',
    options: [
      {
        icon: '🌐',
        text: 'Vue.js, Tailwind CSS, Vite, and component design systems',
        desc: 'Building modern responsive web apps with instant reactivity',
        points: { frontend: 3, backend: 0, mentorship: 0 },
      },
      {
        icon: '🗄️',
        text: 'Node.js, PostgreSQL, Docker, and REST APIs',
        desc: 'Architecting scalable server microservices and relational ledgers',
        points: { frontend: 0, backend: 3, mentorship: 0 },
      },
      {
        icon: '📚',
        text: 'CI/CD pipelines, code reviews, and software architecture',
        desc: 'Collaborative development workflows and peer engineering reviews',
        points: { frontend: 0, backend: 0, mentorship: 3 },
      },
    ],
  },
]

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const selectOption = (option) => {
  scores.value.frontend += option.points.frontend || 0
  scores.value.backend += option.points.backend || 0
  scores.value.mentorship += option.points.mentorship || 0

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    // Generate realistic high match % (92 - 98%)
    matchPercentage.value = Math.floor(92 + Math.random() * 7)
    quizComplete.value = true
  }
}

const bestTrack = computed(() => {
  const { frontend, backend, mentorship } = scores.value
  if (frontend >= backend && frontend >= mentorship) {
    return trackData.frontend
  }
  if (backend >= frontend && backend >= mentorship) {
    return trackData.backend
  }
  return trackData.mentorship
})

const resetQuiz = () => {
  scores.value = { frontend: 0, backend: 0, mentorship: 0 }
  currentQuestionIndex.value = 0
  quizComplete.value = false
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.quiz-fade-enter-active,
.quiz-fade-leave-active {
  transition: opacity 0.2s ease;
}
.quiz-fade-enter-from,
.quiz-fade-leave-to {
  opacity: 0;
}
</style>
