import paho.mqtt.client as mqtt
import sqlite3
import json
import os

# MQTT Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC_ATTENDANCE = "edusense/attendance"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(MQTT_TOPIC_ATTENDANCE)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        roll_number = data.get('roll_number')
        status = data.get('status')
        
        # Log to database
        db_path = os.path.join(os.path.dirname(__file__), 'edusense.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO attendance (roll_number, status) VALUES (?, ?)",
            (roll_number, status)
        )
        conn.commit()
        conn.close()
        print(f"Logged attendance for {roll_number}: {status}")
        
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        print(f"Could not connect to MQTT broker: {e}")

if __name__ == '__main__':
    start_mqtt()
