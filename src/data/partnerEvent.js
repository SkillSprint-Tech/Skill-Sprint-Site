/**
 * The active partner event currently being promoted. Shared by the Community page
 * section, the home page announcement popup, and the countdown widget so details
 * only live in one place.
 */
export const partnerEvent = {
  // Section anchor on /community, the target of the popup's "See details" link.
  anchor: 'aws-from-zero',
  name: 'AWS From Zero',
  subtitle: 'Your First Step into the AWS World',
  host: 'AWS SBG – UHE Lahore',
  hostFull: 'AWS Student Builder Group – UHE Lahore',
  poster: '/aws-from-zero-poster.jpg',
  posterAlt: 'AWS From Zero: Your First Step into the AWS World — beginner-friendly session by AWS SBG UHE Lahore',
  banner: '/aws-from-zero-banner.jpg',
  bannerAlt: 'AWS From Zero event banner — 27 December 2026, Intro to AWS, Registrations Open',
  popupBadge: '☁️ Beginner-Friendly Session',
  chipTop: 'E-Certificates Included',
  chipBottomValue: 'FREE',
  chipBottomLabel: 'All Welcome',
  summary:
    'Curious about AWS & Cloud Computing? Join our beginner-friendly session by AWS SBG – UHE Lahore. No prior experience required — everyone is welcome!',
  learnItems: [
    'Introduction to AWS & Cloud Computing',
    'Key AWS services & real-world applications',
    'AWS learning resources and career opportunities',
  ],
  certificateNote: 'E-certificates will be provided to all attendees through our official community.',
  date: '27 December 2026 (Sunday)',
  time: '11:00 AM – 1:00 PM PKT',
  // Start and end times in Pakistan time (PKT, UTC+5) from the official Meetup listing.
  startsAt: '2026-12-27T11:00:00+05:00',
  endsAt: '2026-12-27T13:00:00+05:00',
  venue: 'To be announced soon',
  referralCode: 'SkillsPrint-18',
  registerUrl: 'https://www.meetup.com/aws-sbg-at-university-of-home-economics/events/317527462/',
  whatsappUrl: 'https://chat.whatsapp.com/ETqHPFb8o7fGQQbMAKduxN',
  linkedinUrl: 'https://lnkd.in/p/dAmyiugv',
  instagramUrl: 'https://www.instagram.com/p/DgA1hYLMXxr/?knvt=MWcxZ2NmcmhyNTNoMw==',
  isPast: false,
  status: 'Registrations Open',
}

/**
 * Previously promoted partner event kept in the Past Endeavour archive on /community.
 */
export const pastPartnerEvent = {
  anchor: 'loopverse',
  name: 'LoopVerse 3.0',
  host: 'LoopLab',
  poster: '/loopverse-3-outreach-partner.jpg',
  posterAlt: 'LoopLab proudly announce Skill Sprint as LoopVerse 3.0 Outreach Partner',
  modules: ['Web Dev', 'App Dev', 'Game Dev', 'AI/ML', 'Cybersecurity', 'UI/UX', 'Idea Pitching'],
  date: '9th October 2026',
  venue: 'Onsite at CEGA, NASTP Lahore, or virtual',
  websiteUrl: 'https://www.looplab.site/',
  status: 'Concluded',
}
