import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.job import Job


class JobRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        title: str,
        company: str,
        description: str,
        url: str | None = None,
    ) -> Job:
        job = Job(title=title, company=company, description=description, url=url)
        self.session.add(job)
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def list_all(self) -> list[Job]:
        result = await self.session.execute(
            select(Job).order_by(Job.created_at.desc())
        )
        return list(result.scalars().all())

    async def get(self, job_id: uuid.UUID) -> Job | None:
        return await self.session.get(Job, job_id)

    async def update_adapted_resume(self, job_id: uuid.UUID, content: str) -> Job:
        job = await self.session.get(Job, job_id)
        job.adapted_resume = content
        await self.session.commit()
        await self.session.refresh(job)
        return job

    async def update_status(self, job_id: uuid.UUID, status: str) -> Job:
        job = await self.session.get(Job, job_id)
        job.status = status
        await self.session.commit()
        await self.session.refresh(job)
        return job
