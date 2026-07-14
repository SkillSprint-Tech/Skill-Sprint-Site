<template>
  <!-- Floating Chat Button -->
  <button
    v-if="!isOpen"
    @click="openChat"
    id="chatbot-trigger"
    class="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white
           shadow-[0_8px_30px_rgb(79,70,229,0.4)] flex items-center justify-center
           hover:shadow-[0_8px_40px_rgb(79,70,229,0.6)] hover:scale-105
           active:scale-95 transition-all duration-300 cursor-pointer group border border-white/20"
    aria-label="Open chat"
  >
    <!-- Chat icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 group-hover:-translate-y-0.5 group-hover:scale-110 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>

    <!-- Pulse ring -->
    <span class="absolute inset-0 rounded-full bg-indigo-500 animate-[ping_2.5s_ease-in-out_infinite] opacity-20"></span>
  </button>

  <!-- Chat Window -->
  <Transition name="chat-pop">
    <div
      v-if="isOpen"
      id="chatbot-window"
      class="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]
             bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]
             flex flex-col overflow-hidden border border-gray-100 ring-1 ring-black/5"
      style="height: 600px; max-height: calc(100vh - 3rem);"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
        <!-- Abstract shapes in header -->
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        
        <div class="flex items-center gap-4 relative z-10">
          <div class="relative">
            <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
              <span class="text-2xl">🤖</span>
            </div>
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg tracking-wide shadow-black/10 text-shadow-sm">Gizmo</h3>
            <div class="flex items-center gap-1.5 opacity-90">
              <span class="text-blue-100 text-xs font-medium tracking-wider uppercase">AI Assistant</span>
            </div>
          </div>
        </div>
        <button
          @click="closeChat"
          id="chatbot-close"
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center
                 transition-all duration-200 cursor-pointer backdrop-blur-md relative z-10 hover:rotate-90"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        id="chatbot-messages"
        class="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
        style="scroll-behavior: smooth;"
      >
        <!-- Welcome message -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-2 gap-4 mt-8">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] border border-blue-100/50 mb-2 transform hover:scale-105 transition-transform duration-500">
            <span class="text-4xl animate-[bounce_2s_infinite]">👋</span>
          </div>
          <h4 class="text-gray-800 font-extrabold text-xl tracking-tight">Welcome to Skill Sprint!</h4>
          <p class="text-gray-500 text-sm leading-relaxed max-w-[260px]">
            I'm Gizmo. Ask me anything about our community, sprints, events, or how to get started!
          </p>
          <!-- Quick action buttons -->
          <div class="flex flex-wrap justify-center gap-2 mt-4">
            <button
              v-for="(q, i) in quickQuestions"
              :key="i"
              @click="sendQuickQuestion(q)"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 shadow-sm
                     text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:border-blue-200 hover:shadow-md
                     transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <!-- Message bubbles -->
        <TransitionGroup name="msg-list">
          <template v-for="(msg, i) in messages" :key="'msg-'+i">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="flex justify-end group">
              <div class="max-w-[80%] bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm
                          text-[15px] leading-relaxed shadow-md shadow-blue-500/20 transform transition-all duration-300">
                {{ msg.content }}
              </div>
            </div>

            <!-- Bot message -->
            <div v-else class="flex justify-start gap-3 group">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-white">
                <span class="text-sm">🤖</span>
              </div>
              <div class="max-w-[80%] bg-white text-gray-800 px-5 py-3.5 rounded-2xl rounded-tl-sm
                          text-[15px] leading-relaxed shadow-sm border border-gray-100/80 transform transition-all duration-300"
                   v-html="formatMessage(msg.content)">
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isLoading" key="typing" class="flex justify-start gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-white">
              <span class="text-sm">🤖</span>
            </div>
            <div class="bg-white px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-2 w-fit">
              <span class="typing-dot w-2 h-2 bg-blue-400 rounded-full"></span>
              <span class="typing-dot w-2 h-2 bg-indigo-400 rounded-full" style="animation-delay: 0.2s"></span>
              <span class="typing-dot w-2 h-2 bg-blue-500 rounded-full" style="animation-delay: 0.4s"></span>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Input Area -->
      <div class="px-5 py-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
        <div class="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 focus-within:bg-white transition-all duration-300">
          <input
            ref="chatInput"
            v-model="inputText"
            @keydown.enter.prevent="sendMessage"
            id="chatbot-input"
            type="text"
            placeholder="Type your message..."
            :disabled="isLoading"
            class="flex-1 px-4 py-2.5 bg-transparent text-[15px]
                   text-gray-800 placeholder-gray-400
                   focus:outline-none
                   disabled:opacity-50 transition-all duration-200"
          />
          <button
            @click="sendMessage"
            id="chatbot-send"
            :disabled="!inputText.trim() || isLoading"
            class="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center
                   hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                   transition-all duration-300 shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <div class="flex justify-center mt-3 items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Powered by Skill Sprint AI
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const isOpen = ref(false)
const isLoading = ref(false)
const inputText = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const chatInput = ref(null)

const quickQuestions = [
  'What is Skill Sprint?',
  'How do I join?',
  'Upcoming events?',
  'Contact support',
]

// Determine API base URL
const API_BASE = import.meta.env.VITE_API_BASE || ''

const openChat = () => {
  isOpen.value = true
  nextTick(() => {
    chatInput.value?.focus()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatMessage = (text) => {
  if (!text) return ''
  // Convert **bold** to <strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Convert line breaks
  formatted = formatted.replace(/\n/g, '<br>')
  return formatted
}

const sendQuickQuestion = (question) => {
  inputText.value = question
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // Add user message
  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value.map(m => ({ role: m.role, content: m.content }))
      }),
    })

    const data = await response.json()

    if (data.success && data.reply) {
      messages.value.push({ role: 'assistant', content: data.reply })
    } else {
      messages.value.push({
        role: 'assistant',
        content: data.message || 'Sorry, something went wrong. Please try again!'
      })
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Oops! I couldn\'t connect right now. Please check your connection and try again.'
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
    nextTick(() => {
      chatInput.value?.focus()
    })
  }
}

// Watch messages for auto-scroll
watch(messages, () => scrollToBottom(), { deep: true })
</script>

<style scoped>
/* Chat pop-in animation */
.chat-pop-enter-active {
  animation: chatPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}
.chat-pop-leave-active {
  animation: chatPopOut 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes chatPopIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    transform-origin: bottom right;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    transform-origin: bottom right;
  }
}

@keyframes chatPopOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    transform-origin: bottom right;
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    transform-origin: bottom right;
  }
}

/* Message list animations */
.msg-list-enter-active,
.msg-list-leave-active {
  transition: all 0.4s ease;
}
.msg-list-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}
.msg-list-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* Typing dots animation */
.typing-dot {
  animation: typingBounce 1.4s infinite ease-in-out both;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Custom scrollbar for messages */
#chatbot-messages::-webkit-scrollbar {
  width: 5px;
}
#chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}
#chatbot-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
#chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Markdown prose formatting */
:deep(strong) {
  color: #1e40af;
  font-weight: 700;
}
</style>
