<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans">
    
    <!-- ── CONTACT FORM SECTION ── -->
    <section class="px-4 sm:px-8 py-4 sm:py-6">
      <div class="max-w-[1312px] mx-auto">
        
        <!-- Main Container -->
        <div class="bg-[rgba(1,120,255,0.05)] rounded-[16px] sm:rounded-[16px] p-[6.7px] sm:p-6">
          <div class="flex flex-col lg:flex-row gap-[11.17px] sm:gap-10">
            
            <!-- LEFT PANEL - Blue Info (HIDDEN ON MOBILE) -->
            <div class="bg-[#0178FF] rounded-[16px] p-[40px] text-white flex flex-col justify-between
                        w-full lg:w-[500px] min-h-[510.51px] lg:min-h-[794px]
                        hidden sm:flex">
              
              <!-- Title Section -->
              <div class="flex flex-col gap-2 w-full">
                <p class="text-[12px] font-medium tracking-[-0.12px] opacity-80 uppercase">Contact US</p>
                <h1 class="text-[34px] sm:text-[42px] lg:text-[64px] font-semibold leading-[1.1] tracking-tight">
                  Let's Build<br />Something<br />Together
                </h1>
                <p class="text-[18px] font-normal leading-[28px] opacity-90 max-w-[420px]">
                  Have an idea, partnership proposal, or question?<br />
                  Send it our way and let's sprint on it.
                </p>
              </div>

              <!-- Contact Details - DESKTOP ONLY (Inside blue panel) -->
              <div class="flex flex-col justify-center items-start p-[12px_0px] gap-[4px] w-full sm:w-[354px] h-[142px] mt-6 lg:mt-0">
                
                <!-- Email Section -->
                <div class="flex flex-row items-center p-0 gap-[8px] w-full sm:w-[354px] h-[66px]">
                  <div class="flex flex-row justify-center items-center p-[12px] gap-[32px] w-[48px] h-[48px] bg-[#0A0A0A] rounded-[8px] shrink-0">
                    <div class="relative w-[24px] h-[24px]">
                      <svg class="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col justify-center items-start p-0 w-full sm:w-[298px] h-[66px]">
                    <p class="font-archivo font-medium text-[14px] leading-[22px] tracking-[-0.18px] text-white w-full sm:w-[298px] h-[22px]">Email</p>
                    <p class="font-archivo font-normal text-[12px] leading-[20px] text-white w-full sm:w-[298px] h-[20px]">skillsprint@gmail.com</p>
                  </div>
                </div>

                <!-- Phone Section -->
                <div class="flex flex-row items-center p-0 gap-[8px] w-full sm:w-[354px] h-[48px]">
                  <div class="flex flex-row justify-center items-center p-[12px] gap-[32px] w-[48px] h-[48px] bg-[#0A0A0A] rounded-[8px] shrink-0">
                    <div class="relative w-[24px] h-[24px]">
                      <svg class="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col items-start p-0 w-full sm:w-[298px] h-[46px]">
                    <p class="font-archivo font-medium text-[14px] leading-[22px] tracking-[-0.18px] text-white w-full sm:w-[298px] h-[22px]">Phone</p>
                    <p class="font-archivo font-normal text-[12px] leading-[20px] text-white w-full sm:w-[298px] h-[20px]">+92 317 444 4441</p>
                  </div>
                </div>

              </div>
            </div>

            <!-- RIGHT PANEL - Form -->
            <div class="bg-transparent rounded-[16px] p-0 sm:p-0 flex-1 w-full">
              
              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="flex flex-col gap-[16px] w-full">
                
                <!-- Row 1: Full Name + Email -->
                <div class="flex flex-col sm:flex-row gap-[16px] w-full">
                  <div class="flex flex-col gap-2 w-full sm:w-[354px]">
                    <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                      Full Name <span class="text-red-400">*</span>
                    </label>
                    <input 
                      v-model="form.fullName"
                      type="text"
                      placeholder="Enter your first name"
                      class="w-full px-4 py-[16px] rounded-[12px] bg-white border border-[#D4D4D4] 
                             text-[14px] text-gray-800 placeholder-[#737373]
                             focus:outline-none focus:ring-2 focus:ring-[#0178FF]/30 focus:border-[#0178FF]
                             transition h-[52px]"
                    />
                  </div>
                  <div class="flex flex-col gap-2 w-full sm:w-[354px]">
                    <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                      Email Address <span class="text-red-400">*</span>
                    </label>
                    <input 
                      v-model="form.email"
                      type="email"
                      placeholder="Enter your email"
                      class="w-full px-4 py-[16px] rounded-[12px] bg-white border border-[#D4D4D4] 
                             text-[14px] text-gray-800 placeholder-[#737373]
                             focus:outline-none focus:ring-2 focus:ring-[#0178FF]/30 focus:border-[#0178FF]
                             transition h-[52px]"
                    />
                  </div>
                </div>

                <!-- Row 2: Phone + University -->
                <div class="flex flex-col sm:flex-row gap-[16px] w-full">
                  <div class="flex flex-col gap-2 w-full sm:w-[354px]">
                    <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                      Phone Number <span class="text-red-400">*</span>
                    </label>
                    <div class="flex items-center w-full h-[52px] rounded-[12px] bg-white border border-[#D4D4D4] overflow-hidden">
                      <span class="px-4 flex items-center gap-2 border-r border-[#D4D4D4] h-full text-[14px] text-[#737373]">
                        🇺🇸 US
                      </span>
                      <input 
                        v-model="form.phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        class="flex-1 px-4 py-[16px] bg-transparent text-[14px] text-gray-800 placeholder-[#737373]
                               focus:outline-none h-full"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 w-full sm:w-[354px]">
                    <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                      University / Organization
                    </label>
                    <input 
                      v-model="form.organization"
                      type="text"
                      placeholder="Enter your University / Organization"
                      class="w-full px-4 py-[16px] rounded-[12px] bg-white border border-[#D4D4D4] 
                             text-[14px] text-gray-800 placeholder-[#737373]
                             focus:outline-none focus:ring-2 focus:ring-[#0178FF]/30 focus:border-[#0178FF]
                             transition h-[52px]"
                    />
                  </div>
                </div>

                <!-- Purpose -->
                <div class="flex flex-col gap-2 w-full">
                  <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                    Purpose of Contact <span class="text-red-400">*</span>
                  </label>
                  <select 
                    v-model="form.purpose"
                    class="w-full px-4 py-[16px] rounded-[8px] bg-white border border-[#D4D4D4] 
                           text-[14px] text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#0178FF]/30 
                           focus:border-[#0178FF] transition h-[52px] appearance-none"
                  >
                    <option value="" disabled selected>Select Purpose</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Student Programs">Student Programs &amp; Events</option>
                    <option value="Partnerships">Academic Partnerships</option>
                    <option value="Corporate">Corporate Partnerships</option>
                    <option value="Volunteer">Volunteer &amp; Mentorship</option>
                    <option value="Hiring">Talent Acquisition</option>
                    <option value="Media">Media &amp; Press</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <!-- Message -->
                <div class="flex flex-col gap-1 w-full">
                  <label class="text-[16px] font-medium text-black tracking-[0.5px]">
                    Message <span class="text-red-400">*</span>
                  </label>
                  <textarea 
                    v-model="form.message"
                    rows="4"
                    placeholder="Write your message..."
                    class="w-full px-4 py-[16px] rounded-[12px] bg-white border border-[#D4D4D4] 
                           text-[14px] text-gray-800 placeholder-[#737373] resize-none
                           focus:outline-none focus:ring-2 focus:ring-[#0178FF]/30 focus:border-[#0178FF]
                           transition min-h-[294px] sm:min-h-[294px]"
                  ></textarea>
                </div>

                <!-- Checkbox + Submit -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full pt-2">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" v-model="agreed" class="mt-0.5 w-[24px] h-[24px] rounded-[3px] border-[#A3A3A3] text-[#0178FF] focus:ring-[#0178FF]" />
                    <span class="text-[16px] text-black leading-[20px] tracking-[0.5px]">
                      You agree to our friendly 
                      <a href="#" class="text-[#0178FF] underline decoration-[#0178FF] decoration-1 underline-offset-2">privacy policy.</a>
                    </span>
                  </label>

                  <button 
                    type="submit"
                    :disabled="isSubmitting || !agreed"
                    class="w-full sm:w-[141px] bg-[#0178FF] hover:bg-[#0168E0] text-white font-medium 
                           py-[12px] px-[24px] rounded-[12px] text-[14px] tracking-[-0.16px]
                           transition disabled:opacity-50 disabled:cursor-not-allowed h-[44px]"
                  >
                    <span v-if="isSubmitting">Sending...</span>
                    <span v-else>Send Message</span>
                  </button>
                </div>

              </form>

              <!-- ── EMAIL & PHONE SECTION (MOBILE ONLY - BELOW FORM) ── -->
              <div class="flex flex-col justify-center items-start p-[12px_0px] gap-[4px] w-full sm:w-[354px] h-[142px] mt-6 sm:hidden">
                
                <!-- Email Section -->
                <div class="flex flex-row items-center p-0 gap-[8px] w-full sm:w-[354px] h-[66px]">
                  <div class="flex flex-row justify-center items-center p-[12px] gap-[32px] w-[48px] h-[48px] bg-[#0A0A0A] rounded-[8px] shrink-0">
                    <div class="relative w-[24px] h-[24px]">
                      <svg class="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col justify-center items-start p-0 w-full sm:w-[298px] h-[66px]">
                    <p class="font-archivo font-medium text-[14px] leading-[22px] tracking-[-0.18px] text-black w-full sm:w-[298px] h-[22px]">Email</p>
                    <p class="font-archivo font-normal text-[12px] leading-[20px] text-black w-full sm:w-[298px] h-[20px]">skillsprint@gmail.com</p>
                  </div>
                </div>

                <!-- Phone Section -->
                <div class="flex flex-row items-center p-0 gap-[8px] w-full sm:w-[354px] h-[48px]">
                  <div class="flex flex-row justify-center items-center p-[12px] gap-[32px] w-[48px] h-[48px] bg-[#0A0A0A] rounded-[8px] shrink-0">
                    <div class="relative w-[24px] h-[24px]">
                      <svg class="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col items-start p-0 w-full sm:w-[298px] h-[46px]">
                    <p class="font-archivo font-medium text-[14px] leading-[22px] tracking-[-0.18px] text-black w-full sm:w-[298px] h-[22px]">Phone</p>
                    <p class="font-archivo font-normal text-[12px] leading-[20px] text-black w-full sm:w-[298px] h-[20px]">+92 317 444 4441</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PARTNER CTA SECTION ── -->
    <section class="relative w-full overflow-hidden bg-[#F8FAFC]">
      <div class="relative w-full max-w-[1440px] mx-auto h-[160.24px] sm:h-[574px]">
        
        <div class="absolute left-0 right-0 top-[48.24%] bottom-[1.75%] sm:block hidden
                    bg-gradient-to-b from-[#91DEFF] to-[#0178FF] opacity-24 
                    blur-[60px] rounded-[174px_435px_0px_0px]"></div>
        
        <div class="absolute left-0 right-0 top-[48.48%] bottom-[1.51%] sm:hidden block
                    bg-gradient-to-b from-[#91DEFF] to-[#0178FF] opacity-24 
                    blur-[16.75px] rounded-[48.575px_121.438px_0px_0px]"></div>

        <div class="absolute left-1/2 -translate-x-1/2 
                    w-[382px] sm:w-[1220px] 
                    h-[134.67px] sm:h-[331px]
                    top-[calc(50%-67.33px)] sm:top-[calc(50%-165.5px)]
                    bg-white border border-[rgba(0,0,0,0.08)] 
                    rounded-[11.1667px] sm:rounded-[40px]
                    flex flex-col items-center justify-center
                    px-[40.2px] sm:px-[144px] 
                    py-[22.3333px] sm:py-[80px]">

          <div class="flex flex-col items-center gap-[16px] sm:gap-[32px] w-full max-w-[302px] sm:max-w-[930px]">
            
            <div class="flex flex-col items-center gap-[8px] w-full">
              <h2 class="font-archivo font-bold text-[#0C0E0F] text-center 
                        text-[24px] sm:text-[56px] 
                        leading-[26px] sm:leading-[56px]
                        tracking-[-0.016em]
                        w-[302px] sm:w-[700px]
                        whitespace-nowrap">
                Partner with <span class="text-[#0178FF] relative inline-block"> Skill Sprint
                  <span class="absolute left-0 -bottom-1 w-full h-[4px] sm:h-[10px] bg-[#0178FF] rotate-[-2deg] opacity-80"></span>
                </span>
              </h2>
              
              <p class="font-inter sm:font-archivo font-normal text-[#0C0E0F] text-center
                        text-[12px] sm:text-[20.3px]
                        leading-[13px] sm:leading-[30px]
                        w-[302px] sm:w-[930px]">
                Collaborate with us to empower students globally.
              </p>
            </div>

            <div class="flex flex-row justify-center items-center gap-[8px] 
                        w-[193px] sm:w-[269px] 
                        h-[27px] sm:h-[44px]">
              <button class="bg-[#0178FF] hover:bg-[#0168E0] text-white 
                            rounded-[27.9167px] sm:rounded-[100px]
                            px-[12px] sm:px-[20px] 
                            py-[6px] sm:py-[12px]
                            flex items-center justify-center
                            w-[103px] sm:w-[143px] 
                            h-[27px] sm:h-[44px]">
                <span class="font-archivo font-semibold sm:font-medium 
                            text-[12px] sm:text-[16px]
                            leading-[124%] 
                            tracking-[-0.02em]
                            text-white
                            w-[79px] sm:w-[103px]">
                  Join the Sprint
                </span>
              </button>
              <button class="bg-[rgba(26,26,26,0.1)] hover:bg-[rgba(26,26,26,0.15)]
                            rounded-[27.9167px] sm:rounded-[100px]
                            px-[12px] sm:px-[20px]
                            py-[6px] sm:py-[12px]
                            flex items-center justify-center
                            w-[82px] sm:w-[118px]
                            h-[27px] sm:h-[44px]">
                <span class="font-archivo font-semibold sm:font-medium
                            text-[12px] sm:text-[16px]
                            leading-[124%]
                            tracking-[-0.02em]
                            text-[#212121]
                            w-[58px] sm:w-[78px]">
                  Contact us
                </span>
              </button>
            </div>
          </div>
        </div>

        <div class="absolute hidden sm:block
                    w-[700.98px] h-[889.98px]
                    left-[915px] top-[-70.62px]
                    pointer-events-none select-none
                    rotate-[-12.11deg]">
          <img src="/src/assets/cb877c421c749c65ca71d83d3c2eab9e3f2ba7c1.png" alt="Robot" class="w-full h-full object-contain" />
        </div>

        <div class="absolute sm:hidden block
                    w-[189.24px] h-[189.24px]
                    left-[269.91px] top-[18.99px]
                    pointer-events-none select-none
                    rotate-[-6.77deg]">
          <img src="/src/assets/cb877c421c749c65ca71d83d3c2eab9e3f2ba7c1.png" alt="Robot" class="w-full h-full object-contain" />
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  purpose: '',
  message: ''
})

const agreed = ref(false)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!agreed.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  setTimeout(() => {
    alert('Message sent! We\'ll get back to you soon.')
    Object.assign(form, { fullName: '', email: '', phone: '', organization: '', purpose: '', message: '' })
    agreed.value = false
    isSubmitting.value = false
  }, 1500)
}
</script>