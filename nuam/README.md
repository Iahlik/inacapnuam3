# Nuam – Deploy on Ubuntu EC2 (Frontend + Backend + PostgreSQL)

This guide shows how to put the app online on a single Ubuntu EC2 instance with a public URL. Stack: Vite/React frontend, Express backend, PostgreSQL. Backend autoloads `backend/schema.sql` on start (idempotent).

## 1) What you need
- Ubuntu EC2 with public IP/hostname (security group: allow 22 SSH, 80 HTTP, 443 HTTPS). Backend is proxied behind nginx, so you do **not** expose its port publicly.
- Node.js 18+ and npm.
- PostgreSQL 14+.
- nginx as reverse proxy to serve the built frontend and proxy API.
- pm2 to keep the backend running.

## 2) Clone project on the server
```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

sudo mkdir -p /var/www && cd /var/www
sudo git clone https://github.com/rcaurasma/inacapnuam3.git nuam
sudo chown -R $USER:$USER /var/www/nuam
cd /var/www/nuam
```

## 3) Install dependencies
```bash
# Frontend deps (root)
npm install
# Backend deps
cd backend && npm install
cd ..
```

## 4) Configure PostgreSQL
```bash
sudo -u postgres psql
```
Inside psql:
```sql
CREATE USER admin WITH PASSWORD 'admin';
CREATE DATABASE nuam_db OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE nuam_db TO admin;
\q
```
Load schema (tables + seed admin user):
```bash
sudo -u postgres psql -d nuam_db -f backend/schema.sql
```

## 5) Environment variables
Copy from the provided examples if you like (`backend/.env.example`, `.env.example`) and adjust:

Create `backend/.env` (server):
```
DB_USER=admin
DB_HOST=127.0.0.1
DB_NAME=nuam_db
DB_PASSWORD=admin
DB_PORT=5432
PORT=3000
```
Create root `.env` (server) for Vite build:
```
VITE_API_URL=https://YOUR_DOMAIN_OR_IP/api
```
For local dev you can use `http://localhost:3000/api`.

## 6) Build frontend
```bash
npm run build   # produces dist/ for nginx to serve
```

## 7) Run backend with pm2
```bash
cd backend
pm2 start index.js --name nuam-backend
pm2 save
pm2 status
cd ..
```
To see logs: `pm2 logs nuam-backend`.

## 8) nginx config (serve frontend + proxy API)
Create `/etc/nginx/sites-available/nuam`:
```
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    root /var/www/nuam/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/nuam /etc/nginx/sites-enabled/nuam
sudo nginx -t && sudo systemctl reload nginx
```
If UFW is enabled:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 9) HTTPS (optional but recommended)
If you have a domain pointing to the instance:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 10) Quick checks
```bash
curl -I http://localhost          # should return 200 (nginx serving dist)
curl -I http://localhost/api      # should hit backend (likely 404 but not 502)
curl http://localhost/api/calificaciones
pm2 status
```
From your laptop: open `http://YOUR_DOMAIN_OR_IP` and hit the UI; API should work through `/api`.

## 11) Update flow
```bash
cd /var/www/nuam
git pull
npm install && cd backend && npm install && cd ..
npm run build
pm2 restart nuam-backend
sudo systemctl reload nginx
```

## 12) Local development (optional)
```bash
# Postgres up locally, set backend/.env accordingly
cd backend && npm run dev
# In another terminal
npm run dev
# Frontend uses VITE_API_URL from .env (default http://localhost:3000/api)
```

## Notes
- The backend runs `backend/schema.sql` at startup; it is idempotent but assumes compatible schema.
- Default seeded user: email `admin@admin.com`, password `admin` (from schema.sql).
- Change passwords in production; current values match your homework request.
- Security group is already open to all; for production restrict SSH and consider TLS.
