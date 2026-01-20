-- Monthly Recurring Revenue by month
-- Shows the total MRR from active subscriptions each month

WITH monthly_subscriptions AS (
    SELECT 
        DATE_TRUNC('month', start_date::timestamp)::date as month,
        user_id,
        mrr,
        start_date,
        end_date
    FROM {{ source('public', 'subscriptions') }}
)

SELECT 
    month,
    COUNT(DISTINCT user_id) as active_subscribers,
    SUM(mrr) as total_mrr,
    ROUND(AVG(mrr), 2) as avg_mrr_per_user
FROM monthly_subscriptions
WHERE 
    -- Only count subscriptions active during this month
    end_date IS NULL OR end_date::timestamp >= month
GROUP BY month
ORDER BY month