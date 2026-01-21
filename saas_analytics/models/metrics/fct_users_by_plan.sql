SELECT plan_type, 
    COUNT(*) AS user_count
FROM {{ source('public','users') }}
WHERE status = 'active'
GROUP BY plan_type
ORDER BY plan_type ASC
