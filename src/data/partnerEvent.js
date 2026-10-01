/**
 * The partner event currently being promoted. Shared by the Community page section
 * and the home page announcement popup so the details only live in one place.
 */
export const partnerEvent = {
  // Also the localStorage suffix for "dismissed", so a new event shows its popup again.
  id: 'loopverse-3',
  // Section anchor on /community, the target of the popup's "See details" link.
  anchor: 'loopverse',
  name: 'LoopVerse 3.0',
  host: 'LoopLab',
  poster: '/loopverse-3-outreach-partner.jpg',
  posterAlt: 'LoopLab proudly announce Skill Sprint as LoopVerse 3.0 Outreach Partner',
  modules: ['Web Dev', 'App Dev', 'Game Dev', 'AI/ML', 'Cybersecurity', 'UI/UX', 'Idea Pitching'],
  date: '9th October 2026',
  // End of the event day in Pakistan time. The popup stops showing after this.
  endsAt: '2026-10-09T23:59:59+05:00',
  venue: 'Onsite at CEGA, NASTP Lahore, or virtual',
  promoCode: 'LL-SPRINT',
  promoOffer: '10% off registration',
  registerUrl: 'https://www.looplab.site/loopverse/register',
}
