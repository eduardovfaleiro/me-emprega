# Stack — MVP

## Extensão de Browser
- **Framework:** React
- **Manifest:** V3
- **Estilo:** Tailwind CSS

## Web App
- **Framework:** Next.js
- **Estilo:** Tailwind CSS + shadcn/ui

## Backend
- **Framework:** FastAPI (Python)
- **Banco de dados:** PostgreSQL

## IA
- **Modelo:** DeepSeek
- **Abstração:** LiteLLM — permite trocar de modelo via config sem alterar o código

---

## Decisões tomadas

- React no popup da extensão para consistência com o web app (Next.js)
- LiteLLM como camada de abstração para não engessar no DeepSeek — outros modelos podem ser adicionados no futuro sem refatoração
- Next.js é apenas frontend; toda lógica de API passa pelo FastAPI
