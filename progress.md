# Progress

## 2026-05-08

- Inspected the Vue/Vite project structure and existing landing page UI.
- Added `src/components/ChatBot.vue` for a fixed lower-right chatbot launcher and pop-up conversation panel.
- Styled the chatbot to match the site: light background, white card panel, rounded blue actions, subtle borders, and Phosphor icons.
- Added `api/chat.js` as a server-side Vercel API route for Groq chat completions so the API key stays out of frontend code.
- Used the official Groq chat completions endpoint: `https://api.groq.com/openai/v1/chat/completions`.
- Configured the chatbot API route to read `GROQ_API_KEY` and optional `GROQ_MODEL` from environment variables.
- Mounted the chatbot globally in `src/App.vue` so it appears across site pages.
- Verified the frontend with `npm run build`; production build completed successfully.
- Started the local Vite dev server at `http://127.0.0.1:5173/` for UI preview.
- Fixed chatbot JSON parsing so empty or non-JSON API responses show a clean error instead of crashing.
- Fixed `api/chat.js` constants and added fallback Groq URL/model values.
- Re-ran `npm run build` successfully and checked `api/chat.js` syntax with `node --check`.
- Found local `/api/chat` returned `404` because plain Vite does not run Vercel API functions.
- Added a Vite dev middleware in `vite.config.js` so `/api/chat` works on the local Vite server using the same `api/chat.js` handler and `.env` variables.
- Confirmed `.env` includes `GROQ_CHAT_URL`, `DEFAULT_MODEL`, and `GROQ_API_KEY`; the key was not printed.
- Confirmed the Groq key/model work by running the `api/chat.js` handler directly and receiving a successful response.
- Simplified the Vite middleware route matching so local `/api/chat` is handled consistently.
- Rewrote the local Vite middleware promise handling and added `/api/chat-health` for local middleware diagnostics.
- Extracted shared Groq request logic into `api/groqChat.js`.
- Updated `api/chat.js` and the Vite local middleware to use the shared Groq helper without the Vercel-style response adapter in local dev.

## 2026-10-15 (feature/cinematic-motion)

- Elevated entire website into an award-winning hybrid of k72.ca and apple.com across ALL public pages (not just the homepage).
- Preserved all theme colors, atomic CSS styling, routing, forms, data models, and API endpoints intact.
- Implemented centralized GSAP plugin architecture (`src/motion/gsap.js`) registering ScrollTrigger, SplitText, and custom eases ('cinematic', 'curtain', 'pop').
- Integrated Lenis smooth scroll engine driven by the GSAP ticker with auto-pause on modal locks.
- Added global preloader (k72-style 000→100 counter with stair curtain), route change transitions, custom magnetic cursor ring, and top scroll progress bar.
- Upgraded every single view and card component:
  - **Home.vue**: Apple zoom hero pin stage, kinetic velocity marquee, 3D mascot cyber stage, 3D fanned cards scrub, floating testimonials with mouse parallax, holographic radar & count-ups, iridescent partner mesh.
  - **AboutView.vue**: 3D mascot cyber stage, SplitText title, step cards with hover lighting, animated timeline, and CTA.
  - **InitiativesView.vue & InitiativeCard.vue**: Blueprint grid, SplitText title, 3D perspective hover cards, magnetic filter pills.
  - **SprintsView.vue & SprintCard.vue**: Blueprint grid, SplitText rollout, kinetic velocity marquee, 3D fanned cards scrub for "How Sprints Work", 3D sprint cards, magnetic quiz triggers.
  - **WorkshopsView.vue**: Blueprint grid, SplitText reveal, kinetic marquee, floating tags with parallax, magnetic action buttons.
  - **CommunityView.vue**: Blueprint grid, SplitText title, kinetic marquee ("11 UNIVERSITIES · 1500+ BUILDERS"), pure GSAP count-up stats, 3D partner poster, organic floating receipts, cyber WhatsApp terminal.
  - **TeamView.vue & TeamMemberCard.vue**: Blueprint grid, SplitText reveal, kinetic marquee, pinned 3D fanned card deck for core team, laser-scanned cyberpunk locked terminal with animated sweep line, status beacon.
  - **MissionView.vue**: Blueprint grid, SplitText reveal, kinetic marquee ("ZERO GATEKEEPING · ZERO EDTECH"), 3D fanned core values, high-contrast problem stage, scale scrub quote.
  - **ContactUs.vue**: Spatial glassmorphic layout, SplitText title, illuminated contact conduits, floating robot mascot, focus glow rings, and magnetic submit button.
- Verified all 54 Vitest unit tests pass and `npm run build` bundles with zero errors. All routes return 200 OK.
