export interface MRRMetric {
  month: string;
  active_subscribers: number;
  total_mrr: number;
  avg_mrr_per_user: number;
}

export interface ChurnMetric {
  month: string;
  churned_users: number;
  churned_mrr: number;
  active_users_start_of_month: number;
  churn_rate_percent: number;
}

export interface Summary {
  current_mrr: number;
  active_subscribers: number;
  avg_mrr_per_user: number;
  churn_rate: number;
}

export interface UsersPlan {
  plan_type: string;
  user_count: number;
}