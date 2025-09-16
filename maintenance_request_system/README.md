# Sistema de Requisição de Manutenção (Versão Segura)

Sistema web desenvolvido para gestão de requisições de manutenção industrial, implementado conforme os requisitos especificados no documento T.I. Esta versão foi revisada para incluir melhores práticas de segurança e uma configuração de ambiente mais robusta.

## Melhorias de Segurança Implementadas
- **Configuração Segura**: Chaves secretas e configurações sensíveis foram movidas para um arquivo `.env`, fora do controle de versão.
- **Controle de Acesso**: Foram corrigidas vulnerabilidades de controle de acesso (IDOR/BOLA), garantindo que usuários só possam ver e modificar as requisições que lhes pertencem ou para as quais têm permissão.
- **Autenticação por Token**: O sistema agora usa autenticação por token, que é mais segura e adequada para SPAs (Single Page Applications).
- **Limpeza de Código**: Arquivos duplicados e desnecessários foram removidos para maior clareza.

## Tecnologias Utilizadas

### Backend
- **Django 4.2**: Framework web Python
- **Django REST Framework**: API REST
- **SQLite**: Base de dados (desenvolvimento)
- **CORS Headers**: Suporte a CORS

### Frontend
- **React 18**: Biblioteca JavaScript
- **Vite**: Build tool e servidor de desenvolvimento
- **React Router**: Navegação SPA
- **Axios**: Cliente HTTP
- **CSS3**: Estilização customizada

---

## Como Executar o Projeto

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- npm ou yarn

---

### **1. Configuração do Backend (Django)**

**a. Navegue até a pasta do backend:**
```bash
cd maintenance_request_system/backend
```

**b. Crie e ative um ambiente virtual:**
*No macOS/Linux:*
```bash
python3 -m venv venv
source venv/bin/activate
```
*No Windows:*
```bash
python -m venv venv
.\\venv\\Scripts\\activate
```

**c. Instale as dependências:**
```bash
pip install -r requirements.txt
```

**d. Configure as variáveis de ambiente:**
Crie um arquivo chamado `.env` na pasta `backend` (ao lado de `manage.py`). Copie o conteúdo abaixo e cole no novo arquivo.
```env
# SECURITY: Para produção, gere uma nova chave com 'python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"'
SECRET_KEY='django-insecure-@p!7(5!y5z$b-a5&b_!t#j$y-w#c(v9$b3&n3@o#u)d5@e)y!a'

# SECURITY: Mude para 'False' em ambiente de produção
DEBUG=True
```

**e. Aplique as migrações do banco de dados:**
```bash
python manage.py migrate
```

**f. Crie os usuários de teste (Opcional):**
O sistema já vem com um banco de dados (`db.sqlite3`) que contém os usuários de teste. Se quiser começar do zero, apague o arquivo `db.sqlite3` e rode os comandos:
```bash
python manage.py migrate
python manage.py createsuperuser # Para criar o admin 'admin'
# Crie os outros usuários através da interface de admin
```

**g. Inicie o servidor do backend:**
```bash
python manage.py runserver 0.0.0.0:8000
```
O servidor da API estará rodando em `http://localhost:8000`.

---

### **2. Configuração do Frontend (React)**

**a. Em um novo terminal, navegue até a pasta do frontend:**
```bash
cd maintenance_request_system/frontend
```

**b. Instale as dependências:**
```bash
npm install
```

**c. Inicie o servidor de desenvolvimento:**
```bash
npm run dev -- --host 0.0.0.0 --port 3000
```
A aplicação estará acessível em `http://localhost:3000`.

---

## Usuários de Teste

Use os seguintes usuários para testar os diferentes perfis de acesso:

1.  **admin / admin123** (Perfil: TI)
2.  **manutencao / manutencao123** (Perfil: Manutenção)
3.  **usuario / usuario123** (Perfil: Comum)

## Acesso
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/api/`
- **Admin Django**: `http://localhost:8000/admin/`
