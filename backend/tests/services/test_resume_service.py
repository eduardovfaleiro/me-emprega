import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from backend.services.resume_service import ResumeService, ResumeAdaptationError


def make_mock_job(description: str = "Python dev role") -> MagicMock:
    job = MagicMock()
    job.id = uuid.uuid4()
    job.description = description
    return job


def make_mock_repos(job=None, resume_content="# Base Resume\n## Exp\n..."):
    mock_job = job or make_mock_job()

    job_repo = MagicMock()
    job_repo.get = AsyncMock(return_value=mock_job)
    job_repo.update_adapted_resume = AsyncMock(return_value=mock_job)

    resume_repo = MagicMock()
    resume_repo.get_base_resume = AsyncMock(
        return_value=MagicMock(content=resume_content)
    )
    return job_repo, resume_repo


async def test_adapt_resume_calls_llm_with_jd_and_resume(mocker):
    mock_llm = mocker.patch(
        "backend.services.resume_service.acompletion",
        new=AsyncMock(
            return_value=MagicMock(
                choices=[MagicMock(message=MagicMock(content="# Adapted\n..."))]
            )
        ),
    )
    job_repo, resume_repo = make_mock_repos()
    service = ResumeService(resume_repo=resume_repo, job_repo=job_repo)

    result = await service.adapt_resume_for_job(job_repo.get.return_value.id)

    assert mock_llm.called
    call_kwargs = mock_llm.call_args[1]
    assert call_kwargs["model"] == "deepseek/deepseek-chat"
    assert "Python dev role" in call_kwargs["messages"][0]["content"]
    assert "Base Resume" in call_kwargs["messages"][0]["content"]
    assert result == "# Adapted\n..."


async def test_adapt_resume_saves_result_to_job_repo(mocker):
    mocker.patch(
        "backend.services.resume_service.acompletion",
        new=AsyncMock(
            return_value=MagicMock(
                choices=[MagicMock(message=MagicMock(content="# Saved"))]
            )
        ),
    )
    job_repo, resume_repo = make_mock_repos()
    service = ResumeService(resume_repo=resume_repo, job_repo=job_repo)

    job_id = job_repo.get.return_value.id
    await service.adapt_resume_for_job(job_id)

    job_repo.update_adapted_resume.assert_called_once_with(job_id, "# Saved")


async def test_adapt_resume_raises_when_no_base_resume(mocker):
    job_repo = MagicMock()
    job_repo.get = AsyncMock(return_value=make_mock_job())

    resume_repo = MagicMock()
    resume_repo.get_base_resume = AsyncMock(return_value=None)

    service = ResumeService(resume_repo=resume_repo, job_repo=job_repo)

    with pytest.raises(ResumeAdaptationError, match="No base resume"):
        await service.adapt_resume_for_job(uuid.uuid4())


async def test_adapt_resume_raises_on_llm_failure(mocker):
    mocker.patch(
        "backend.services.resume_service.acompletion",
        new=AsyncMock(side_effect=Exception("LLM timeout")),
    )
    job_repo, resume_repo = make_mock_repos()
    service = ResumeService(resume_repo=resume_repo, job_repo=job_repo)

    with pytest.raises(ResumeAdaptationError, match="LLM call failed"):
        await service.adapt_resume_for_job(job_repo.get.return_value.id)
