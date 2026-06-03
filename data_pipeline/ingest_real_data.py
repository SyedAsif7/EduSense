import json
import pandas as pd
import os
import glob
import sqlite3
import random
from datetime import datetime, timedelta
from db_config import get_db_connection

def ingest_real_data(data_dir="data"):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Clear existing data and recreate tables with SQLite syntax
    cursor.executescript("""
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS performance;
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        full_name VARCHAR(100)
    );

    CREATE TABLE students (
        roll_number VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        rfid_tag VARCHAR(50),
        class_name VARCHAR(20)
    );

    CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number VARCHAR(20) REFERENCES students(roll_number),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50)
    );

    CREATE TABLE performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roll_number VARCHAR(20) REFERENCES students(roll_number),
        week_number INTEGER,
        ca_score FLOAT,
        lab_score FLOAT,
        assignments_submitted INTEGER
    );

    -- Add indexes for faster lookups
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_students_roll ON students(roll_number);
    CREATE INDEX idx_attendance_roll ON attendance(roll_number);
    CREATE INDEX idx_performance_roll ON performance(roll_number);
    """)

    # 2. Ingest Students from JSON files
    json_files = glob.glob(os.path.join(data_dir, "*.json"))
    for json_file in json_files:
        if "teachers" in json_file: continue
        
        with open(json_file, 'r') as f:
            try:
                data = json.load(f)
                students = data.get("Students", [])
                class_name = data.get("Class", "XX")
                for s in students:
                    roll = s.get("RollNo")
                    prn_raw = s.get("PRN")
                    prn = str(prn_raw) if prn_raw else "edu123"
                    
                    if not roll:
                        sno = s.get("SNo", "0")
                        # Clean class name for roll number
                        clean_class = class_name.replace("(", "").replace(")", "").replace(" ", "")
                        roll = f"{clean_class}_{sno}"
                    
                    name = s.get("Name")
                    email = f"{roll.lower()}@ssiems.edu"
                    
                    # Map JSON class names to professional labels
                    mapped_class = class_name
                    if "SY" in class_name or "SY" in json_file: mapped_class = "S.E."
                    elif "TY" in class_name or "TE" in json_file: mapped_class = "T.E."
                    elif "BE" in class_name or "BE" in json_file: mapped_class = "B.E."
                    
                    # SQLite INSERT OR REPLACE for ON CONFLICT behavior
                    cursor.execute("INSERT OR REPLACE INTO students (roll_number, name, email, class_name) VALUES (?, ?, ?, ?)", (roll, name, email, mapped_class))
                    
                    # Add to users table: username is RollNo, password is PRN
                    cursor.execute("""
                        INSERT OR REPLACE INTO users (username, password, role, full_name) 
                        VALUES (?, ?, ?, ?)
                    """, (roll, prn, "STUDENT", name))
            except Exception as e:
                print(f"Error parsing {json_file}: {e}")

    # 2.5 Ingest Specific Faculty and HOD accounts
    print("Ingesting specific faculty and HOD accounts...")
    restricted_teachers = [
        {"username": "PVK", "name": "Prof. Pawar V.K.", "role": "HOD"},
        {"username": "DRS", "name": "Prof. Devkar R.S.", "role": "FACULTY"},
        {"username": "BPG", "name": "Prof. Bais P.G.", "role": "FACULTY"},
        {"username": "JPK", "name": "Prof. Jadhav P.K.", "role": "FACULTY"}
    ]
    
    for t in restricted_teachers:
        cursor.execute("""
            INSERT OR REPLACE INTO users (username, password, role, full_name) 
            VALUES (?, ?, ?, ?)
        """, (t["username"], "edu123", t["role"], t["name"]))

    print(f"Ingested students from JSON files.")

    # 3. Ingest Marks from CSV files
    csv_files = glob.glob(os.path.join(data_dir, "marks", "*.csv"))
    for csv_file in csv_files:
        try:
            # Skip complex headers, find the row with "Roll No" variations
            df_raw = pd.read_csv(csv_file, header=None)
            header_row_idx = -1
            for i, row in df_raw.iterrows():
                # Check for various Roll No formats
                row_str = " ".join([str(cell) for cell in row])
                if any(x in row_str for x in ["Roll. No.", "Roll No.", "Roll No", "Roll.No."]):
                    header_row_idx = i
                    break
            
            if header_row_idx == -1: 
                print(f"Could not find Roll No header in {csv_file}")
                continue

            df = pd.read_csv(csv_file, skiprows=header_row_idx)
            # Normalize column names: remove dots, spaces, and lowercase
            df.columns = [str(c).replace(".", "").replace(" ", "").strip() for c in df.columns]
            
            # Find the roll number column index
            roll_col = None
            for c in df.columns:
                if "rollno" in c.lower():
                    roll_col = c
                    break
            
            if not roll_col:
                print(f"Column roll_number not found in {csv_file}")
                continue

            # Identify CA columns (CA1, CA2, MSE, etc.)
            ca_cols = [c for c in df.columns if any(x in str(c).upper() for x in ["CA", "MSE", "INTERNAL"])]
            
            for _, row in df.iterrows():
                roll = str(row[roll_col]).strip()
                if not roll or roll == "nan": continue
                
                # Check if student exists in students table to avoid foreign key violation
                cursor.execute("SELECT 1 FROM students WHERE roll_number = ?", (roll,))
                if not cursor.fetchone():
                    continue

                for i, col in enumerate(ca_cols):
                    score_str = str(row[col])
                    try:
                        score = float(score_str) if score_str.replace('.','',1).isdigit() else 0.0
                    except:
                        score = 0.0
                        
                    cursor.execute("""
                        INSERT INTO performance (roll_number, week_number, ca_score, lab_score, assignments_submitted)
                        VALUES (?, ?, ?, ?, ?)
                    """, (roll, i + 1, score, 80.0, 5))
        except Exception as e:
            print(f"Error processing {csv_file}: {e}")

    print(f"Ingested marks from CSV files.")

    # 4. Generate Synthetic Attendance for real students
    cursor.execute("SELECT roll_number FROM students")
    all_rolls = [r[0] for r in cursor.fetchall()]
    
    attendance_data = []
    for roll in all_rolls:
        prob = random.uniform(0.4, 0.95)
        for d in range(30):
            ts = (datetime.now() - timedelta(days=d)).strftime('%Y-%m-%d %H:%M:%S')
            status = "PRESENT" if random.random() < prob else "ABSENT"
            attendance_data.append((roll, ts, status))
    
    cursor.executemany("INSERT INTO attendance (roll_number, timestamp, status) VALUES (?, ?, ?)", attendance_data)
    print(f"Generated synthetic attendance for {len(all_rolls)} students.")

    conn.commit()
    conn.close()
    print("Real data ingestion to SQLite complete.")

if __name__ == "__main__":
    ingest_real_data()
