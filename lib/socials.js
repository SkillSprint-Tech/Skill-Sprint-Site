/**
 * Outbound links, shared by the site and the email templates.
 *
 * Lives in lib/ rather than src/data/site.js so the server-rendered emails and the client
 * cannot drift apart — a changed handle is one edit, not a hunt through templates.
 */
export const SITE_URL = 'https://www.skillsprint.pk/'

export const SOCIAL_LINKS = [
  { label: 'Website', url: SITE_URL },
  { label: 'WhatsApp Community', url: 'https://chat.whatsapp.com/KMRR73MXbjGC8U5i7avGNC?mode=ac_c' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/skill-sprint-pk/' },
  { label: 'Instagram', url: 'https://www.instagram.com/skillsprint.pk?igsi=MWliaGdwdm14Zno0bQ==' },
  { label: 'Facebook', url: 'https://www.facebook.com/61574423429284/mentions/' },
]

export const SITE_NAME = 'Skill Sprint'
