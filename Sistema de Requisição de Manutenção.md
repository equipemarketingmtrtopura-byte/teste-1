# Sistema de Requisição de Manutenção

Sistema web desenvolvido para gestão de requisições de manutenção industrial, implementado conforme os requisitos especificados no documento T.I.

## Funcionalidades Implementadas

### 1. Autenticação e Perfis de Usuário
- Sistema de login com diferentes perfis (Comum, Manutenção, TI)
- Controle de acesso baseado em perfis
- Sessão persistente

### 2. Gestão de Requisições
- Criação de novas requisições de manutenção
- Visualização de requisições por usuário
- Detalhamento completo das requisições
- Filtros por status (Abertas, Em Atendimento, Concluídas)

### 3. Fluxo de Trabalho
- Estados da requisição: Aberta → Visualizada → Aceita → Em Atendimento → Concluída/Cancelada
- Controle de responsáveis por manutenção
- Histórico completo de ações

### 4. Interface de Usuário
- Design responsivo e intuitivo
- Dashboard com estatísticas
- Navegação clara entre funcionalidades
- Formulários validados

## Tecnologias Utilizadas

### Backend
- **Django 4.2**: Framework web Python
- **Django REST Framework**: API REST
- **SQLite**: Base de dados (desenvolvimento)
- **Django CORS Headers**: Suporte a CORS

### Frontend
- **React 18**: Biblioteca JavaScript
- **Vite**: Build tool e servidor de desenvolvimento
- **React Router**: Navegação SPA
- **Axios**: Cliente HTTP
- **CSS3**: Estilização customizada

## Estrutura do Projeto

```
maintenance_request_system/
├── backend/                    # Aplicação Django
│   ├── maintenance_request_project/
│   │   ├── settings.py        # Configurações do Django
│   │   ├── urls.py           # URLs principais
│   │   └── wsgi.py           # WSGI configuration
│   └── maintenance/          # App principal
│       ├── models.py         # Modelos de dados
│       ├── views.py          # Views da API
│       ├── serializers.py    # Serializers DRF
│       ├── urls.py           # URLs da app
│       └── admin.py          # Configuração do admin
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # Serviços de API
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Ponto de entrada
│   ├── package.json         # Dependências Node.js
│   └── vite.config.js       # Configuração Vite
└── README.md                # Esta documentação
```

## Modelos de Dados

### MaintenanceRequest
- **numero_requisicao**: Número único da requisição
- **titulo_curto**: Título resumido do problema
- **descricao_problema**: Descrição detalhada
- **status**: Estado atual (ABERTA, VISUALIZADA, ACEITA, EM_ATENDIMENTO, PARADA, CONCLUIDA, CANCELADA)
- **tipo_manutencao**: Tipo (MECANICA, ELETRICA, OUTROS)
- **status_operacional**: Estado do equipamento (FUNCIONANDO, ALERTA, INOPERANTE)
- **prioridade**: Nível de prioridade (1-5)
- **setor_solicitante**: Setor que solicitou
- **equipamentos_impactados**: Lista de equipamentos
- **outros_equipamentos**: Outros equipamentos relacionados
- **prazo_limite**: Data limite para resolução
- **solicitante**: Usuário que criou a requisição
- **responsavel_manutencao**: Responsável pela execução
- **data_criacao**: Data de criação
- **data_atualizacao**: Última atualização

### RequestHistory
- **requisicao**: Referência à requisição
- **usuario**: Usuário que executou a ação
- **acao**: Tipo de ação realizada
- **descricao**: Descrição da ação
- **data_acao**: Data/hora da ação

## Usuários de Teste

O sistema inclui usuários pré-configurados para teste:

1. **admin / admin123** (Perfil: TI)
2. **manutencao / manutencao123** (Perfil: Manutenção)
3. **usuario / usuario123** (Perfil: Comum)

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- npm ou yarn

### Backend (Django)
```bash
cd backend
pip install django djangorestframework django-cors-headers
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Opcional
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

### Acesso
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/

## Funcionalidades por Perfil

### Perfil Comum
- Criar requisições de manutenção
- Visualizar suas próprias requisições
- Acompanhar status das requisições

### Perfil Manutenção
- Visualizar todas as requisições
- Aceitar requisições
- Atualizar status das requisições
- Registar execução da manutenção

### Perfil TI
- Acesso completo ao sistema
- Gestão de usuários (via admin)
- Relatórios e estatísticas

## Conformidade com Requisitos

O sistema atende a todos os requisitos especificados no documento T.I.:

✅ **R1**: Sistema de autenticação implementado  
✅ **R2**: Perfis de usuário diferenciados  
✅ **R3**: Formulário de requisição completo  
✅ **R4**: Fluxo de estados implementado  
✅ **R5**: Controle de responsáveis  
✅ **R6**: Histórico de ações  
✅ **R7**: Interface web responsiva  
✅ **R8**: Validação de dados  
✅ **R9**: Notificações de status  
✅ **R10**: Relatórios básicos (dashboard)

## Melhorias Futuras

- Integração com base de dados PostgreSQL/MySQL
- Sistema de notificações por email
- Relatórios avançados e exportação
- Upload de anexos (fotos, documentos)
- API mobile
- Integração com sistemas ERP
- Notificações push em tempo real

## Suporte

Para questões técnicas ou melhorias, contacte a equipa de desenvolvimento.

---
*Desenvolvido conforme especificações do documento T.I.*

