# Requisitos do Projeto: Sistema de Requisição de Manutenção

## Objetivo:
Registrar, Monitorar, Priorizar e Controlar as requisições de manutenção.

## Perfis (Grupos):
- Comum (Requisitante)
- Manutenção (Recebe Chamado)
- Gestor (Analisa Dados)
- T.I (Admin)

## Fluxo de Trabalho (Status):
- Aberta
- Visualizada
- Aceita
- Cancelada (Motivo)
- Em atendimento
- Parada (Motivo)
- Concluída

## Formulário de Requisição:
- N° da requisição (autoGen)
- Solicitante (VarChar)
- Prazo Limite (Data)
- Setor do solicitante (VarChar)
- Tipo da manutenção (Elétrica, Mecânica, Outros)
- Status operacional no momento do chamado (Funcionando, Alerta, Inoperante)
- Equipamentos impactados (Prensa(Lista), Rosqueadeira(Lista), Recortador(Lista), Fresa(Lista), Outros (Text))
- Titulo Curto (VarChar)
- Descrição do problema (VarChar)
- Prioridade (INT)
- Anexos (Fotos, Vídeos curtos (Limite MB))

## Execução Manutenção:
- Data da atualização de Status (AutoGen)
- Data prevista de término (Data)
- Nome do responsável da manutenção (Operador)
- Hora de início (AutoGen)
- Hora do término (autoGen)
- Descrição da manutenção (Text)
- Materiais/Peças utilizadas (Text)

## Dados para Análise:
- Tempo para resposta das requisições
- Tempo por tipo de manutenção (Mecânica, Elétrica, outro)
- Tempo médio de reparo (máquina, tipo de manutenção)
- Setores
- Monitoramento (Quem criou a req, quem atendeu, histórico)

## Notificações:
- Quando aberto um novo chamado, avisa a manutenção
- Mudança de status na atividade (Manutenção/Requisitante)
- Prazo final Próximo (Manutenção/Requisitante)
- Requisição Aceita (Requisitante)

## Telas:
- Login
- Abrir Requisição
- Minhas requisições
- Visualização de Requisições
- Detalhe da Requisição (Conseguir imprimir)
- Dashboard

## Minimum Viable Product (Produto Mínimo Viável):
- Grupo de usuários
- Enviar/Receber Requisições
- Ter Detalhes da Requisição
- Coletar dados para análise (Não precisa do dashboard inicialmente)
- Intuitivo
- Telas

## Stacks (Tecnologias):
- Python
- Back-End (Django)
- Django REST Framework (Criação da API para integração futura)
- Banco de dados (Padrão para desenvolvimento - SQLite)
- Front-End (React/TailwindCSS)
- Integração Back e Front (JavaScript)

## Versionamento no GitHub:
- Commits Claros e Objetivos

