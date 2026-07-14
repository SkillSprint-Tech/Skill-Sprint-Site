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
          const apiFile = req.url.split('?')[0].replace('/api/', '') + '.js'
          const filePath = path.resolve(__dirname, 'api', apiFile)
          
          if (fs.existsSync(filePath)) {
            if (req.method === 'POST' || req.method === 'PUT') {
              let body = ''
              req.on('data', chunk => { body += chunk.toString() })
              await new Promise(resolve => req.on('end', resolve))
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