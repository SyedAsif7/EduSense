import time
import requests
import logging
from .config import HardwareConfig
from .sensors.rfid import RFIDReader
from .sensors.camera import FaceCamera

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EduSenseNode:
    def __init__(self):
        self.config = HardwareConfig()
        self.rfid = RFIDReader()
        self.camera = FaceCamera(resolution=self.config.CAMERA_RESOLUTION)
        
    def log_to_server(self, roll_number, status):
        try:
            payload = {"roll_number": roll_number, "status": status}
            response = requests.post(self.config.API_ENDPOINT, json=payload, timeout=5)
            if response.status_code == 201:
                logger.info(f"Successfully logged {roll_number} as {status}")
                return True
            else:
                logger.error(f"Failed to log attendance: {response.text}")
        except Exception as e:
            logger.error(f"Network error: {e}")
        return False

    def process_cycle(self):
        logger.info("Waiting for RFID tap...")
        roll_number, tag_id = self.rfid.read_tag()
        logger.info(f"Detected RFID: {roll_number}")
        
        # Trigger Camera
        frame = self.camera.capture_frame()
        if frame:
            is_verified = self.camera.verify_face(roll_number, frame)
            status = "PRESENT_VERIFIED" if is_verified else "PROXY_ATTEMPT"
            
            if status == "PROXY_ATTEMPT":
                logger.warning(f"PROXY ALERT: {roll_number}")
                # self.trigger_red_led()
            else:
                logger.info(f"VERIFIED: {roll_number}")
                # self.trigger_green_led()
                
            self.log_to_server(roll_number, status)
        else:
            logger.error("Camera failure")
            self.log_to_server(roll_number, "ABSENT_UNVERIFIED")

    def start(self):
        logger.info("EduSense IoT Node Started")
        try:
            while True:
                self.process_cycle()
                time.sleep(self.config.POLL_INTERVAL)
        except KeyboardInterrupt:
            logger.info("Node shutting down...")

if __name__ == "__main__":
    node = EduSenseNode()
    node.start()
