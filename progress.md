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
