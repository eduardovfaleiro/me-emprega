import uuid
from datetime import datetime
from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    url: str | None = None


class JobResponse(BaseModel):
    id: uuid.UUID
    title: str
    company: str
    status: str
    created_at: datetime
    adapted_resume: str | None = None

    model_config = {"from_attributes": True}
