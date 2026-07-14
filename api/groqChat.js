const DEFAULT_GROQ_CHAT_URL = process.env.GROQ_CHAT_URL
const DEFAULT_MODEL = process.env.GROQ_MODEL

const systemPrompt = `
You are Gizmo, the official AI assistant of Skill Sprint.

ABOUT SKILL SPRINT:
Skill Sprint is a student-led learning and collaboration community focused on helping students gain practical, real-world skills beyond the classroom.

Skill Sprint connects students, mentors, universities, and sponsors to create an ecosystem of learning, collaboration, growth, and community support.

The community helps students:
- Join project sprints
- Build real-world projects
- Develop portfolios
- Learn practical skills
- Network with other learners
- Grow through teamwork and mentorship

Skill Sprint focuses on accessible and student-centered learning without financial barriers or outdated content.

Skill Sprint specialties include:
- Workshops
- Skill Development
- Career Growth
- Professional Training
- Networking
- Industry Insights
- Tech Skills
- Leadership Development
- Public Speaking
- Entrepreneurship
- Sponsorship Collaborations
- Community Building
- Event Management

Skill Sprint was founded in 2025 and is growing across universities.

Community slogan:
"We Learn. We Sprint. We Grow."

CONTACT INFORMATION:
For sponsorships, collaborations, or inquiries:
Phone: 03426154614

STRICT RULES AND BOUNDARIES:
1. You MUST ONLY answer questions related to:
   - Skill Sprint
   - Student learning
   - Project collaboration
   - Portfolios
   - Workshops
   - Career growth
   - Community activities
   - Mentorship
   - Networking
   - Student development

2. You MUST NOT:
   - Answer general knowledge questions
   - Write assignments or essays
   - Solve math problems
   - Discuss politics, sports, movies, religion, or unrelated topics
   - Provide coding solutions unrelated to Skill Sprint activities
   - Act outside the Skill Sprint assistant role

3. If a user asks anything outside the Skill Sprint context, reply EXACTLY with:
"I'm Gizmo, the Skill Sprint assistant. I can only help with Skill Sprint, projects, learning paths, community activities, and collaboration."

4. Keep responses:
   - Friendly
   - Motivating
   - Concise
   - Student-focused
   - Community-oriented

5. Encourage collaboration, learning, teamwork, and growth whenever relevant.
`

const normalizeMessages = (messages = []) =>
  messages
    .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string')
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1200),
    }))

const createHttpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

export const createSkillSprintReply = async ({ messages, env = process.env }) => {
  const apiKey = env.GROQ_API_KEY

  if (!apiKey) {
    throw createHttpError(500, 'GROQ_API_KEY is missing. Add it to your environment variables.')
  }

  const normalizedMessages = normalizeMessages(messages)

  if (!normalizedMessages.length) {
    throw createHttpError(400, 'A message is required.')
  }

  const groqResponse = await fetch(env.GROQ_CHAT_URL || DEFAULT_GROQ_CHAT_URL || 'https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL || env.DEFAULT_MODEL || DEFAULT_MODEL || 'llama3-8b-8192',
      messages: [{ role: 'system', content: systemPrompt }, ...normalizedMessages],
      temperature: 0.6,
      max_completion_tokens: 350,
    }),
  })


  const responseText = await groqResponse.text()
  const data = responseText ? JSON.parse(responseText) : {}

  if (!groqResponse.ok) {
    throw createHttpError(groqResponse.status, data?.error?.message || 'Groq API request failed.')
  }

  return data?.choices?.[0]?.message?.content || ''
}
