import random

class RFIDReader:
    """
    Abstraction for RC522 RFID Reader.
    Uses mock data if physical hardware is not present.
    """
    def __init__(self):
        self.mock_students = ["2023CSE001", "2023CSE002", "2023CSE003", "2023CSE004"]

    def read_tag(self):
        # In real implementation:
        # reader = SimpleMFRC522()
        # id, text = reader.read()
        # return text.strip(), id
        
        roll = random.choice(self.mock_students)
        return roll, f"TAG_{roll[-3:]}"
