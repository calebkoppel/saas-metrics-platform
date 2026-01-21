from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import date
import database
import models

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/mrr", response_model=List[models.MRRMetric])
def get_mrr(
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(database.get_db)
):
    """
    Get Monthly Recurring Revenue metrics
    """
    query = "SELECT * FROM analytics.fct_mrr_by_month WHERE 1=1"
    params = {}
    
    if start_date:
        query += " AND month >= :start_date"
        params["start_date"] = start_date
    
    if end_date:
        query += " AND month <= :end_date"
        params["end_date"] = end_date
    
    query += " ORDER BY month"
    
    result = db.execute(text(query), params)
    rows = result.fetchall()
    
    return [
        {
            "month": row[0],
            "active_subscribers": row[1],
            "total_mrr": row[2],
            "avg_mrr_per_user": row[3]
        }
        for row in rows
    ]

@router.get("/churn", response_model=List[models.ChurnMetric])
def get_churn(
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(database.get_db)
):
    """
    Get monthly churn rate metrics
    """
    query = "SELECT * FROM analytics.fct_churn_by_month WHERE 1=1"
    params = {}
    
    if start_date:
        query += " AND month >= :start_date"
        params["start_date"] = start_date
    
    if end_date:
        query += " AND month <= :end_date"
        params["end_date"] = end_date
    
    query += " ORDER BY month"
    
    result = db.execute(text(query), params)
    rows = result.fetchall()
    
    return [
        {
            "month": row[0],
            "churned_users": row[1],
            "churned_mrr": row[2],
            "active_users_start_of_month": row[3],
            "churn_rate_percent": row[4]
        }
        for row in rows
    ]


@router.get("/users-by-plan", response_model=List[models.UsersPlan])
def get_users_by_plan(
    db: Session = Depends(database.get_db)
):
    """
        Get subscribers by plan type
    """
    query = "SELECT * FROM analytics.fct_users_by_plan WHERE 1=1"

    query += " ORDER BY plan_type ASC"

    result = db.execute(text(query))
    rows = result.fetchall()

    return [
        {
            "plan_type": row[0],
            "user_count": row[1]
        }
        for row in rows
    ]

@router.get("/summary")
def get_summary(db: Session = Depends(database.get_db)):
    """
    Get current summary statistics
    """
    # Get latest MRR
    mrr_query = """
        SELECT total_mrr, active_subscribers, avg_mrr_per_user 
        FROM analytics.fct_mrr_by_month 
        ORDER BY month DESC 
        LIMIT 1
    """
    mrr_result = db.execute(text(mrr_query)).fetchone()
    
    # Get latest churn
    churn_query = """
        SELECT churn_rate_percent 
        FROM analytics.fct_churn_by_month 
        ORDER BY month DESC 
        LIMIT 1
    """
    churn_result = db.execute(text(churn_query)).fetchone()
    
    return {
        "current_mrr": mrr_result[0] if mrr_result else 0,
        "active_subscribers": mrr_result[1] if mrr_result else 0,
        "avg_mrr_per_user": mrr_result[2] if mrr_result else 0,
        "churn_rate": churn_result[0] if churn_result else 0
    }