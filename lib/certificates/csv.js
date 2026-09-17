/**
 * RFC 4180 CSV parser. Handles quoted fields, "" escapes, CR / LF / CRLF line breaks —
 * including inside quotes, which Google Forms headers contain — and a leading BOM.
 * Returns string[][] and drops rows where every cell is blank.
 */
export function parseCsv(text) {
  const input = String(text ?? '').replace(/^﻿/, '')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (inQuotes) {
      if (ch !== '"') field += ch
      else if (input[i + 1] === '"') {
        field += '"'
        i++
      } else inQuotes = false
      continue
    }

    if (ch === '"' && field === '') inQuotes = true
    else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += ch
  }

  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}
