import sys
import os

# Add the project root to sys.path so we can import db_config
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import pandas as pd
import shap
import numpy as np
from datetime import timedelta
from db_config import get_db_connection, get_dict_cursor
from backend.app.services.alert_service import AlertService

app = Flask(__name__)
CORS(app) # Simplified CORS for better compatibility

# Logging for production debugging
import os
print(f"Server starting in: {os.getcwd()}")
print(f"Files in root: {os.listdir('.')}")
if os.path.exists('backend'):
    print(f"Files in backend: {os.listdir('backend')}")

# Load ML models
rf_model = None
xgb_model = None

def load_models():
    global rf_model, xgb_model
    if os.path.exists("rf_model.pkl"):
        try:
            with open("rf_model.pkl", "rb") as f:
                rf_model = pickle.load(f)
            print("Random Forest model loaded.")
        except Exception as e: 
            print(f"Failed to load RF model: {e}")
    if os.path.exists("xgb_model.pkl"):
        try:
            with open("xgb_model.pkl", "rb") as f:
                xgb_model = pickle.load(f)
            print("XGBoost model loaded.")
        except Exception as e: 
            print(f"Failed to load XGB model: {e}")

# Auto-initialize database check - lighter version
def check_db():
    try:
        from db_config import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        table_exists = cursor.fetchone()
        conn.close()
        return bool(table_exists)
    except Exception as e:
        print(f"DB check failed: {e}")
        return False

# We will load models on first request or here, but carefully
load_models()

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'edusense-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Teacher to Class Mapping
TEACHER_CLASS_MAP = {
    "DRS": "S.E.",
    "BPG": "T.E.",
    "JPK": "B.E."
}

jwt = JWTManager(app)
alert_service = AlertService()

@app.route("/")
def home():
    return jsonify({
        "name": "EduSense AI API",
        "status": "online",
        "version": "1.0.0",
        "documentation": "https://github.com/SyedAsif7/EduSense"
    })

@app.route("/ping")
def ping():
    return "pong"

# Auth Endpoint
@app.route("/health")
def health():
    health_data = {
        "status": "healthy",
        "timestamp": "2026-06-02",
        "database": "unknown",
        "user_count": 0,
        "models_loaded": {
            "rf": rf_model is not None,
            "xgb": xgb_model is not None
        },
        "environment": {
            "cwd": os.getcwd(),
            "has_db_file": os.path.exists("edusense.db"),
            "has_models": os.path.exists("xgb_model.pkl")
        }
    }
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM users")
        health_data["user_count"] = cursor.fetchone()[0]
        health_data["database"] = "connected"
        conn.close()
    except Exception as e:
        health_data["status"] = "degraded"
        health_data["database"] = f"error: {str(e)}"
    
    return jsonify(health_data)

@app.route("/login", methods=["POST"])
def login():
    try:
        print("\n" + "="*50)
        print("LOGIN ATTEMPT")
        print(f"Headers: {dict(request.headers)}")
        data = request.json
        print(f"Body: {data}")
        
        if not data:
            print("ERROR: No JSON body received")
            return jsonify({"msg": "Missing JSON body"}), 400
            
        username = data.get("username", "").strip()
        password = str(data.get("password", "")).strip()
        
        print(f"User: {username}")
        
        conn = get_db_connection()
        cursor = get_dict_cursor(conn)
        # Case-insensitive username check for better UX
        cursor.execute("SELECT * FROM users WHERE LOWER(username)=LOWER(?) AND password=?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            print(f"SUCCESS: User {username} found with role {user['role']}")
            # Identity must be a string for better compatibility across some JWT versions
            identity = f"{username}|{user['role']}"
            access_token = create_access_token(identity=identity)
            return jsonify(access_token=access_token, role=user['role'], full_name=user['full_name'])
        
        print(f"FAILED: Invalid credentials for {username}")
        return jsonify({"msg": "Bad username or password"}), 401
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"CRITICAL LOGIN ERROR:\n{error_msg}")
        return jsonify({
            "msg": "Internal server error", 
            "error": str(e),
            "trace": error_msg if app.debug else None
        }), 500

@app.route("/me")
@jwt_required()
def get_me():
    identity = get_jwt_identity()
    username = identity.split('|')[0]
    
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    
    # Get user basic info
    cursor.execute("SELECT username, role, full_name FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({"msg": "User not found"}), 404
        
    result = dict(user)
    
    # If student, get additional details from students table
    if user['role'] == 'STUDENT':
        cursor.execute("SELECT email, class_name FROM students WHERE roll_number=?", (username,))
        student_extra = cursor.fetchone()
        if student_extra:
            result.update(dict(student_extra))
    
    # If faculty, add assigned class
    elif user['role'] == 'FACULTY':
        result['class_name'] = TEACHER_CLASS_MAP.get(username.upper(), "N/A")
            
    conn.close()
    return jsonify(result)

@app.route("/risk-heatmap")
@jwt_required()
def risk_heatmap():
    if not os.path.exists("features_latest.csv") or xgb_model is None:
        return jsonify([])
        
    identity = get_jwt_identity()
    username, role = identity.split('|')
    
    # Determine if we need to filter by class
    assigned_class = None
    if role == 'FACULTY':
        assigned_class = TEACHER_CLASS_MAP.get(username.upper())
        
    df = pd.read_csv("features_latest.csv")
    
    # If faculty, filter by assigned class
    if assigned_class:
        conn = get_db_connection()
        cursor = get_dict_cursor(conn)
        cursor.execute("SELECT roll_number FROM students WHERE class_name = ?", (assigned_class,))
        class_students = [row['roll_number'] for row in cursor.fetchall()]
        conn.close()
        df = df[df['roll_number'].isin(class_students)]

    if df.empty:
        return jsonify([])

    X = df.drop("roll_number", axis=1)
    probs = xgb_model.predict_proba(X)
    
    # Fetch student names from DB
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT roll_number, name FROM students")
    name_map = {row['roll_number']: row['name'] for row in cursor.fetchall()}
    conn.close()

    results = []
    for i, (idx, row) in enumerate(df.iterrows()):
        risk_idx = probs[i].argmax()
        risk = ["Low", "Medium", "High"][risk_idx]
        # Calculate confidence based on the winning class probability
        confidence = round(float(probs[i][risk_idx]), 3)
        roll_no = row["roll_number"]
        results.append({
            "roll_no": roll_no, 
            "name": name_map.get(roll_no, f"Student {roll_no}"),
            "risk": risk, 
            "prob": confidence,
            "attendance_pct": round(float(row["attendance_pct"]), 1),
            "avg_ca_score": round(float(row["avg_ca_score"]), 1),
            "ca_trend_slope": float(row["ca_trend_slope"])
        })
    return jsonify(results)

@app.route("/attendance/<roll_no>")
@jwt_required()
def attendance(roll_no):
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT * FROM attendance WHERE roll_number=?", (roll_no,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

# SHAP Cache to speed up report generation
SHAP_CACHE = {}

@app.route("/student-report/<roll_no>")
@jwt_required()
def student_report(roll_no):
    if not os.path.exists("features_latest.csv"):
        return jsonify({"roll_number": roll_no, "attendance_pct": 0, "msg": "Features not ready"}), 200
        
    df = pd.read_csv("features_latest.csv")
    student_data = df[df['roll_number'] == roll_no]
    
    if student_data.empty:
        return jsonify({"msg": "Student not found"}), 404
        
    report = student_data.iloc[0].to_dict()
    
    # Fetch student name from DB
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT name FROM students WHERE roll_number = ?", (roll_no,))
    student_db = cursor.fetchone()
    conn.close()
    
    if student_db:
        report["name"] = student_db["name"]
    else:
        report["name"] = f"Student {roll_no}"
    
    try:
        # Check cache first
        if roll_no in SHAP_CACHE:
            report["top_factors"] = SHAP_CACHE[roll_no]
        else:
            X = df.drop("roll_number", axis=1)
            explainer = shap.TreeExplainer(xgb_model)
            shap_values = explainer.shap_values(X)
            
            idx = student_data.index[0]
            pred_class = xgb_model.predict(X.iloc[[idx]])[0]
            
            if isinstance(shap_values, list):
                current_shap = shap_values[pred_class][idx]
            else:
                current_shap = shap_values[idx]

            feature_names = X.columns.tolist()
            top_indices = np.argsort(np.abs(current_shap))[-3:][::-1]
            
            top_factors = []
            for i in top_indices:
                factor_name = feature_names[i].replace("_", " ").title()
                impact = "Positive" if current_shap[i] < 0 else "Negative"
                top_factors.append({"factor": factor_name, "impact": impact})
                
            report["top_factors"] = top_factors
            SHAP_CACHE[roll_no] = top_factors # Cache results
        
        class_averages = df.drop("roll_number", axis=1).mean().to_dict()
        report["class_averages"] = class_averages
        
    except Exception as e:
        print(f"SHAP Error: {e}")
        report["top_factors"] = []

    return jsonify(report)

@app.route("/hod/faculties")
@jwt_required()
def hod_faculties():
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT username, full_name, role FROM users WHERE role = 'FACULTY'")
    rows = cursor.fetchall()
    faculties = [dict(row) for row in rows]
    conn.close()
    return jsonify(faculties)

@app.route("/hod/students")
@jwt_required()
def hod_students():
    # Fetch student list
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT roll_number, name, email, class_name FROM students")
    students_list = cursor.fetchall()
    conn.close()
    
    # Enrich with risk data if available
    risk_map = {}
    if os.path.exists("features_latest.csv") and xgb_model is not None:
        try:
            df = pd.read_csv("features_latest.csv")
            X = df.drop("roll_number", axis=1)
            probs = xgb_model.predict_proba(X)
            for i, (idx, row) in enumerate(df.iterrows()):
                risk_idx = probs[i].argmax()
                risk_map[row["roll_number"]] = {
                    "risk": ["Low", "Medium", "High"][risk_idx],
                    "prob": round(float(probs[i][risk_idx]), 3)
                }
        except Exception as e:
            print(f"HOD Risk enrichment failed: {e}")

    results = []
    for s in students_list:
        student_data = dict(s)
        # Add risk data or defaults
        risk_info = risk_map.get(s["roll_number"], {"risk": "Low", "prob": 0.5})
        student_data.update(risk_info)
        # Frontend expects 'roll_no' in some places and 'roll_number' in others
        student_data["roll_no"] = s["roll_number"]
        results.append(student_data)
        
    return jsonify(results)

@app.route("/hod/department-stats")
@jwt_required()
def hod_dept_stats():
    # In a real app, these would be calculated from the DB
    # For now, we'll return more detailed mock data based on the real student count
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]
    conn.close()
    
    # Calculate avg confidence from latest features if possible
    avg_conf = 0.88
    if os.path.exists("features_latest.csv") and xgb_model is not None:
        try:
            df = pd.read_csv("features_latest.csv")
            X = df.drop("roll_number", axis=1)
            probs = xgb_model.predict_proba(X)
            avg_conf = float(np.mean(np.max(probs, axis=1)))
        except: pass

    return jsonify({
        "total_students": total_students,
        "total_faculties": 12,
        "avg_attendance": 78.5,
        "avg_success_rate": 92.0,
        "at_risk_count": 34,
        "avg_confidence": round(avg_conf, 3),
        "batch_distribution": [
            {"name": "FE", "students": 60, "risk": 5},
            {"name": "SE", "students": 58, "risk": 12},
            {"name": "TE", "students": 52, "risk": 10},
            {"name": "BE", "students": 46, "risk": 7}
        ]
    })

@app.route("/alerts", methods=["POST"])
@jwt_required()
def send_alert():
    data = request.json
    roll_no = data.get("roll_no")
    alert_type = data.get("type")
    
    mock_contacts = {
        "parent_phone": "+1234567890",
        "student_phone": "+1234567890",
        "faculty_email": "faculty@example.com",
        "student_name": "Test Student"
    }
    
    success = False
    if alert_type == "SMS":
        success = alert_service.send_sms_to_parent(
            mock_contacts["parent_phone"], 
            mock_contacts["student_name"], 
            roll_no, 75.0, "Low Attendance"
        )
    elif alert_type == "WHATSAPP":
        success = alert_service.send_whatsapp_to_student(
            mock_contacts["student_phone"], 
            mock_contacts["student_name"], 
            ["Attend more classes", "Submit assignments on time"]
        )
    elif alert_type == "EMAIL":
        success = alert_service.send_email_to_faculty(
            mock_contacts["faculty_email"], 
            roll_no, "High", ["Attendance < 75%", "CA Trend Declining"]
        )
        
    if success:
        return jsonify({"msg": f"Alert {alert_type} sent for {roll_no}"})
    else:
        return jsonify({"msg": f"Failed to send {alert_type} alert"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
