from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pickle
import pandas as pd
import os
import shap
import numpy as np
from datetime import timedelta
from db_config import get_db_connection, get_dict_cursor
from backend.app.services.alert_service import AlertService

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Authorization", "Content-Type"]}})

# Configuration
app.config['JWT_SECRET_KEY'] = 'edusense-secret-key' # Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

jwt = JWTManager(app)
alert_service = AlertService()

# Load ML models
rf_model = None
xgb_model = None

if os.path.exists("rf_model.pkl"):
    rf_model = pickle.load(open("rf_model.pkl", "rb"))
if os.path.exists("xgb_model.pkl"):
    xgb_model = pickle.load(open("xgb_model.pkl", "rb"))

# Auth Endpoint
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        # Identity must be a string for better compatibility across some JWT versions
        identity = f"{username}|{user['role']}"
        access_token = create_access_token(identity=identity)
        return jsonify(access_token=access_token, role=user['role'], full_name=user['full_name'])
    
    return jsonify({"msg": "Bad username or password"}), 401

@app.route("/risk-heatmap")
@jwt_required()
def risk_heatmap():
    if not os.path.exists("features_latest.csv") or xgb_model is None:
        # Return empty list instead of 400 to prevent dashboard crashes
        return jsonify([])
        
    df = pd.read_csv("features_latest.csv")
    X = df.drop("roll_number", axis=1)
    
    probs = xgb_model.predict_proba(X)
    results = []
    for i, row in df.iterrows():
        risk_idx = probs[i].argmax()
        risk = ["Low", "Medium", "High"][risk_idx]
        results.append({
            "roll_no": row["roll_number"], 
            "risk": risk, 
            "prob": round(float(probs[i][risk_idx]), 3)
        })
    return jsonify(results)

@app.route("/attendance/<roll_no>")
@jwt_required()
def attendance(roll_no):
    conn = get_db_connection()
    cursor = get_dict_cursor(conn)
    cursor.execute("SELECT * FROM attendance WHERE roll_number=%s", (roll_no,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

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
    
    try:
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
    faculties = cursor.fetchall()
    conn.close()
    return jsonify(faculties)

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
    
    return jsonify({
        "total_students": total_students,
        "total_faculties": 12,
        "avg_attendance": 78.5,
        "avg_success_rate": 92.0,
        "at_risk_count": 34,
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
    app.run(host="0.0.0.0", port=5000, debug=True)
