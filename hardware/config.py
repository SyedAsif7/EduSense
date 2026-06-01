import os

class HardwareConfig:
    API_ENDPOINT = os.environ.get('EDUSENSE_API', 'http://localhost:5001/api/attendance/log')
    POLL_INTERVAL = 5 # seconds
    
    # GPIO Pins (BCM numbering)
    LED_GREEN = 17
    LED_RED = 27
    RFID_SDA = 8
    RFID_SCK = 11
    RFID_MOSI = 10
    RFID_MISO = 9
    RFID_RST = 25
    
    # Camera settings
    CAMERA_RESOLUTION = (640, 480)
    FACE_VERIFICATION_THRESHOLD = 0.6
