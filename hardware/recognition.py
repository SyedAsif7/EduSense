import face_recognition
import cv2
import pickle
import time
import os
from datetime import datetime
from db_config import get_db_connection

# Try to import RPi.GPIO, if not available (e.g. on Windows), mock it for development
try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except (ImportError, RuntimeError):
    HAS_GPIO = False
    print("RPi.GPIO not found. Running in mock mode.")

def log_attendance(roll_no, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO attendance (roll_number, status, timestamp) VALUES (%s, %s, %s)", 
                 (roll_no, status, datetime.now()))
    conn.commit()
    conn.close()

def run_recognition(db_path="face_db.pkl"):
    # Load face database
    if not os.path.exists(db_path):
        print(f"Face database {db_path} not found. Run enrollment first.")
        return

    with open(db_path, "rb") as f:
        known_faces = pickle.load(f)

    GREEN, RED = 18, 24
    
    if HAS_GPIO:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup([GREEN, RED], GPIO.OUT)

    cam = cv2.VideoCapture(0) # or use Picamera2
    
    print("Starting live recognition...")
    
    try:
        while True:
            ret, frame = cam.read()
            if not ret:
                break
                
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            locations = face_recognition.face_locations(rgb)
            encodings = face_recognition.face_encodings(rgb, locations)

            for enc in encodings:
                best_match, best_roll = 1.0, "UNKNOWN"
                
                for roll_no, stored_encs in known_faces.items():
                    if not stored_encs:
                        continue
                    dists = face_recognition.face_distance(stored_encs, enc)
                    if min(dists) < best_match:
                        best_match, best_roll = min(dists), roll_no

                if best_match < 0.6: # threshold — tune this
                    log_attendance(best_roll, "PRESENT")
                    if HAS_GPIO:
                        GPIO.output(GREEN, 1)
                        time.sleep(0.5)
                        GPIO.output(GREEN, 0)
                    print(f"✓ {best_roll} — verified (dist: {best_match:.3f})")
                else:
                    log_attendance("UNKNOWN", "UNRECOGNISED")
                    if HAS_GPIO:
                        GPIO.output(RED, 1)
                        time.sleep(0.5)
                        GPIO.output(RED, 0)
                    print(f"✗ UNKNOWN — not recognised (dist: {best_match:.3f})")
            
            cv2.imshow('EduSense Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        cam.release()
        cv2.destroyAllWindows()
        if HAS_GPIO:
            GPIO.cleanup()

if __name__ == "__main__":
    import os
    run_recognition()
