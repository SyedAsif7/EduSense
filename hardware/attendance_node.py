import time
import requests
import json
import random

# Mocking RFID Library (RC522)
class MockRFID:
    def __init__(self):
        self.students = ["2023CSE001", "2023CSE002", "2023CSE003", "2023CSE004"]
        
    def read(self):
        # Returns a random mock roll number and tag ID
        roll = random.choice(self.students)
        return roll, f"TAG_{roll[-3:]}"

class AttendanceNode:
    def __init__(self):
        self.rfid = MockRFID()
        self.api_url = "http://localhost:5000/api/attendance/log"
        
    def process_tap(self):
        roll_number, tag_id = self.rfid.read()
        print(f"Card Tapped: {roll_number}")
        
        # Simulate face verification
        statuses = ["PRESENT_VERIFIED", "PRESENT_VERIFIED", "PROXY_ATTEMPT", "ABSENT_UNVERIFIED"]
        status = random.choice(statuses)
        
        payload = {
            "roll_number": roll_number,
            "status": status
        }
        
        try:
            response = requests.post(self.api_url, json=payload)
            if response.status_code == 201:
                print(f"Logged: {roll_number} -> {status}")
            else:
                print(f"Failed to log: {response.text}")
        except Exception as e:
            print(f"Error connecting to API: {e}")

    def run(self):
        print("Attendance Node Started (HTTP Mode)...")
        while True:
            # Simulate waiting for tap every 5 seconds
            self.process_tap()
            time.sleep(5)

if __name__ == "__main__":
    node = AttendanceNode()
    node.run()
