# Instruções de Deploy - Sistema de Requisição de Manutenção

Este documento fornece instruções detalhadas para o deploy do Sistema de Requisição de Manutenção em ambiente de produção.

## Pré-requisitos

### Servidor
- Ubuntu 20.04+ ou CentOS 8+
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+ ou MySQL 8+
- Nginx
- SSL Certificate (recomendado)

### Dependências do Sistema
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3-pip python3-venv nodejs npm postgresql postgresql-contrib nginx

# CentOS/RHEL
sudo yum install python3-pip nodejs npm postgresql-server postgresql-contrib nginx
```

## 1. Configuração da Base de Dados

### PostgreSQL
```bash
# Inicializar PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar base de dados e usuário
sudo -u postgres psql
CREATE DATABASE maintenance_db;
CREATE USER maintenance_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE maintenance_db TO maintenance_user;
\q
```

## 2. Deploy do Backend (Django)

### 2.1 Preparação do Ambiente
```bash
# Criar diretório do projeto
sudo mkdir -p /var/www/maintenance_system
sudo chown $USER:$USER /var/www/maintenance_system
cd /var/www/maintenance_system

# Clonar ou copiar o código
# (assumindo que o código está no servidor)
cp -r /caminho/para/maintenance_request_system .

# Criar ambiente virtual
cd maintenance_request_system/backend
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary  # Para PostgreSQL
pip install gunicorn         # Servidor WSGI
```

### 2.2 Configuração de Produção
```bash
# Criar arquivo de configuração de produção
cp maintenance_request_project/settings.py maintenance_request_project/settings_prod.py
```

Editar `settings_prod.py`:
```python
import os
from .settings import *

# Segurança
DEBUG = False
ALLOWED_HOSTS = ['seu-dominio.com', 'www.seu-dominio.com', 'IP_DO_SERVIDOR']

# Base de dados
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'maintenance_db',
        'USER': 'maintenance_user',
        'PASSWORD': 'sua_senha_segura',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Chave secreta (gerar nova)
SECRET_KEY = 'sua_chave_secreta_muito_longa_e_aleatoria'

# Arquivos estáticos
STATIC_URL = '/static/'
STATIC_ROOT = '/var/www/maintenance_system/static/'

# CORS para produção
CORS_ALLOWED_ORIGINS = [
    "https://seu-dominio.com",
    "https://www.seu-dominio.com",
]
```

### 2.3 Preparação da Base de Dados
```bash
# Aplicar migrações
python manage.py makemigrations --settings=maintenance_request_project.settings_prod
python manage.py migrate --settings=maintenance_request_project.settings_prod

# Criar superusuário
python manage.py createsuperuser --settings=maintenance_request_project.settings_prod

# Coletar arquivos estáticos
python manage.py collectstatic --settings=maintenance_request_project.settings_prod
```

### 2.4 Configuração do Gunicorn
```bash
# Criar arquivo de configuração do Gunicorn
cat > gunicorn.conf.py << EOF
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
user = "www-data"
group = "www-data"
EOF

# Criar serviço systemd
sudo cat > /etc/systemd/system/maintenance-backend.service << EOF
[Unit]
Description=Maintenance System Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/maintenance_system/maintenance_request_system/backend
Environment="DJANGO_SETTINGS_MODULE=maintenance_request_project.settings_prod"
ExecStart=/var/www/maintenance_system/maintenance_request_system/backend/venv/bin/gunicorn -c gunicorn.conf.py maintenance_request_project.wsgi:application
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Ativar e iniciar o serviço
sudo systemctl daemon-reload
sudo systemctl enable maintenance-backend
sudo systemctl start maintenance-backend
```

## 3. Deploy do Frontend (React)

### 3.1 Build de Produção
```bash
cd /var/www/maintenance_system/maintenance_request_system/frontend

# Instalar dependências
npm install

# Configurar URL da API para produção
# Editar src/services/api.js
cat > src/services/api.js << EOF
import axios from 'axios'

const API_BASE_URL = 'https://seu-dominio.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ... resto do código
EOF

# Build de produção
npm run build

# Copiar arquivos para diretório do Nginx
sudo cp -r dist/* /var/www/html/
```

## 4. Configuração do Nginx

### 4.1 Configuração do Site
```bash
sudo cat > /etc/nginx/sites-available/maintenance-system << EOF
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Frontend (React)
    location / {
        root /var/www/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files
    location /static/ {
        alias /var/www/maintenance_system/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

# Ativar o site
sudo ln -s /etc/nginx/sites-available/maintenance-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Configuração de Segurança

### 5.1 Firewall
```bash
# Configurar UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 5.2 SSL Certificate (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 6. Monitorização e Logs

### 6.1 Logs do Sistema
```bash
# Logs do backend
sudo journalctl -u maintenance-backend -f

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 6.2 Backup da Base de Dados
```bash
# Script de backup
cat > /home/ubuntu/backup_db.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U maintenance_user maintenance_db > /backup/maintenance_db_\$DATE.sql
find /backup -name "maintenance_db_*.sql" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup_db.sh

# Cron job para backup diário
crontab -e
# Adicionar linha:
0 2 * * * /home/ubuntu/backup_db.sh
```

## 7. Verificação do Deploy

### 7.1 Testes de Funcionalidade
1. Aceder a https://seu-dominio.com
2. Testar login com usuários de teste
3. Criar uma requisição de manutenção
4. Verificar API: https://seu-dominio.com/api/
5. Verificar admin: https://seu-dominio.com/admin/

### 7.2 Testes de Performance
```bash
# Teste de carga básico
curl -I https://seu-dominio.com
curl -I https://seu-dominio.com/api/

# Verificar status dos serviços
sudo systemctl status maintenance-backend
sudo systemctl status nginx
sudo systemctl status postgresql
```

## 8. Manutenção

### 8.1 Atualizações
```bash
# Backup antes da atualização
pg_dump -h localhost -U maintenance_user maintenance_db > backup_pre_update.sql

# Atualizar código
cd /var/www/maintenance_system/maintenance_request_system
# (copiar novos arquivos)

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --settings=maintenance_request_project.settings_prod
python manage.py collectstatic --noinput --settings=maintenance_request_project.settings_prod
sudo systemctl restart maintenance-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### 8.2 Resolução de Problemas
```bash
# Verificar logs de erro
sudo journalctl -u maintenance-backend --since "1 hour ago"
sudo tail -f /var/log/nginx/error.log

# Reiniciar serviços
sudo systemctl restart maintenance-backend
sudo systemctl restart nginx

# Verificar conectividade da base de dados
cd /var/www/maintenance_system/maintenance_request_system/backend
source venv/bin/activate
python manage.py dbshell --settings=maintenance_request_project.settings_prod
```

## 9. Configurações Opcionais

### 9.1 Redis para Cache
```bash
sudo apt install redis-server
pip install django-redis

# Adicionar ao settings_prod.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}
```

### 9.2 Celery para Tarefas Assíncronas
```bash
pip install celery redis

# Configurar Celery para notificações por email
# Criar maintenance_request_project/celery.py
```

---

**Nota**: Substitua `seu-dominio.com`, `sua_senha_segura`, e outros placeholders pelos valores reais do seu ambiente.

Para suporte técnico, contacte a equipa de desenvolvimento.

