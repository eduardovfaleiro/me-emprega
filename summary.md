## Contexto
  Estamos na fase de descoberta de produto para uma ferramenta que automatiza o processo de aplicação para vagas de emprego.

  ## O que já foi decidido

  **Problema:**
  Aplicar para vagas exige navegar entre vários contextos: abrir a vaga, editar manualmente o currículo com palavras-chave do JD, exportar, aplicar,
  e registrar em algum Kanban. É repetitivo, fragmentado e fácil de perder o controle.

  **Solução (MVP):**
  - **Extensão de browser** — estando na página da vaga, o usuário abre o popup. Ela extrai automaticamente o JD (título, empresa, descrição, URL),
  adapta o currículo via IA (reordenação + ênfase, não só keyword stuffing), e gera um PDF pronto para envio.
  - **Web app** — Kanban onde a extensão registra automaticamente cada aplicação (status, data, link, empresa). O usuário gerencia o funil por lá.

  **Decisões tomadas:**
  - Kanban embutido no web app (não integração com Notion/Trello/etc.)
  - Currículo deve ser armazenado em formato estruturado na plataforma (Markdown ou formulário), gerando PDF com template próprio — currículos
  visuais (Canva, Word elaborado) estão fora do escopo do MVP
  - A adaptação do currículo é por reordenação e ênfase, não inserção de palavras-chave avulsas
  - Feature de PDF→LaTeX (importar currículo existente) foi identificada como boa ideia mas secundária — fora do MVP

  **Fora do MVP:**
  - Integração com sites de vaga (LinkedIn Easy Apply, etc.)
  - Geração de carta de apresentação
  - Lembretes de follow-up
  - Importação de currículo em PDF/Canva

  ## Restrições
  - Não propor integração com Kanban externo (Notion, Trello, etc.)
  - Não incluir importação de currículo visual (PDF/Canva) no MVP
  - Não sair codando sem antes validar a stack e o fluxo com o usuário
  - Manter foco no MVP — o usuário tem tendência a expandir escopo (ex: PDF→LaTeX), redirecionar gentilmente quando isso acontecer