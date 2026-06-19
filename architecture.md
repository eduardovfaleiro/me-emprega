# Arquitetura — MVP

## Visão Geral

```
[Extensão React]  ──┐
                    ├──▶  [FastAPI]  ──▶  [PostgreSQL]
[Next.js Web App] ──┘         │
                              └──▶  [DeepSeek via LiteLLM]
```

- Extensão e web app se comunicam exclusivamente com o FastAPI
- FastAPI é a única camada que acessa o banco e a IA
- Next.js não tem rotas de API próprias no MVP
- Sem autenticação — produto self-hosted, instância única por usuário

## Fluxo de dados (adaptação de currículo)

1. Extensão extrai o JD da página atual
2. Usuário confirma e clica "Adicionar vaga"
3. Extensão envia o JD ao FastAPI
4. FastAPI salva a vaga no PostgreSQL (status: "Aplicando")
5. FastAPI envia JD + currículo estruturado ao DeepSeek via LiteLLM
6. DeepSeek retorna o currículo adaptado (JSON/Markdown)
7. FastAPI retorna o conteúdo adaptado para a extensão
8. Extensão renderiza o preview com React
9. Usuário clica "Baixar" → FastAPI gera o PDF via WeasyPrint e retorna o arquivo

## Geração de PDF

- Gerada pelo backend via **WeasyPrint** (template HTML/CSS → PDF)
- PDF só é gerado sob demanda (ao clicar em "Baixar")
- Preview na extensão é renderizado pelo React a partir do conteúdo adaptado (não do PDF)

## Estrutura de pastas (Backend)

```
backend/
├── routers/        → endpoints HTTP (sem lógica de negócio)
├── services/       → lógica de negócio (adaptar currículo, criar vaga, etc.)
├── repositories/   → acesso ao banco (PostgreSQL via SQLAlchemy)
├── schemas/        → validação de dados (Pydantic)
└── models/         → modelos do banco (SQLAlchemy)
```

**Regras:**
- `routers` não contêm lógica — apenas recebem e delegam
- `services` não acessam o banco diretamente — usam `repositories`
- `repositories` não sabem nada de HTTP

## Estrutura de pastas (Frontend / Extensão)

```
web/          → Next.js (App Router, Tailwind, shadcn)
extension/    → React + Manifest V3 (Tailwind, shadcn)
```
