from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import config
from routers import auth_router


app = FastAPI()

CORS_ORIGINS = [    
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)