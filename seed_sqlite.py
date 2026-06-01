import sqlite3
import random
from datetime import datetime, timedelta

def seed_sqlite_db(db_path="edusense.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Drop and recreate tables
    cursor.executescript("""
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS performance;

    CREATE TABLE students (
        roll_number VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        rfid_tag VARCHAR(50)
    );

    CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number VARCHAR(20) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50)
    );

    CREATE TABLE performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number VARCHAR(20) NOT NULL,
        week_number INTEGER,
        ca_score FLOAT,
        lab_score FLOAT,
        assignments_submitted INTEGER
    );
    """)

    # Seed 50 students for better ML training
    roll_numbers = [f"CS253{str(i).zfill(2)}" for i in range(1, 51)]
    students = [(r, f"Student {r}", f"{r}@example.com", f"RFID_{r}") for r in roll_numbers]
    cursor.executemany("INSERT INTO students VALUES (?,?,?,?)", students)

    # Seed attendance (past 20 days) with variety
    attendance_data = []
    for i, roll in enumerate(roll_numbers):
        # Variety: some high, some medium, some low attendance
        if i % 3 == 0: prob = 0.9 # Good student
        elif i % 3 == 1: prob = 0.6 # At-risk
        else: prob = 0.3 # Fail
        
        for d in range(20):
            ts = (datetime.now() - timedelta(days=d)).isoformat()
            status = "PRESENT" if random.random() < prob else "ABSENT"
            attendance_data.append((roll, ts, status))
    cursor.executemany("INSERT INTO attendance (roll_number, timestamp, status) VALUES (?,?,?)", attendance_data)

    # Seed performance (past 5 weeks)
    performance_data = []
    for i, roll in enumerate(roll_numbers):
        if i % 3 == 0: ca_range = (70, 100)
        elif i % 3 == 1: ca_range = (50, 75)
        else: ca_range = (20, 50)
        
        for w in range(1, 6):
            ca = random.uniform(*ca_range)
            lab = random.uniform(50, 100)
            assign = random.randint(0, 5)
            performance_data.append((roll, w, ca, lab, assign))
    cursor.executemany("INSERT INTO performance (roll_number, week_number, ca_score, lab_score, assignments_submitted) VALUES (?,?,?,?,?)", performance_data)

    conn.commit()
    conn.close()
    print("SQLite database seeded with 50 students and balanced data.")

if __name__ == "__main__":
    seed_sqlite_db()
