import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.repositories.job_repository import JobRepository
from backend.repositories.resume_repository import ResumeRepository
from backend.services.resume_service import ResumeService, ResumeAdaptationError
from backend.services.pdf_service import PDFService
from backend.schemas.job import JobCreate, JobResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobResponse, status_code=201)
async def create_job(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    job_repo = JobRepository(db)
    resume_service = ResumeService(
        resume_repo=ResumeRepository(db), job_repo=job_repo
    )

    job = await job_repo.create(
        title=payload.title,
        company=payload.company,
        description=payload.description,
        url=payload.url,
    )

    try:
        await resume_service.adapt_resume_for_job(job.id)
    except ResumeAdaptationError:
        pass  # job is saved; adaptation failure is non-blocking in MVP

    await db.refresh(job)
    return job


@router.get("", response_model=list[JobResponse])
async def list_jobs(db: AsyncSession = Depends(get_db)):
    return await JobRepository(db).list_all()


@router.get("/{job_id}/resume/download")
async def download_resume(job_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    job = await JobRepository(db).get(job_id)
    if not job or not job.adapted_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    pdf_bytes = PDFService().generate_pdf(job.adapted_resume)
    filename = f"Curriculo_{job.company.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
