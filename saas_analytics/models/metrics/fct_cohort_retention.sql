WITH base AS (
	SELECT 
		user_id,
		DATE_TRUNC('month', start_date::timestamp)::date AS cohort_month,
		start_date,
		end_date
	FROM subscriptions	
),

cohort_sizes AS (
	SELECT 
		cohort_month,
		COUNT(DISTINCT user_id) AS cohort_size
	FROM base
	GROUP BY 1
),

retention AS (
	SELECT 
		cohort_month,
		SUM(CASE WHEN end_date IS NULL OR end_date::date >= start_date::date + INTERVAL '1 month' THEN 1 ELSE 0 
			END) AS m1_users,
		SUM(CASE WHEN end_date IS NULL OR end_date::date >= start_date::date + INTERVAL '3 months' THEN 1 ELSE 0 
			END) AS m3_users,
		SUM(CASE WHEN end_date IS NULL OR end_date::date  >= start_date::date + INTERVAL '6 month' THEN 1 ELSE 0 
			END) AS m6_users,
		SUM(CASE WHEN end_date IS NULL OR end_date::date  >= start_date::date + INTERVAL '12 months' THEN 1 ELSE 0 
			END) AS m12_users
	FROM base
	GROUP BY 1					
)

SELECT 
	r.cohort_month,
	c.cohort_size,
	ROUND(1.0 * r.m1_users / c.cohort_size, 4) AS m1_retention,
	ROUND(1.0 * r.m3_users / c.cohort_size, 4) AS m3_retention,
	ROUND(1.0 * r.m6_users / c.cohort_size, 4) AS m6_retention,
	ROUND(1.0 * r.m12_users / c.cohort_size, 4) AS m12_retention
FROM retention r
INNER JOIN cohort_sizes c ON c.cohort_month = r.cohort_month
ORDER BY r.cohort_month
