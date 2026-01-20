import pandas as pd
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()
Faker.seed(42)
random.seed(42)

# Configuration
NUM_USERS = 10000
START_DATE = datetime(2022, 1, 1)
END_DATE = datetime(2024, 12, 31)

PLANS = [
    {"id": 1, "name": "Basic", "price": 10, "billing_cycle": "monthly"},
    {"id": 2, "name": "Pro", "price": 50, "billing_cycle": "monthly"},
    {"id": 3, "name": "Enterprise", "price": 200, "billing_cycle": "monthly"},
]

MONTHLY_CHURN_RATE = 0.06

print("Generating SaaS data...")

# Generate Plans
df_plans = pd.DataFrame(PLANS)
print(f"Generated {len(df_plans)} plans")

# Generate Users
users = []
for user_id in range(1, NUM_USERS + 1):
    days_to_add = random.randint(0, (END_DATE - START_DATE).days)
    signup_date = START_DATE + timedelta(days=days_to_add)
    
    plan_weights = [0.6, 0.3, 0.1]
    plan = random.choices(PLANS, weights=plan_weights)[0]
    
    months_since_signup = (END_DATE - signup_date).days / 30
    churn_probability = 1 - (1 - MONTHLY_CHURN_RATE) ** months_since_signup
    status = "churned" if random.random() < churn_probability else "active"
    
    users.append({
        "id": user_id,
        "email": fake.email(),
        "signup_date": signup_date,
        "plan_type": plan["name"],
        "status": status
    })

df_users = pd.DataFrame(users)
print(f"Generated {len(df_users)} users")
print(f"  Active: {len(df_users[df_users['status'] == 'active'])}")
print(f"  Churned: {len(df_users[df_users['status'] == 'churned'])}")

# Generate Subscriptions
subscriptions = []
subscription_id = 1

for _, user in df_users.iterrows():
    signup_date = user['signup_date']
    plan = next(p for p in PLANS if p["name"] == user['plan_type'])
    
    sub_start = signup_date
    sub_end = None
    
    if user['status'] == 'churned':
        months_active = random.randint(1, 24)
        sub_end = sub_start + timedelta(days=30 * months_active)
        if sub_end > END_DATE:
            sub_end = None
    
    subscriptions.append({
        "id": subscription_id,
        "user_id": user['id'],
        "plan_id": plan['id'],
        "start_date": sub_start,
        "end_date": sub_end,
        "mrr": plan['price']
    })
    
    subscription_id += 1

df_subscriptions = pd.DataFrame(subscriptions)
print(f"Generated {len(df_subscriptions)} subscriptions")

# Generate Events
events = []
event_id = 1
event_types = ["login", "feature_used", "support_ticket", "upgrade_viewed", "settings_changed"]

for _, user in df_users.iterrows():
    signup_date = user['signup_date']
    user_subs = df_subscriptions[df_subscriptions['user_id'] == user['id']]
    
    if len(user_subs) > 0:
        last_sub = user_subs.iloc[-1]
        active_until = last_sub['end_date'] if pd.notna(last_sub['end_date']) else END_DATE
    else:
        active_until = signup_date + timedelta(days=30)
    
    days_active = (active_until - signup_date).days
    engagement_level = random.choice(['low', 'medium', 'high'])
    
    if engagement_level == 'low':
        num_events = random.randint(5, 20)
    elif engagement_level == 'medium':
        num_events = random.randint(20, 100)
    else:
        num_events = random.randint(100, 500)
    
    for _ in range(num_events):
        event_date = signup_date + timedelta(days=random.randint(0, max(1, days_active)))
        
        events.append({
            "id": event_id,
            "user_id": user['id'],
            "event_type": random.choice(event_types),
            "timestamp": event_date,
            "metadata": "{}"
        })
        event_id += 1

df_events = pd.DataFrame(events)
print(f"Generated {len(df_events)} events")

# Save to CSV
print("\nSaving to CSV files...")
df_plans.to_csv("plans.csv", index=False)
df_users.to_csv("users.csv", index=False)
df_subscriptions.to_csv("subscriptions.csv", index=False)
df_events.to_csv("events.csv", index=False)

print("\nData generation complete!")
print("\nQuick Stats:")
active_subs = df_subscriptions[df_subscriptions['end_date'].isna()]
print(f"Total MRR (active): ${active_subs['mrr'].sum():,.2f}")
print(f"Active subscribers: {len(active_subs)}")
print(f"Churned subscribers: {len(df_subscriptions[df_subscriptions['end_date'].notna()])}")
print(f"\nPlan distribution:")
print(df_users['plan_type'].value_counts())