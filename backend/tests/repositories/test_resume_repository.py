import pytest
from backend.repositories.resume_repository import ResumeRepository


async def test_get_base_resume_returns_none_when_empty(db_session):
    repo = ResumeRepository(db_session)
    result = await repo.get_base_resume()
    assert result is None


async def test_upsert_creates_resume_when_none_exists(db_session):
    repo = ResumeRepository(db_session)
    resume = await repo.upsert("# Meu Currículo\n## Experiência\n...")
    assert resume.id is not None
    assert "Meu Currículo" in resume.content


async def test_upsert_updates_existing_instead_of_creating_new(db_session):
    repo = ResumeRepository(db_session)
    await repo.upsert("# Versão 1")
    await repo.upsert("# Versão 2")
    result = await repo.get_base_resume()
    assert result.content == "# Versão 2"


async def test_get_base_resume_returns_upserted_content(db_session):
    repo = ResumeRepository(db_session)
    await repo.upsert("# Currículo base")
    result = await repo.get_base_resume()
    assert result is not None
    assert result.content == "# Currículo base"
