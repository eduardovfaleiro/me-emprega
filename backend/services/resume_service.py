import uuid
from litellm import acompletion
from backend.repositories.resume_repository import ResumeRepository
from backend.repositories.job_repository import JobRepository

_ADAPT_PROMPT = """\
You are a professional resume optimizer.
Given a job description and a base resume (in Markdown), rewrite the resume to \
emphasize the most relevant experiences and skills for this specific job.
Rules: reorder and emphasize existing content only — do NOT invent new experiences.
Return ONLY the adapted resume in Markdown format, no extra commentary.

Job Description:
{job_description}

Base Resume:
{base_resume}"""


class ResumeAdaptationError(Exception):
    pass


class ResumeService:
    def __init__(self, resume_repo: ResumeRepository, job_repo: JobRepository) -> None:
        self.resume_repo = resume_repo
        self.job_repo = job_repo

    async def adapt_resume_for_job(self, job_id: uuid.UUID) -> str:
        job = await self.job_repo.get(job_id)
        base_resume = await self.resume_repo.get_base_resume()

        if not base_resume:
            raise ResumeAdaptationError("No base resume configured")

        try:
            response = await acompletion(
                model="deepseek/deepseek-chat",
                messages=[
                    {
                        "role": "user",
                        "content": _ADAPT_PROMPT.format(
                            job_description=job.description,
                            base_resume=base_resume.content,
                        ),
                    }
                ],
            )
            adapted = response.choices[0].message.content
        except Exception as exc:
            raise ResumeAdaptationError(f"LLM call failed: {exc}") from exc

        await self.job_repo.update_adapted_resume(job_id, adapted)
        return adapted
