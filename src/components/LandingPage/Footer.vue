<template>
  <footer class="w-full bg-white border-t border-gray-100 pt-10 pb-8 px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto">

      <!-- 4-column link grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 mb-10">
        <div v-for="(section, i) in footerLinks" :key="i" class="flex flex-col gap-2.5">
          <h3 class="text-gray-900 font-extrabold text-sm tracking-wide">{{ section.title }}</h3>
          <component
            v-for="(link, j) in section.links"
            :key="j"
            :is="link.external ? 'a' : 'router-link'"
            v-bind="link.external ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' } : { to: link.url }"
            class="text-gray-500 text-sm hover:text-blue-600 transition-colors duration-200 w-fit"
          >
            {{ link.label }}
          </component>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 my-6"></div>

      <!-- Bottom row -->
      <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-5">

        <!-- Logo + copyright -->
        <div class="flex flex-col items-center sm:items-start gap-1">
          <img src="/navlogo.png" alt="Skill Sprint" class="w-[110px] h-auto" />
          <p class="text-gray-400 text-xs">© 2026, All Rights Reserved</p>
        </div>

        <!-- Right side: social + legal -->
        <div class="flex flex-col items-center sm:items-end gap-3">
          <div class="flex gap-5 text-base text-gray-400">
            <a href="#" aria-label="Instagram" class="hover:text-blue-600 transition"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="TikTok" class="hover:text-blue-600 transition"><i class="fab fa-tiktok"></i></a>
            <a href="#" aria-label="YouTube" class="hover:text-red-600 transition"><i class="fab fa-youtube"></i></a>
          </div>
          <div class="flex gap-4 text-xs text-gray-400">
            <a href="/privacy" class="hover:text-blue-600 transition">Privacy Policy</a>
            <span class="text-gray-200">|</span>
            <a href="/licenses" class="hover:text-blue-600 transition">Licenses</a>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
const footerLinks = [
  {
    title: 'Navigate',
    links: [
      { label: 'Home',        url: '/' },
      { label: 'About',       url: '/about' },
      { label: 'Initiatives', url: '/initiatives' },
      { label: 'Sprints',     url: '/sprints' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Our Community',   url: '/community' },
      { label: 'Team',            url: '/team' },
      { label: 'Mission',         url: '/mission' },
      { label: 'Contact',         url: '/contact-us' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', url: 'https://instagram.com', external: true },
      { label: 'TikTok',    url: 'https://tiktok.com',   external: true },
      { label: 'YouTube',   url: 'https://youtube.com',  external: true },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Email Us',    url: '/contact-us' },
      { label: 'Join Sprint', url: '/contact-us' },
    ],
  },
]
</script>