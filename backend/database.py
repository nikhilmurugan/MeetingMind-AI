from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Auto-migration helper for SQLite schema updates
    try:
        with engine.connect() as conn:
            # Check existing columns in meetings table
            res = conn.execute(text("PRAGMA table_info(meetings);")).fetchall()
            existing_cols = [row[1] for row in res]
            
            if "provider_used" not in existing_cols:
                conn.execute(text("ALTER TABLE meetings ADD COLUMN provider_used VARCHAR DEFAULT 'Ollama (Local)';"))
                conn.commit()
            if "model_used" not in existing_cols:
                conn.execute(text("ALTER TABLE meetings ADD COLUMN model_used VARCHAR DEFAULT 'qwen2.5-coder:3b';"))
                conn.commit()
    except Exception as e:
        print(f"Migration note: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
