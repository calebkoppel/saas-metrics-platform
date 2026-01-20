-- Monthly churn metrics
-- Calculates churn rate based on subscriptions ending each month

WITH monthly_churned AS (
    SELECT 
        DATE_TRUNC('month', end_date::timestamp)::date as churn_month,
        COUNT(DISTINCT user_id) as churned_users,
        SUM(mrr) as churned_mrr
    FROM {{ source('public', 'subscriptions') }}
    WHERE end_date IS NOT NULL
    GROUP BY 1
),

active_by_month AS (
    SELECT 
        DATE_TRUNC('month', start_date::timestamp)::date as month,
        COUNT(DISTINCT user_id) as total_users_at_start
    FROM {{ source('public', 'subscriptions') }}
    WHERE 
        end_date IS NULL 
        OR end_date::timestamp >= DATE_TRUNC('month', start_date::timestamp)
    GROUP BY 1
)

SELECT 
    mc.churn_month as month,
    mc.churned_users,
    mc.churned_mrr,
    am.total_users_at_start as active_users_start_of_month,
    ROUND(
        (mc.churned_users::numeric / NULLIF(am.total_users_at_start, 0)) * 100, 
        2
    ) as churn_rate_percent
FROM monthly_churned mc
LEFT JOIN active_by_month am ON mc.churn_month = am.month
WHERE mc.churn_month IS NOT NULL
ORDER BY mc.churn_month