"""Run once to store the base resume in the database.
Edit RESUME_MARKDOWN with your actual content before running.
"""
import asyncio
from backend.database import SessionLocal
from backend.repositories.resume_repository import ResumeRepository

RESUME_MARKDOWN = """\
# Seu Nome Completo

**Cargo Desejado** | Cidade, Estado
email@example.com | linkedin.com/in/seuperfil

---

## Resumo
[Escreva um resumo de 2-3 linhas sobre sua experiência e objetivos.]

## Experiência

### Cargo | Empresa | Ano–presente
- Resultado 1 mensurável
- Resultado 2 mensurável

### Cargo Anterior | Empresa Anterior | Ano–Ano
- Resultado 1
- Resultado 2

## Habilidades
Python, TypeScript, React, FastAPI, PostgreSQL, Docker

## Formação
Bacharel em X — Universidade Y, Ano
"""


async def main():
    async with SessionLocal() as session:
        repo = ResumeRepository(session)
        resume = await repo.upsert(RESUME_MARKDOWN)
        print(f"Resume saved (id={resume.id})")


if __name__ == "__main__":
    asyncio.run(main())
