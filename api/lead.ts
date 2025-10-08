// Vercel-style serverless function to relay leads to Telegram
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  phone: z.string(),
  date: z.string(),
  guests: z.number(),
  hall: z.string(),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return res.status(500).json({ error: 'Telegram env missing' })

  try {
    const parsed = schema.parse(req.body)
    const parts = [
      `⭐️ Yangi ariza`,
      `👤 Ism: ${parsed.name}`,
      `📞 Tel: ${parsed.phone}`,
      `📅 Sana: ${parsed.date}`,
      `👥 Soni: ${parsed.guests}`,
      `🏛 Zal: ${parsed.hall}`
    ]
    const text = parts.join('\n')

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`
    const r = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    })
    if (!r.ok) throw new Error('telegram error')
    const data = await r.json()
    if (!data.ok) throw new Error('telegram not ok')
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'bad request' })
  }
}
