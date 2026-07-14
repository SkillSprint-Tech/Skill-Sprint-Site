import { createSkillSprintReply } from './groqChat.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  }

  try {
    const reply = await createSkillSprintReply({ messages: req.body?.messages })

    return res.status(200).json({
      success: true,
      reply,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal Server Error while connecting to Groq.',
    })
  }
}
