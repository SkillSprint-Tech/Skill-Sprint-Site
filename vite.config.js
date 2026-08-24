import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Simple Vite plugin to serve Vercel API routes locally
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/')) {
        try {
          const [rawPath, rawQuery] = req.url.split('?')
          // Supports nested routes too (e.g. /api/admin/login -> api/admin/login.js)
          const apiFile = rawPath.replace('/api/', '') + '.js'
          const filePath = path.resolve(__dirname, 'api', apiFile)

          if (fs.existsSync(filePath)) {
            // Vercel populates req.query; the dev server does not, so mirror it here.
            // Without this, handlers reading req.query.<name> silently see undefined.
            req.query = Object.fromEntries(new URLSearchParams(rawQuery || ''))

            // Parse a body for every method that can carry one. PATCH and DELETE were
            // previously omitted, which silently dropped their payloads in local dev.
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              await new Promise(resolve => req.on('end', resolve))
              req.rawBody = body
              if (body) {
                try {
                  req.body = JSON.parse(body)
                } catch(e) {
                  req.body = body
                }
              }
            }

            // Add some express-like helpers to res for Vercel functions
            res.status = (code) => {
              res.statusCode = code
              return res
            }
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
            res.send = (data) => {
              res.end(data)
            }

            const module = await import(`file://${filePath}?update=${Date.now()}`)
            const handler = module.default
            
            await handler(req, res)
            return
          }
        } catch (err) {
          console.error('API Error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
          return
        }
      }
      next()
    })
  }
})

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      vue(),
      tailwindcss(), // 👉 Add this to enable Tailwind
      vercelApiPlugin(),
    ],
  }
})