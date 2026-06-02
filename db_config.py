import os
import sqlite3
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """
    Returns a SQLite connection object.
    """
    db_path = os.getenv("DB_PATH", "edusense.db")
    conn = sqlite3.connect(db_path)
    return conn

def get_db_engine():
    """
    Returns a SQLAlchemy engine for pandas.
    """
    db_path = os.getenv("DB_PATH", "edusense.db")
    return create_engine(f"sqlite:///{db_path}")

def get_dict_cursor(conn):
    """
    Returns a cursor that yields rows as dictionaries.
    """
    conn.row_factory = sqlite3.Row
    return conn.cursor()
