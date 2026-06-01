import os
import psycopg2
from psycopg2.extras import RealDictCursor
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """
    Returns a PostgreSQL connection object.
    """
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432")
    )
    return conn

def get_db_engine():
    """
    Returns a SQLAlchemy engine for pandas.
    """
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    db = os.getenv("DB_NAME")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    return create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}")

def get_dict_cursor(conn):
    """
    Returns a cursor that yields rows as dictionaries.
    """
    return conn.cursor(cursor_factory=RealDictCursor)
