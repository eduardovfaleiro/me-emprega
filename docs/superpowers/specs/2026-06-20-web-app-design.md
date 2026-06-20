# Web App (Kanban) — Design Spec

**Data:** 2026-06-20
**Status:** Aprovado

---

## Visão Geral

Next.js 15 Kanban board para gerenciar o funil de candidaturas. Página única (`/`) que consome a API FastAPI diretamente. Sem rotas de API no Next.js. Sem autenticação (produto self-hosted).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Markdown | react-markdown + remark-gfm |
| Fonte | Geist (body), Space Grotesk (logo/headings) |

---

## Status do Funil

| Status | Cor do dot | Semântica |
|---|---|---|
| `salva` | `#94a3b8` | Vaga salva, currículo adaptado, ainda não aplicou |
| `aplicada` | `#3b82f6` | Candidatura enviada |
| `em_processo` | `#f59e0b` | Em processo seletivo (entrevistas, testes) |
| `oferta` | `#10b981` | Proposta recebida |
| `arquivada` | `#94a3b8` + opacidade | Rejeitado ou desistiu |

Cards com status `arquivada` ficam com `opacity: 0.7`. Cards com status `oferta` recebem borda verde `#bbf7d0`.

---

## Arquitetura & Fluxo de Dados

```
page.tsx
  └── board.tsx  [estado: jobs[], selectedJob, DndContext]
        ├── column.tsx × 5  [Droppable por status]
        │     └── job-card.tsx  [Draggable, abre drawer]
        └── job-drawer.tsx  [Sheet, detalhes + preview markdown]
```

**Fluxo:**

1. Mount → `GET /jobs` → popula `jobs[]`
2. DnD drop → atualização otimista (move no array local) → `PATCH /jobs/{id}/status` → se falhar, reverte + toast de erro
3. Clique no card → `setSelectedJob(job)` → abre drawer (sem fetch adicional)
4. Download PDF → `<a href="/jobs/{id}/resume/download" download>` → não passa pelo state

---

## Estrutura de Pastas

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── kanban/
│       ├── board.tsx
│       ├── column.tsx
│       ├── job-card.tsx
│       └── job-drawer.tsx
└── lib/
    ├── api.ts
    └── utils.ts
```

---

## Componentes

### `board.tsx`
- Client Component com `DndContext` envolvendo tudo
- Estado: `jobs: Job[]`, `selectedJob: Job | null`, `loading`, `error`
- `onDragEnd`: identifica coluna destino por `over.id` (= status da coluna), aplica otimismo, chama `updateJobStatus`
- Topbar: logo "me emprega" (Space Grotesk), input de busca visual (não funcional no MVP), botão "Nova vaga" desabilitado

### `column.tsx`
- `useDroppable({ id: status })`
- Header: dot colorido + label + contador de cards
- Área de drop vazia: borda tracejada sutil para indicar que aceita cards

### `job-card.tsx`
- `useDraggable({ id: job.id })`
- Exibe: avatar com iniciais da empresa (cor determinística por hash do nome), título, empresa, data de criação, badge de status
- Clique chama `onSelect(job)` (não ativa o drag)

### `job-drawer.tsx`
- shadcn `Sheet` lado direito, largura ~480px
- Header: título + empresa + badge de status
- Seção de info: data de criação, URL da vaga (se presente), descrição
- Seção do currículo:
  - Se `adapted_resume` é null: mensagem "Currículo ainda não gerado"
  - Se presente: preview markdown renderizado com `react-markdown + remark-gfm`, botão "Maximizar" (colapsa as seções de info da vaga e expande o preview para ocupar toda a altura do drawer), botão "Baixar PDF"

### `lib/api.ts`
```typescript
const API_BASE = "http://localhost:8000"

type JobStatus = "salva" | "aplicada" | "em_processo" | "oferta" | "arquivada"

interface Job {
  id: string
  title: string
  company: string
  description: string
  url: string | null
  status: JobStatus
  created_at: string
  adapted_resume: string | null
}

fetchJobs(): Promise<Job[]>
updateJobStatus(id: string, status: JobStatus): Promise<Job>
downloadResume(jobId: string, company: string): void  // via <a download>
```

### `lib/utils.ts`
- `formatDate(iso: string): string` — data em pt-BR
- `getInitials(company: string): string` — até 2 letras
- `getAvatarColor(company: string)` — hash → paleta de cores determinística

---

## Tratamento de Erros

| Cenário | Comportamento |
|---|---|
| Fetch falha no mount | Mensagem de erro centralizada no board |
| PATCH falha no DnD | Reverte card + toast de erro |
| `adapted_resume` é null | "Currículo ainda não gerado" no drawer, sem botão download |
| Job sem URL | Campo URL não aparece no drawer |
| Coluna vazia | Área de drop com borda tracejada sutil |

---

## Mudanças no Backend

### 1. Novo endpoint `PATCH /jobs/{id}/status`

```
PATCH /jobs/{id}/status
Body:    { "status": "aplicada" }
Response: JobResponse (200) | 404 | 422
```

Valida que `status` é um dos 5 valores válidos. Usado pelo DnD.

### 2. Alterar `server_default` de `Job.status`

De `"Aplicando"` para `"salva"`. Requer migration Alembic.

### 3. Adicionar `description` e `url` ao `JobResponse`

O drawer exibe descrição e URL da vaga. Esses campos existem no modelo `Job` mas não são retornados pelo `JobResponse` atual. Adicionar ambos.

### 4. Atualizar `JobCreate` schema

Remover `"Aplicando"` e alinhar com os novos status no schema Pydantic e no `JobResponse`.

---

## Fora do Escopo (MVP)

- Busca funcional
- Adição de vagas pelo web app
- Polling automático de novos jobs
- Suporte mobile / touch
- Reordenação dentro da coluna
