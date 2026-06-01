from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    
    roll_number = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    rfid_tag = db.Column(db.String(50), unique=True)
    
    attendance_records = db.relationship('Attendance', backref='student', lazy=True)
    performance_records = db.relationship('Performance', backref='student', lazy=True)

    def to_dict(self):
        return {
            'roll_number': self.roll_number,
            'name': self.name,
            'email': self.email,
            'rfid_tag': self.rfid_tag
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    roll_number = db.Column(db.String(20), db.ForeignKey('students.roll_number'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50)) # PRESENT_VERIFIED, PROXY_ATTEMPT, etc.

    def to_dict(self):
        return {
            'id': self.id,
            'roll_number': self.roll_number,
            'timestamp': self.timestamp.isoformat(),
            'status': self.status
        }

class Performance(db.Model):
    __tablename__ = 'performance'
    
    id = db.Column(db.Integer, primary_key=True)
    roll_number = db.Column(db.String(20), db.ForeignKey('students.roll_number'), nullable=False)
    week_number = db.Column(db.Integer)
    ca_score = db.Column(db.Float)
    lab_score = db.Column(db.Float)
    assignments_submitted = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'roll_number': self.roll_number,
            'week_number': self.week_number,
            'ca_score': self.ca_score,
            'lab_score': self.lab_score,
            'assignments_submitted': self.assignments_submitted
        }
