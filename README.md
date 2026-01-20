# SaaS Metrics Analytics Platform

A modern data analytics platform demonstrating end-to-end data engineering with industry-standard tools.

## 🎯 Project Overview

This project showcases the transition from traditional BI tools to modern data stack architecture, featuring synthetic SaaS company data with realistic patterns for MRR, churn, and user engagement.

## 🛠 Tech Stack

- **Data Generation**: Python, Pandas, Faker
- **Database**: PostgreSQL
- **Transformation**: dbt (data build tool)
- **API**: FastAPI *(in progress)*
- **Frontend**: React + TypeScript *(planned)*

## 📊 Current Features

✅ Realistic SaaS data generation (10K users, 467K events)  
✅ PostgreSQL data warehouse  
✅ dbt models for key metrics:
  - Monthly Recurring Revenue (MRR)
  - Churn rate analysis
  - Cohort retention *(coming soon)*

## 🚀 What This Demonstrates

- Modern data stack architecture
- SQL transformation best practices with dbt
- Data modeling (dimensional modeling)
- Version-controlled analytics
- Production-ready data pipelines

## 📁 Project Structure
```
saas-metrics-platform/
├── data-generation/     # Python scripts for synthetic data
├── saas_analytics/      # dbt project with transformation models
├── backend/            # FastAPI (coming soon)
└── frontend/           # React dashboard (coming soon)
```

## 🎓 Background

Built as part of learning modern data engineering tools, transitioning from SQL Server + Power BI to cloud-native data stack.

---

**Status**: Week 1 complete - Data generation and dbt transformations working
