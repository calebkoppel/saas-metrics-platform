import pandas as pd
from sqlalchemy import create_engine

# Mac/Homebrew PostgreSQL - usually no password needed
DATABASE_URL = "postgresql://localhost:5432/saas_metrics"

print("🔌 Connecting to database...")
try:
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()
    connection.close()
    print("✓ Connected successfully!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)

print("\n📥 Loading data into PostgreSQL...")

# Read CSVs
print("Reading CSV files...")
df_plans = pd.read_csv("plans.csv")
df_users = pd.read_csv("users.csv")
df_subscriptions = pd.read_csv("subscriptions.csv")
df_events = pd.read_csv("events.csv")

# Load into database
print("Loading plans...")
df_plans.to_sql("plans", engine, if_exists="replace", index=False, schema="public")
print("✓ Loaded plans")

print("Loading users...")
df_users.to_sql("users", engine, if_exists="replace", index=False, schema="public")
print("✓ Loaded users")

print("Loading subscriptions...")
df_subscriptions.to_sql("subscriptions", engine, if_exists="replace", index=False, schema="public")
print("✓ Loaded subscriptions")

print("Loading events (this may take a minute)...")
df_events.to_sql("events", engine, if_exists="replace", index=False, schema="public")
print("✓ Loaded events")

print("\n✅ All data loaded successfully!")
print(f"\nYou now have 4 tables in your saas_metrics database:")
print(f"  - plans ({len(df_plans):,} rows)")
print(f"  - users ({len(df_users):,} rows)")
print(f"  - subscriptions ({len(df_subscriptions):,} rows)")
print(f"  - events ({len(df_events):,} rows)")