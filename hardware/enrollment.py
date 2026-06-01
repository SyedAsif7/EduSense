import face_recognition
import pickle
import os

def enroll_students(photos_dir="enrolment_photos", db_path="face_db.pkl"):
    """
    Folder structure: enrolment_photos/ROLLNO/1.jpg, 2.jpg ... 5.jpg
    """
    known_faces = {}
    
    if not os.path.exists(photos_dir):
        print(f"Directory {photos_dir} not found. Please create it and add student photos.")
        return

    for roll_no in os.listdir(photos_dir):
        encodings = []
        folder = os.path.join(photos_dir, roll_no)
        
        if not os.path.isdir(folder):
            continue
            
        for img_file in os.listdir(folder):
            img_path = os.path.join(folder, img_file)
            try:
                image = face_recognition.load_image_file(img_path)
                enc = face_recognition.face_encodings(image)
                if enc:
                    encodings.append(enc[0])
            except Exception as e:
                print(f"Error processing {img_path}: {e}")
                
        known_faces[roll_no] = encodings
        print(f"Enrolled {roll_no} — {len(encodings)} encodings")

    with open(db_path, "wb") as f:
        pickle.dump(known_faces, f)
    print(f"Face database saved to {db_path}.")

if __name__ == "__main__":
    enroll_students()
