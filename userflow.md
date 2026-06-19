# User Flow — MVP

## Componentes

- **Extensão de browser** — onde o usuário interage ao encontrar uma vaga
- **Web app** — Kanban para gerenciar o funil de aplicações

---

## Decisões tomadas

### Extração do JD
- A extensão extrai automaticamente o conteúdo da página atual ao abrir o popup
- Não há campo para colar link manualmente — o usuário já está na página da vaga
- A extensão não precisa detectar se é um site de vaga; o usuário abre o popup intencionalmente

### Campos editáveis
- Os campos extraídos (título, empresa, descrição) ficam **editáveis** no popup antes de confirmar
- Isso cobre casos de extração incompleta, errada, ou uso acidental em página que não é de vaga
- Se não fizer sentido, o usuário simplesmente fecha o popup — sem custo de tokens, sem dado errado no Kanban

### Processamento da IA
- A IA só processa após o clique em "Adicionar vaga" — não ao abrir o popup
- Motivo: evitar gasto de tokens em sessões que o usuário abandona sem confirmar

### Kanban
- A vaga é adicionada ao Kanban automaticamente ao clicar em "Adicionar vaga"
- Status inicial: "Aplicando"
- Não há como adicionar vagas manualmente pelo web app no MVP — só pela extensão

---

## Flow completo

1. Usuário está na página da vaga e abre o popup da extensão
2. Extensão extrai o conteúdo da página (título, empresa, descrição)
3. Campos aparecem preenchidos no popup — **usuário revisa e edita se necessário**
4. Usuário clica **"Adicionar vaga"**
5. → Vaga entra no Kanban com status "Aplicando"
6. → IA processa e adapta o currículo (loading)
7. Preview do currículo adaptado + botão de download do PDF aparecem no popup

---

## Fora do MVP

- Detecção automática de domínios de vaga (whitelist, heurística de DOM)
- Adição manual de vagas pelo web app
- Processamento antecipado do currículo (antes da confirmação)
