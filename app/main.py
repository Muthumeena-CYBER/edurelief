from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db.base import Base
from app.db.session import engine
import app.models.user
import app.models.campaign

# Automatically create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduRelief Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"status": "EduRelief Backend Running"}
