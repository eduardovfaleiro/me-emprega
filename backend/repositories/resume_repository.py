from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.resume import Resume


class ResumeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_base_resume(self) -> Resume | None:
        result = await self.session.execute(select(Resume).limit(1))
        return result.scalars().first()

    async def upsert(self, content: str) -> Resume:
        resume = await self.get_base_resume()
        if resume:
            resume.content = content
        else:
            resume = Resume(content=content)
            self.session.add(resume)
        await self.session.commit()
        await self.session.refresh(resume)
        return resume
