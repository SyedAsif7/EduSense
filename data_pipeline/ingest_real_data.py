import json
import pandas as pd
import os
import glob
from db_config import get_db_connection

def ingest_real_data(data_dir="data"):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Clear existing data and recreate tables with PostgreSQL syntax
    cursor.execute("""
    DROP TABLE IF EXISTS attendance CASCADE;
    DROP TABLE IF EXISTS performance CASCADE;
    DROP TABLE IF EXISTS students CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

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
        rfid_tag VARCHAR(50)
    );

    CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(20) REFERENCES students(roll_number),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50)
    );

    CREATE TABLE performance (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(20) REFERENCES students(roll_number),
        week_number INTEGER,
        ca_score FLOAT,
        lab_score FLOAT,
        assignments_submitted INTEGER
    );
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
                    cursor.execute("INSERT INTO students (roll_number, name, email) VALUES (%s, %s, %s) ON CONFLICT (roll_number) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email", (roll, name, email))
                    
                    # Add to users table: username is RollNo, password is PRN
                    cursor.execute("""
                        INSERT INTO users (username, password, role, full_name) 
                        VALUES (%s, %s, %s, %s) 
                        ON CONFLICT (username) 
                        DO UPDATE SET password = EXCLUDED.password, full_name = EXCLUDED.full_name
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
            INSERT INTO users (username, password, role, full_name) 
            VALUES (%s, %s, %s, %s) 
            ON CONFLICT (username) 
            DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name, password = 'edu123'
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
                cursor.execute("SELECT 1 FROM students WHERE roll_number = %s", (roll,))
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
                        VALUES (%s, %s, %s, %s, %s)
                    """, (roll, i + 1, score, 80.0, 5))
        except Exception as e:
            print(f"Error processing {csv_file}: {e}")

    print(f"Ingested marks from CSV files.")

    # 4. Generate Synthetic Attendance for real students
    cursor.execute("SELECT roll_number FROM students")
    all_rolls = [r[0] for r in cursor.fetchall()]
    
    import random
    from datetime import datetime, timedelta
    
    attendance_data = []
    for roll in all_rolls:
        prob = random.uniform(0.4, 0.95)
        for d in range(30):
            ts = (datetime.now() - timedelta(days=d))
            status = "PRESENT" if random.random() < prob else "ABSENT"
            attendance_data.append((roll, ts, status))
    
    from psycopg2.extras import execute_values
    execute_values(cursor, "INSERT INTO attendance (roll_number, timestamp, status) VALUES %s", attendance_data)
    print(f"Generated synthetic attendance for {len(all_rolls)} students.")

    conn.commit()
    conn.close()
    print("Real data ingestion to PostgreSQL complete.")

if __name__ == "__main__":
    ingest_real_data()
