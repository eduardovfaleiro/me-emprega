import uuid
from datetime import datetime
from typing import Literal
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
    description: str
    url: str | None = None
    status: str
    created_at: datetime
    adapted_resume: str | None = None

    model_config = {"from_attributes": True}


class PatchJobStatus(BaseModel):
    status: Literal["salva", "aplicada", "em_processo", "oferta", "arquivada"]
