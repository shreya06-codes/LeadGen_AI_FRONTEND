from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL connection (local)
DATABASE_URL = "postgresql://postgres:[S@n6742$$$_]@db.jpjcekykidgbcvraebuz.supabase.co:5432/postgres"

# Engine
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()


# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize DB tables
def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Done!")