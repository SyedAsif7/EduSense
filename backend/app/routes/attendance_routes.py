from flask import Blueprint, jsonify, request
from ..models import Attendance, db

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    records = Attendance.query.order_by(Attendance.timestamp.desc()).all()
    return jsonify([r.to_dict() for r in records])

@attendance_bp.route('/log', methods=['POST'])
def log_attendance():
    data = request.json
    record = Attendance(
        roll_number=data['roll_number'],
        status=data['status']
    )
    db.session.add(record)
    db.session.commit()
    return jsonify(record.to_dict()), 201
