// Writes the complete-file code blocks of one task in the certificates plan to disk.
// Usage: node scripts/extract-plan-files.mjs <taskNumber>
import fs from 'node:fs'
import path from 'node:path'

const PLAN = 'docs/superpowers/plans/2026-09-17-workshop-certificates.md'
const task = process.argv[2]
if (!task) {
  console.error('Usage: node scripts/extract-plan-files.mjs <taskNumber>')
  process.exit(1)
}

const text = fs.readFileSync(PLAN, 'utf8')
const start = text.indexOf(`\n## Task ${task}:`)
if (start < 0) throw new Error(`Task ${task} not found`)
const next = text.indexOf('\n## Task ', start + 1)
const section = text.slice(start, next < 0 ? undefined : next)

const pattern = /<!-- file: (.+?) -->\r?\n```[a-z]*\r?\n([\s\S]*?)\r?\n```/g
let count = 0
for (const [, file, body] of section.matchAll(pattern)) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, body.replace(/\r\n/g, '\n') + '\n')
  console.log('wrote', file)
  count++
}
if (!count) console.log('no file blocks in task', task)
