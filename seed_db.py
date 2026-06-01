from backend.app import create_app
from backend.app.models import db, Student, Attendance

def seed_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Insert Students
        students = [
            Student(roll_number='2023CSE001', name='Rahul Sharma', email='rahul@batu.ac.in', rfid_tag='RFID_001'),
            Student(roll_number='2023CSE002', name='Priya Patil', email='priya@batu.ac.in', rfid_tag='RFID_002'),
            Student(roll_number='2023CSE003', name='Amit Deshmukh', email='amit@batu.ac.in', rfid_tag='RFID_003'),
            Student(roll_number='2023CSE004', name='Sneha Kulkarni', email='sneha@batu.ac.in', rfid_tag='RFID_004')
        ]
        db.session.add_all(students)
        
        # Insert Attendance
        attendance = [
            Attendance(roll_number='2023CSE001', status='PRESENT_VERIFIED'),
            Attendance(roll_number='2023CSE002', status='PRESENT_VERIFIED'),
            Attendance(roll_number='2023CSE003', status='PROXY_ATTEMPT'),
            Attendance(roll_number='2023CSE004', status='ABSENT_UNVERIFIED')
        ]
        db.session.add_all(attendance)
        
        db.session.commit()
        print("Database seeded successfully using SQLAlchemy.")

if __name__ == '__main__':
    seed_data()
