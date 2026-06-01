from flask import Blueprint, jsonify, request
from ..models import Student, db
from ..services.ml_service import ml_service

student_bp = Blueprint('students', __name__)

@student_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@student_bp.route('/<roll_number>', methods=['GET'])
def get_student(roll_number):
    student = Student.query.get_or_404(roll_number)
    return jsonify(student.to_dict())

@student_bp.route('/<roll_number>/risk', methods=['GET'])
def get_student_risk(roll_number):
    prediction = ml_service.get_prediction(roll_number)
    return jsonify(prediction)

@student_bp.route('/', methods=['POST'])
def create_student():
    data = request.json
    new_student = Student(
        roll_number=data['roll_number'],
        name=data['name'],
        email=data.get('email'),
        rfid_tag=data.get('rfid_tag')
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify(new_student.to_dict()), 201
