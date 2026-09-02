/**
 * Single source of truth for outbound links and contact details.
 *
 * Every component imports from here, so changing a handle is one edit rather than a
 * hunt through templates.
 *
 * NOTE: the URLs below are placeholders pending the real handles. Search for
 * PLACEHOLDER to find everything that still needs a real value.
 */

export const socials = [
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/skillsprint.pk/',
    icon: 'fab fa-facebook-f',
    hoverClass: 'hover:text-blue-600',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/skillsprint.pk/',
    icon: 'fab fa-instagram',
    hoverClass: 'hover:text-pink-600',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/skill-sprint-pk/',
    icon: 'fab fa-linkedin-in',
    hoverClass: 'hover:text-blue-700',
  },
]

/** The community group. Replaces the old Discord server. */
export const whatsappGroup = {
  label: 'WhatsApp Group',
  url: 'https://chat.whatsapp.com/KMRR73MXbjGC8U5i7avGNC',
  icon: 'fab fa-whatsapp',
}

export const contact = {
  email:"[EMAIL_ADDRESS]",
  workshopsEmail:"[EMAIL_ADDRESS]",
}

export const siteName = 'SkillSprint'
