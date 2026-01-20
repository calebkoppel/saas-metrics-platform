from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import database
import models
from routers import metrics

app = FastAPI(
    title="SaaS Metrics API",
    description="API for SaaS business metrics including MRR, churn, and user analytics",
    version="1.0.0"
)

# CORS middleware (allows frontend to call this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(metrics.router)

@app.get("/")
def root():
    return {
        "message": "SaaS Metrics API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=models.HealthCheck)
def health_check(db: Session = Depends(database.get_db)):
    """
    Health check endpoint
    """
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "database": db_status
    }