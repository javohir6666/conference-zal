# VPS deployment uchun production server
# Bu fayl faqat production da ishlatiladi

# Build qilish
npm run build

# Server ishga tushirish
npm start

# Yoki background da ishlatish uchun:
# PM2 bilan: pm2 start server.js --name "arenda-zala"
# systemd bilan: sudo systemctl start arenda-zala
