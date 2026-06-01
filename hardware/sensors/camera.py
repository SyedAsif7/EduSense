import cv2
import random

class FaceCamera:
    """
    Abstraction for Pi Camera / USB Webcam.
    """
    def __init__(self, resolution=(640, 480)):
        self.resolution = resolution

    def capture_frame(self):
        # cap = cv2.VideoCapture(0)
        # ret, frame = cap.read()
        # cap.release()
        return True # Mocked frame

    def verify_face(self, roll_number, frame):
        # Real logic using DeepFace or face_recognition
        # result = DeepFace.verify(frame, f"db/{roll_number}.jpg")
        # return result["verified"]
        
        # Simulating 80% success rate
        return random.random() < 0.8
