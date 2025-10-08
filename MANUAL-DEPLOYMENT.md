# QOLDA O'RNATISH QOLLANMASI
# VPS da systemd bilan Arenda-Zala.uz deploy qilish

## 1. SERVER TAYYORLASH

```bash
# VPS ga kirish
ssh root@your-server-ip

# Sistema yangilash
sudo apt update && sudo apt upgrade -y

# Node.js o'rnatish (20.x versiya)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# Node.js versiyasini tekshirish
node --version  # v20.x.x bo'lishi kerak
npm --version   # 10.x.x bo'lishi kerak
```

## 2. USER VA PAPKA YARATISH

```bash
# Maxsus user yaratish
sudo useradd --system --shell /bin/bash --home /var/www/arenda-zala nodejs

# Loyiha papkasini yaratish
sudo mkdir -p /var/www/arenda-zala
sudo chown nodejs:nodejs /var/www/arenda-zala
```

## 3. LOYIHA YUKLASH

```bash
# Git orqali loyihani yuklash
sudo -u nodejs git clone https://github.com/your-username/conference-zal.git /var/www/arenda-zala

# Papkaga o'tish
cd /var/www/arenda-zala

# Ruxsatlarni tekshirish
ls -la
```

## 4. DEPENDENCIES O'RNATISH

```bash
# NPM packages o'rnatish
sudo -u nodejs npm install

# Build qilish
sudo -u nodejs npm run build

# Build natijasini tekshirish
ls -la dist/
```

## 5. ENVIRONMENT FILE SOZLASH

```bash
# .env file yaratish
sudo -u nodejs nano /var/www/arenda-zala/.env

# Ichiga quyidagilarni yozing:
NODE_ENV=production
PORT=3000
TELEGRAM_BOT_TOKEN=8306392170:AAGVQtfbbsAMe2soZCsdLrBlGKaRPOWA1sQ
TELEGRAM_CHAT_ID=6509449401
VITE_YMAPS_API_KEY=your_maps_key
VITE_MAP_LAT=41.311081
VITE_MAP_LNG=69.240562
# ... boshqa environment variables

# File saqlash: Ctrl+X, Y, Enter
```

## 6. SYSTEMD SERVICE O'RNATISH

```bash
# Service file yaratish
sudo nano /etc/systemd/system/arenda-zala.service

# Ichiga quyidagilarni yozing:
[Unit]
Description=Arenda Zala Conference Hall Booking System
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/var/www/arenda-zala
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/var/www/arenda-zala/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target

# File saqlash: Ctrl+X, Y, Enter
```

## 7. SERVICE YOQISH

```bash
# Systemd ni qayta yuklash
sudo systemctl daemon-reload

# Service ni yoqish
sudo systemctl enable arenda-zala

# Service ni ishga tushirish
sudo systemctl start arenda-zala

# Status tekshirish
sudo systemctl status arenda-zala

# Loglarni ko'rish
sudo journalctl -u arenda-zala -f
```

## 8. NGINX SOZLASH

```bash
# Nginx config yaratish
sudo nano /etc/nginx/sites-available/arenda-zala.uz

# Ichiga config yozing (yuqoridagi fayl)

# Saytni yoqish
sudo ln -s /etc/nginx/sites-available/arenda-zala.uz /etc/nginx/sites-enabled/

# Nginx test qilish
sudo nginx -t

# Nginx qayta ishga tushirish
sudo systemctl restart nginx
```

## 9. SSL SERTIFIKAT

```bash
# Certbot o'rnatish
sudo apt install certbot python3-certbot-nginx -y

# SSL sertifikat olish
sudo certbot --nginx -d arenda-zala.uz -d www.arenda-zala.uz
```

## 10. FIREWALL

```bash
# UFW sozlash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 11. MONITORING

```bash
# Service statusini tekshirish
sudo systemctl status arenda-zala

# Loglarni ko'rish
sudo journalctl -u arenda-zala -f

# Service qayta ishga tushirish
sudo systemctl restart arenda-zala

# Service to'xtatish
sudo systemctl stop arenda-zala
```

## 12. YANGILASH JARAYONI

```bash
# Yangi kod yuklash
cd /var/www/arenda-zala
sudo -u nodejs git pull

# Dependencies yangilash
sudo -u nodejs npm install

# Build qayta qilish
sudo -u nodejs npm run build

# Service qayta ishga tushirish
sudo systemctl restart arenda-zala
```

Bu jarayon bilan sizning saytingiz to'liq ishlaydigan bo'ladi!
Domain: https://arenda-zala.uz
