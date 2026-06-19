from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import jobs

app = FastAPI(title="Me Emprega API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
