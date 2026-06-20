import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
import pytest
from httpx import AsyncClient, ASGITransport

from backend.main import app
from backend.database import get_db


def _mock_job(
    title: str = "Dev Python",
    company: str = "ACME",
    status: str = "salva",
    adapted_resume: str | None = "# Adapted",
    description: str = "Descrição da vaga",
    url: str | None = None,
) -> MagicMock:
    job = MagicMock()
    job.id = uuid.uuid4()
    job.title = title
    job.company = company
    job.description = description
    job.url = url
    job.status = status
    job.created_at = datetime.now(timezone.utc)
    job.adapted_resume = adapted_resume
    return job


@pytest.fixture
def override_db(mocker):
    mock_session = AsyncMock()
    mock_session.refresh = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_session
    yield mock_session
    app.dependency_overrides.clear()


async def test_post_jobs_returns_201(override_db, mocker):
    job = _mock_job()
    mocker.patch(
        "backend.routers.jobs.JobRepository"
    ).return_value.create = AsyncMock(return_value=job)
    mocker.patch(
        "backend.routers.jobs.ResumeService"
    ).return_value.adapt_resume_for_job = AsyncMock(return_value="# Adapted")

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/jobs",
            json={"title": "Dev Python", "company": "ACME", "description": "desc"},
        )

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["status"] == "salva"


async def test_get_jobs_returns_list(override_db, mocker):
    jobs = [_mock_job("Job A", "Co A"), _mock_job("Job B", "Co B")]
    mocker.patch(
        "backend.routers.jobs.JobRepository"
    ).return_value.list_all = AsyncMock(return_value=jobs)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/jobs")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2


async def test_download_resume_returns_pdf(override_db, mocker):
    job = _mock_job(adapted_resume="# Eduardo\n## Exp\n...")
    mocker.patch(
        "backend.routers.jobs.JobRepository"
    ).return_value.get = AsyncMock(return_value=job)
    mocker.patch(
        "backend.routers.jobs.PDFService"
    ).return_value.generate_pdf = MagicMock(return_value=b"%PDF-1.4 fake")

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"/jobs/{job.id}/resume/download")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"


async def test_download_resume_returns_404_when_no_resume(override_db, mocker):
    job = _mock_job(adapted_resume=None)
    mocker.patch(
        "backend.routers.jobs.JobRepository"
    ).return_value.get = AsyncMock(return_value=job)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(f"/jobs/{job.id}/resume/download")

    assert response.status_code == 404
