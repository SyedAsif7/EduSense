import cv2
# import face_recognition
# from deepface import DeepFace

class FaceRecognitionModule:
    def __init__(self, encodings_path="data/encodings.pkl"):
        self.encodings_path = encodings_path
        # Load known face encodings from disk

    def capture_face(self):
        """
        Captures a frame from the Pi Camera / USB Webcam
        """
        cap = cv2.VideoCapture(0)
        ret, frame = cap.read()
        cap.release()
        return frame if ret else None

    def verify_identity(self, roll_number, live_frame):
        """
        Verifies if the live_frame matches the stored encoding for roll_number
        """
        # 1. Preprocess live_frame
        # 2. Get embedding using DeepFace / face_recognition
        # 3. Compare with stored embedding
        # 4. Return True if similarity > threshold
        
        print(f"Verifying identity for {roll_number}...")
        return True # Mocked

    def enroll_student(self, roll_number):
        """
        Capture 5 photos and save 128-D embeddings
        """
        print(f"Enrolling student {roll_number}...")
        # Capture frames, compute embeddings, save to SQLite/Local disk
        pass
