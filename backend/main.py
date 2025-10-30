from fastapi import FastAPI
import uvicorn
from constant import PORT
from routers import resume
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(resume.router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://prajapatiroshan.github.io",
        "https://prajapatiroshan.github.io/resumeOCR"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    allow_origin_regex="https://prajapatiroshan\.github\.io.*"
)


@app.get("/")
def read_root():
    return {"message": "Hello, From Backend"}


if __name__ == "__main__":
    print("Starting FastAPI application in production mode")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        proxy_headers=True,
        forwarded_allow_ips="*",
        access_log=True,
        reload=True,
    )
