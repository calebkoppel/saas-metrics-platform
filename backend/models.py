from pydantic import BaseModel
from datetime import date
from typing import Optional

class MRRMetric(BaseModel):
    month: date
    active_subscribers: int
    total_mrr: float
    avg_mrr_per_user: float

    class Config:
        from_attributes = True

class ChurnMetric(BaseModel):
    month: date
    churned_users: int
    churned_mrr: Optional[float]
    active_users_start_of_month: Optional[int]
    churn_rate_percent: Optional[float]

    class Config:
        from_attributes = True

class HealthCheck(BaseModel):
    status: str
    database: str

class UsersPlan(BaseModel):
    plan_type: str
    user_count: int

    class Config:
        from_attributes = True