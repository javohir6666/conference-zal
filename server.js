import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules uchun __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (Frontend build)
app.use(express.static(path.join(__dirname, 'dist')));

// Lead endpoint
app.post('/api/lead', async (req, res) => {
  const { name, phone, date, guests, hall } = req.body;
  
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials not configured' });
  }
  
  if (!name || !phone || !date || !guests || !hall) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Hall nomini to'liq ko'rinishga aylantirish
    const getHallName = (hall) => {
      switch(hall) {
        case '500': return '500 kishilik - Katta zal';
        case '50': return '50 kishilik - O\'rta zal';
        case '20': return '20 kishilik - Kichik zal (Uchrashuvlar)';
        case 'unknown': return 'Aniq emas (Operator bilan kelishiladi)';
        default: return hall;
      }
    };

    // Sanani formatlash
    const formatDate = (dateStr) => {
      try {
        const date = new Date(dateStr);
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        };
        return date.toLocaleDateString('uz-UZ', options);
      } catch {
        return dateStr;
      }
    };

    // Vaqt tamg'asi
    const timestamp = new Date().toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // To'liq message yaratish
    const text = `🎯 <b>YANGI ARIZA - ARENDA-ZALA.UZ</b>

👤 <b>Mijoz ma'lumotlari:</b>
   • Ism: <code>${name}</code>
   📞 Telefon: <a href="tel:${phone}">${phone}</a>

📅 <b>Tadbir ma'lumotlari:</b>
   • Sana: <b>${formatDate(date)}</b>
   👥 Ishtirokchilar soni: <b>${guests} kishi</b>
   🏛 Zal: <b>${getHallName(hall)}</b>

⏰ <b>Ariza vaqti:</b> ${timestamp}

🔔 <i>Iltimos, mijoz bilan 15 daqiqa ichida bog'laning!</i>

━━━━━━━━━━━━━━━━━━━━━
🌐 arenda-zala.uz | 📞 +998994084408`;
    
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram response error: ${data.description}`);
    }
    
    res.json({ 
      success: true, 
      message: '✅ Arizangiz muvaffaqiyatli yuborildi! Operator tez orada siz bilan bog\'lanadi.',
      details: {
        timestamp: timestamp,
        hall: getHallName(hall),
        guests: guests,
        date: formatDate(date)
      }
    });
    
  } catch (error) {
    console.error('❌ Telegram API Error:', error);
    res.status(500).json({ 
      error: '❌ Arizani yuborishda xatolik yuz berdi',
      message: 'Iltimos, qaytadan urinib ko\'ring yoki to\'g\'ridan-to\'g\'ri qo\'ng\'iroq qiling: +998 99 408 4408',
      details: error.message,
      timestamp: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Barcha boshqa requestlarni frontend ga yo'naltirish (SPA uchun)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Full-stack server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`🤖 Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Configured' : 'Missing'}`);
  console.log(`💬 Chat ID: ${process.env.TELEGRAM_CHAT_ID ? 'Configured' : 'Missing'}`);
});
