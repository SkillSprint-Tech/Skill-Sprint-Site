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
                  SkillSprint Path & Track Matchmaker • 2-Min Quiz
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
                  <span v-if="option.desc" class="text-xs text-slate-500 mt-0.5 block leading-relaxed">
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
            <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 sm:p-5 text-left space-y-3.5">
              <div class="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                <span class="text-slate-400 font-mono uppercase tracking-wider text-[10px]">Track Duration</span>
                <span class="font-bold text-slate-800">{{ bestTrack.duration }}</span>
              </div>

              <div>
                <span class="text-slate-400 font-mono uppercase tracking-wider text-[10px] block mb-1.5">Skills & Tools You'll Master</span>
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

              <div>
                <span class="text-slate-400 font-mono uppercase tracking-wider text-[10px] block mb-1.5">Recommended Workshop Topics</span>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="topic in bestTrack.recommendedTopics"
                    :key="topic"
                    class="px-2.5 py-1 bg-blue-50 border border-blue-200/70 rounded-lg text-xs font-semibold text-blue-700"
                  >
                    {{ topic }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2.5 pt-2">
              <button
                type="button"
                @click="applyTopicsAndProceed"
                class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Matched Topics for Workshops &rarr;</span>
              </button>

              <router-link
                :to="`/contact-us?track=${encodeURIComponent(bestTrack.title)}`"
                @click="close"
                class="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Or apply directly for this Sprint Track &rarr;</span>
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
            <span>SkillSprint Community & Path Matchmaker</span>
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

const emit = defineEmits(['close', 'select-topics'])

const currentQuestionIndex = ref(0)
const quizComplete = ref(false)
const matchPercentage = ref(95)

const scores = ref({
  design: 0,
  frontend: 0,
  backend: 0,
  data_ai: 0,
  cybersecurity: 0,
  mentorship: 0,
})

const trackData = {
  design: {
    id: 'design',
    icon: '🎨',
    title: 'UI/UX & Digital Product Design Track',
    badge: 'Design & Product Track',
    duration: 'Semester-Long Track / Sprint',
    description: 'Master user research, wireframing, high-fidelity Figma components, interactive prototyping, and design systems. Learn to craft intuitive digital experiences and collaborate with cross-functional teams — no coding required!',
    techStack: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Design Tokens', 'User Journey Mapping'],
    recommendedTopics: ['UI/UX & Product Design', 'Product Management & Agile'],
  },
  frontend: {
    id: 'frontend',
    icon: '💻',
    title: 'Modern Web & Frontend Experience Track',
    badge: 'Frontend Engineering Track',
    duration: 'Semester-Long Track',
    description: 'Transform visual concepts and designs into fluid, responsive web applications. Master modern UI frameworks, styling, interactive components, accessibility, and smooth user experiences.',
    techStack: ['Vue.js 3', 'Tailwind CSS', 'JavaScript / TypeScript', 'Vite', 'Component Systems'],
    recommendedTopics: ['Web & Frontend Development', 'Mobile App Development'],
  },
  backend: {
    id: 'backend',
    icon: '⚙️',
    title: 'Backend Systems & Cloud Architecture Track',
    badge: 'Systems & Backend Sprint',
    duration: '6-Week Intensive Sprint',
    description: 'Construct resilient REST & GraphQL APIs, model relational databases, optimize queries, explore containerization, and deploy reliable server infrastructure that powers modern applications.',
    techStack: ['Node.js', 'PostgreSQL / SQL', 'REST APIs', 'Docker', 'Cloud Services', 'System Design'],
    recommendedTopics: ['APIs, Databases & Backend', 'Cloud Computing & DevOps'],
  },
  data_ai: {
    id: 'data_ai',
    icon: '🧠',
    title: 'Data Science & Applied AI Exploration Track',
    badge: 'Data & AI Track',
    duration: '6-Week Intensive Sprint',
    description: 'Analyze real-world datasets, uncover statistical trends, build intuitive data visualizations, and leverage practical machine learning models and modern AI tools to automate workflows.',
    techStack: ['Python', 'Data Analytics', 'Applied AI / ML', 'SQL', 'Data Visualization', 'Prompt Engineering'],
    recommendedTopics: ['Data Science & Analytics', 'Artificial Intelligence & Machine Learning'],
  },
  cybersecurity: {
    id: 'cybersecurity',
    icon: '🛡️',
    title: 'Cybersecurity & Systems Defense Track',
    badge: 'Security & Systems Track',
    duration: '6-Week Intensive Sprint',
    description: 'Explore network security principles, vulnerability discovery, ethical defense practices, OWASP standards, and system auditing to build secure digital environments.',
    techStack: ['Network Security', 'OWASP Top 10', 'Vulnerability Assessment', 'Ethical Defense', 'System Hardening'],
    recommendedTopics: ['Cybersecurity & Ethical Hacking', 'Computer Science Fundamentals & Systems'],
  },
  mentorship: {
    id: 'mentorship',
    icon: '🤝',
    title: 'Foundations & Cross-Disciplinary Mentorship Track',
    badge: 'Mentorship & Career Track',
    duration: 'Rolling Enrollment',
    description: 'Connect 1-on-1 with experienced student mentors across design, engineering, and tech leadership. Build your portfolio, master collaborative Git workflows, and prepare for tech career opportunities.',
    techStack: ['Portfolio Building', 'Git & Open Source', 'Tech Interview Prep', 'Agile & Teamwork', 'Career Roadmaps'],
    recommendedTopics: ['Career Growth & Tech Interviews', 'Git, Open Source & Collaboration'],
  },
}

const questions = [
  {
    category: 'Question 1 of 4 • Craft & Passion',
    title: 'What kind of work or projects excite you the most?',
    subtitle: 'Choose what sparks your curiosity when starting something new.',
    options: [
      {
        icon: '🎨',
        text: 'UI/UX Design, Visual Flows & Aesthetics',
        desc: 'Crafting clean user interfaces, wireframes, component styles, and user journeys in Figma',
        points: { design: 4, frontend: 1, mentorship: 0 },
      },
      {
        icon: '💻',
        text: 'Interactive Websites, Apps & Frontend Experience',
        desc: 'Bringing visual ideas into the browser with responsive layouts and smooth interactive elements',
        points: { frontend: 4, design: 1, mentorship: 0 },
      },
      {
        icon: '⚙️',
        text: 'Databases, Server Logic & Cloud Systems',
        desc: 'Architecting behind-the-scenes APIs, data storage, and server reliability',
        points: { backend: 4, cybersecurity: 1, mentorship: 0 },
      },
      {
        icon: '🧠',
        text: 'Data Science, Machine Learning & AI Tools',
        desc: 'Exploring datasets, statistical patterns, and leveraging practical AI solutions',
        points: { data_ai: 4, backend: 1, mentorship: 0 },
      },
      {
        icon: '🛡️',
        text: 'Cybersecurity, System Defense & Digital Safety',
        desc: 'Investigating security vulnerabilities, network protocols, and protecting digital assets',
        points: { cybersecurity: 4, backend: 1, mentorship: 0 },
      },
      {
        icon: '🤝',
        text: 'Team Collaboration, Portfolios & Tech Leadership',
        desc: 'Exploring tech careers, getting mentorship, building portfolios, and working with cross-functional teams',
        points: { mentorship: 4, design: 1, frontend: 1 },
      },
    ],
  },
  {
    category: 'Question 2 of 4 • Your Starting Point',
    title: 'Where are you currently on your learning journey?',
    subtitle: 'Every sprint welcomes all starting points — from complete beginners to experienced creators.',
    options: [
      {
        icon: '🌱',
        text: 'Curious beginner exploring tech or digital design',
        desc: 'Eager to learn fundamentals, understand the landscape, and build my very first projects',
        points: { mentorship: 3, design: 2, frontend: 2 },
      },
      {
        icon: '🎨',
        text: 'Design-focused, creative, or visual thinker',
        desc: 'Interested in user experience, visual layouts, research, or product design without needing to code',
        points: { design: 4, mentorship: 1 },
      },
      {
        icon: '🛠️',
        text: 'Hands-on builder with some project or coding experience',
        desc: 'Have experimented with tools, code, or personal projects; ready for industry-grade standards and teamwork',
        points: { frontend: 2, backend: 2, data_ai: 2, cybersecurity: 2 },
      },
      {
        icon: '🚀',
        text: 'Looking for 1-on-1 mentorship & career clarity',
        desc: 'Seeking guidance from senior peers to polish my portfolio, resume, and interview confidence',
        points: { mentorship: 4, data_ai: 1, backend: 1 },
      },
    ],
  },
  {
    category: 'Question 3 of 4 • Target Outcome',
    title: 'What accomplishment would make this term an absolute win?',
    subtitle: 'What milestone would make you proudest by the end of the program?',
    options: [
      {
        icon: '💼',
        text: 'Build a standout portfolio (design case studies or live projects)',
        desc: 'Create impressive, real-world work to showcase to recruiters and prospective teams',
        points: { design: 3, frontend: 3, mentorship: 2 },
      },
      {
        icon: '🧠',
        text: 'Master deep technical, analytical, or system concepts',
        desc: 'Understand how scalable backends, secure networks, or AI models function in depth',
        points: { backend: 3, data_ai: 3, cybersecurity: 3 },
      },
      {
        icon: '🎨',
        text: 'Bridge design, user experience, and product strategy',
        desc: 'Create user-centered solutions and learn how design fits into real product teams',
        points: { design: 4, mentorship: 2 },
      },
      {
        icon: '📈',
        text: 'Gain tech career readiness and industry confidence',
        desc: 'Master interview preparation, teamwork, Git/project workflows, and industry habits',
        points: { mentorship: 4, frontend: 1, backend: 1 },
      },
    ],
  },
  {
    category: 'Question 4 of 4 • Preferred Workspaces & Tools',
    title: 'Which tools, workflows, or environments sound most appealing?',
    subtitle: 'Select the environment where you feel most inspired spending your time.',
    options: [
      {
        icon: '🎨',
        text: 'Figma, FigJam & Interactive Design Canvases',
        desc: 'Colors, typography, wireframes, user journeys, and component design systems',
        points: { design: 4, frontend: 1 },
      },
      {
        icon: '🌐',
        text: 'Modern Web Editors, Tailwind & UI Frameworks',
        desc: 'Building responsive web components, dynamic layouts, and interactive visual interfaces',
        points: { frontend: 4, design: 1 },
      },
      {
        icon: '🗄️',
        text: 'Databases, Cloud Platforms & REST APIs',
        desc: 'Writing server services, structuring SQL queries, and containerizing systems',
        points: { backend: 4, cybersecurity: 1 },
      },
      {
        icon: '📊',
        text: 'Python, Data Notebooks & AI Workflows',
        desc: 'Writing analysis scripts, exploring ML libraries, and testing AI prompt chains',
        points: { data_ai: 4, backend: 1 },
      },
      {
        icon: '🛡️',
        text: 'Security Scanners, Terminal Diagnostics & Defense Tools',
        desc: 'Testing system vulnerabilities, network protocols, and authentication safety',
        points: { cybersecurity: 4, backend: 1 },
      },
      {
        icon: '📋',
        text: 'Collaborative Project Boards, Reviews & Discussions',
        desc: 'Team milestone tracking, cross-functional sprints, and peer mentorship sessions',
        points: { mentorship: 4, design: 1, frontend: 1 },
      },
    ],
  },
]

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const selectOption = (option) => {
  const p = option.points || {}
  scores.value.design += p.design || 0
  scores.value.frontend += p.frontend || 0
  scores.value.backend += p.backend || 0
  scores.value.data_ai += p.data_ai || 0
  scores.value.cybersecurity += p.cybersecurity || 0
  scores.value.mentorship += p.mentorship || 0

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
  } else {
    // Generate realistic high match % (93 - 99%)
    matchPercentage.value = Math.floor(93 + Math.random() * 6)
    quizComplete.value = true
  }
}

const bestTrack = computed(() => {
  const { design, frontend, backend, data_ai, cybersecurity, mentorship } = scores.value
  const candidates = [
    { track: trackData.design, score: design },
    { track: trackData.frontend, score: frontend },
    { track: trackData.backend, score: backend },
    { track: trackData.data_ai, score: data_ai },
    { track: trackData.cybersecurity, score: cybersecurity },
    { track: trackData.mentorship, score: mentorship },
  ]
  candidates.sort((a, b) => b.score - a.score)
  return candidates[0].score > 0 ? candidates[0].track : trackData.mentorship
})

const applyTopicsAndProceed = () => {
  emit('select-topics', bestTrack.value.recommendedTopics)
  close()
}

const resetQuiz = () => {
  scores.value = {
    design: 0,
    frontend: 0,
    backend: 0,
    data_ai: 0,
    cybersecurity: 0,
    mentorship: 0,
  }
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
