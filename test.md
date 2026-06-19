# Testes — MVP

## O que testar por camada

```
backend/
├── services/     → unitários — lógica isolada, LiteLLM mockado
├── repositories/ → integração — banco real (PostgreSQL em container)
└── routers/      → contrato — FastAPI TestClient (status code + shape)

web/              → baixa prioridade no MVP
extension/        → baixa prioridade no MVP
```

**Ferramentas:** `pytest`, `pytest-asyncio`, `pytest-mock`, `httpx`

---

## Exemplos por camada

### `services/` — testa comportamento, dependências mockadas

```python
def test_adapt_resume_calls_llm_with_jd_and_resume(mock_litellm):
    result = ResumeService().adapt_resume(jd="Vaga Python", resume={...})
    assert mock_litellm.called
    assert result.content is not None
```

### `repositories/` — testa queries, banco real

```python
def test_create_job_persists_to_db(db_session):
    job = JobRepository(db_session).create(title="Dev", company="ACME", status="Aplicando")
    assert db_session.get(Job, job.id) is not None
```

### `routers/` — testa contrato HTTP

```python
def test_post_jobs_returns_201(client, mock_job_service):
    response = client.post("/jobs", json={...})
    assert response.status_code == 201
    assert "id" in response.json()
```

---

## Testes como contratos

Um teste não é só uma verificação — é uma especificação executável. Ele define o contrato de um método: o que entra, o que sai, o que deve falhar. Se alguém mudar a implementação e quebrar o contrato, o teste falha. O teste é a fonte de verdade do comportamento esperado.

---

## Workflow para gerar testes com IA

```
1. Você descreve o comportamento em linguagem natural
   ex: "adapt_resume recebe jd + resume, chama LiteLLM,
        retorna AdaptedResume. Se LiteLLM falhar, lança ResumeAdaptationError."

2. IA escreve o teste

3. Você lê e valida — "é exatamente isso que quero?"
   (esse passo é inegociável — sem ele, você só tem ilusão de cobertura)

4. IA escreve a implementação para o teste passar

5. Você roda pytest — verde? avança. vermelho? IA corrige.

6. Repete para o próximo comportamento
```

---

## Prioridade no MVP

| Camada | O que testar | Quando |
|---|---|---|
| `services/` | todos os métodos com lógica | antes de implementar |
| `repositories/` | queries críticas | junto com a implementação |
| `routers/` | endpoints principais | depois dos serviços |
| extensão + web app | só o essencial | pós-MVP |
