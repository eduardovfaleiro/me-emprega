import pytest
from backend.repositories.job_repository import JobRepository


async def test_create_job_persists_with_defaults(db_session):
    repo = JobRepository(db_session)
    job = await repo.create(
        title="Desenvolvedor Python", company="ACME", description="Python senior"
    )
    assert job.id is not None
    assert job.title == "Desenvolvedor Python"
    assert job.company == "ACME"
    assert job.status == "Aplicando"
    assert job.adapted_resume is None
    assert job.created_at is not None


async def test_create_job_with_url(db_session):
    repo = JobRepository(db_session)
    job = await repo.create(
        title="Dev", company="X", description="desc", url="https://example.com/job"
    )
    assert job.url == "https://example.com/job"


async def test_list_all_returns_jobs_ordered_by_created_at_desc(db_session):
    repo = JobRepository(db_session)
    await repo.create(title="Job A", company="Co A", description="desc")
    await repo.create(title="Job B", company="Co B", description="desc")
    jobs = await repo.list_all()
    assert len(jobs) == 2
    assert jobs[0].title == "Job B"  # newest first


async def test_get_returns_job_by_id(db_session):
    repo = JobRepository(db_session)
    created = await repo.create(title="Dev", company="X", description="desc")
    fetched = await repo.get(created.id)
    assert fetched is not None
    assert fetched.id == created.id


async def test_get_returns_none_for_missing_id(db_session):
    import uuid
    repo = JobRepository(db_session)
    result = await repo.get(uuid.uuid4())
    assert result is None


async def test_update_adapted_resume_saves_content(db_session):
    repo = JobRepository(db_session)
    job = await repo.create(title="Dev", company="X", description="desc")
    updated = await repo.update_adapted_resume(job.id, "# Adapted\n## Exp\n...")
    assert updated.adapted_resume == "# Adapted\n## Exp\n..."


async def test_update_status_changes_status(db_session):
    repo = JobRepository(db_session)
    job = await repo.create(title="Dev", company="X", description="desc")
    updated = await repo.update_status(job.id, "Aplicado")
    assert updated.status == "Aplicado"


async def test_update_adapted_resume_raises_on_missing_id(db_session):
    import uuid
    repo = JobRepository(db_session)
    with pytest.raises(ValueError, match="not found"):
        await repo.update_adapted_resume(uuid.uuid4(), "content")


async def test_update_status_raises_on_missing_id(db_session):
    import uuid
    repo = JobRepository(db_session)
    with pytest.raises(ValueError, match="not found"):
        await repo.update_status(uuid.uuid4(), "Aplicado")
