#!/bin/bash

# ARENDA-ZALA.UZ - VPS DEPLOYMENT GUIDE
# Ubuntu/Debian server uchun to'liq o'rnatish qo'llanmasi

echo "🚀 Arenda-Zala.uz - VPS deployment boshlandi..."

# 1. SISTEMA YANGILASH
echo "📦 Sistema paketlarini yangilash..."
sudo apt update && sudo apt upgrade -y

# 2. NODE.JS O'RNATISH
echo "🟢 Node.js o'rnatish..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. GIT O'RNATISH
echo "📁 Git o'rnatish..."
sudo apt install git -y

# 4. NGINX O'RNATISH (reverse proxy uchun)
echo "🌐 Nginx o'rnatish..."
sudo apt install nginx -y

# 5. USER YARATISH
echo "👤 nodejs user yaratish..."
sudo useradd --system --shell /bin/bash --home /var/www/arenda-zala nodejs
sudo mkdir -p /var/www/arenda-zala
sudo chown nodejs:nodejs /var/www/arenda-zala

# 6. LOYIHA YUKLAB OLISH
echo "📥 Loyihani yuklash..."
sudo -u nodejs git clone https://github.com/username/conference-zal.git /var/www/arenda-zala
cd /var/www/arenda-zala

# 7. DEPENDENCIES O'RNATISH
echo "📦 NPM packages o'rnatish..."
sudo -u nodejs npm install

# 8. ENVIRONMENT FILE YARATISH
echo "⚙️  Environment file yaratish..."
sudo -u nodejs touch /var/www/arenda-zala/.env
echo "NODE_ENV=production" | sudo -u nodejs tee /var/www/arenda-zala/.env
echo "PORT=3000" | sudo -u nodejs tee -a /var/www/arenda-zala/.env
echo "TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE" | sudo -u nodejs tee -a /var/www/arenda-zala/.env
echo "TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE" | sudo -u nodejs tee -a /var/www/arenda-zala/.env

# 9. BUILD QILISH
echo "🔨 Frontend build qilish..."
sudo -u nodejs npm run build

# 10. SYSTEMD SERVICE O'RNATISH
echo "🔧 Systemd service o'rnatish..."
sudo cp /var/www/arenda-zala/arenda-zala.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable arenda-zala
sudo systemctl start arenda-zala

# 11. NGINX SOZLASH
echo "🌐 Nginx sozlash..."
sudo tee /etc/nginx/sites-available/arenda-zala.uz << 'EOF'
server {
    listen 80;
    server_name arenda-zala.uz www.arenda-zala.uz;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API requests
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # All other requests
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 12. NGINX SAYTNI YOQISH
sudo ln -s /etc/nginx/sites-available/arenda-zala.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 13. FIREWALL SOZLASH
echo "🔥 Firewall sozlash..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 14. SSL SERTIFIKAT (Let's Encrypt)
echo "🔒 SSL sertifikat o'rnatish..."
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d arenda-zala.uz -d www.arenda-zala.uz --non-interactive --agree-tos --email admin@arenda-zala.uz

echo "✅ O'rnatish tugadi!"
echo "🌐 Saytingiz: https://arenda-zala.uz"
echo "📊 Status ko'rish: sudo systemctl status arenda-zala"
echo "📝 Loglar: sudo journalctl -u arenda-zala -f"
