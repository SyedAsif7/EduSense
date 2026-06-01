from twilio.rest import Client
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

class AlertService:
    def __init__(self):
        self.twilio_sid = os.getenv("TWILIO_SID", "your_account_sid")
        self.twilio_token = os.getenv("TWILIO_TOKEN", "your_auth_token")
        self.twilio_from = os.getenv("TWILIO_FROM", "+1415xxxxxxx")
        self.gmail_user = os.getenv("GMAIL_USER", "edusense.ssiems@gmail.com")
        self.gmail_password = os.getenv("GMAIL_APP_PASSWORD", "your_app_password")

    def send_sms_to_parent(self, parent_phone, student_name, roll_no, attendance_pct, top_factor):
        try:
            client = Client(self.twilio_sid, self.twilio_token)
            msg = (f"EduSense Alert: {student_name} (Roll {roll_no}) is at HIGH RISK. "
                   f"Attendance: {attendance_pct:.1f}%. Main concern: {top_factor}. "
                   f"Please contact your faculty mentor immediately.")
            client.messages.create(to=parent_phone, from_=self.twilio_from, body=msg)
            print(f"SMS sent to {parent_phone}")
            return True
        except Exception as e:
            print(f"Failed to send SMS: {e}")
            return False

    def send_whatsapp_to_student(self, student_phone, student_name, tips):
        try:
            client = Client(self.twilio_sid, self.twilio_token)
            msg = (f"Hi {student_name}, EduSense weekly update: You are currently at HIGH risk.\n"
                   f"Top action: {tips[0]}\nNeed help? Talk to your mentor.")
            client.messages.create(
                to=f"whatsapp:{student_phone}",
                from_="whatsapp:+14155238886", # Twilio sandbox number
                body=msg
            )
            print(f"WhatsApp sent to {student_phone}")
            return True
        except Exception as e:
            print(f"Failed to send WhatsApp: {e}")
            return False

    def send_email_to_faculty(self, faculty_email, roll_no, risk_level, shap_top3):
        try:
            body = (f"EduSense Alert\n\nStudent: {roll_no}\nRisk Level: {risk_level}\n\n"
                    f"Top contributing factors:\n" + "\n".join([f" {i+1}. {f}" for i, f in enumerate(shap_top3)]))
            msg = MIMEText(body)
            msg["Subject"] = f"[EduSense] {roll_no} — {risk_level} Risk"
            msg["From"] = self.gmail_user
            msg["To"] = faculty_email
            
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
                s.login(self.gmail_user, self.gmail_password)
                s.send_message(msg)
            print(f"Email sent to {faculty_email}")
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

if __name__ == "__main__":
    # Test alert service
    service = AlertService()
    # service.send_email_to_faculty("faculty@example.com", "CS25301", "High", ["Low Attendance", "Decreasing Marks"])
