from flask import Blueprint, jsonify, request, current_app
import sqlite3

main = Blueprint('main', __name__)

def get_db_connection():
    conn = sqlite3.connect(current_app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

@main.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "EduSense API is running", "version": "1.0.0"})

@main.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in students])

@main.route('/api/attendance', methods=['GET'])
def get_attendance():
    conn = get_db_connection()
    attendance = conn.execute('SELECT * FROM attendance ORDER BY timestamp DESC').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in attendance])

@main.route('/api/attendance/log', methods=['POST'])
def log_attendance():
    data = request.json
    roll_number = data.get('roll_number')
    status = data.get('status')
    
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO attendance (roll_number, status) VALUES (?, ?)",
        (roll_number, status)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Attendance logged successfully"}), 201

@main.route('/api/risk-prediction/<roll_number>', methods=['GET'])
def get_risk_prediction(roll_number):
    # This will eventually call the ML engine
    # Mocking response for now
    return jsonify({
        "roll_number": roll_number,
        "risk_level": "Medium",
        "confidence": 0.85,
        "top_factors": ["Low Attendance", "Decreasing CA Scores"]
    })
