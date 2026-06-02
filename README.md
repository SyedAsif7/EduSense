# ≡ƒôæ EduSense: AI-Powered Student Success System

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%203.0-lightgrey?logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-SQLite%20/%20PostgreSQL-336791?logo=sqlite)](https://www.sqlite.org/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Machine Learning](https://img.shields.io/badge/ML-XGBoost%20%2B%20RF-orange?logo=scikitlearn)](https://scikit-learn.org/)

**EduSense** is a comprehensive, enterprise-grade educational analytics platform designed to enhance student success through real-time engagement monitoring and predictive academic risk assessment. By integrating Computer Vision, Machine Learning, and Explainable AI (XAI), EduSense provides actionable insights for students, faculty, and administrators.

---

## ≡ƒîƒ Key Features

### 1. ≡ƒæü∩╕Å Biometric Attendance System
*   **Smart Enrollment**: Capture multi-angle facial photos to generate 128-D biometric signatures using `dlib` and `face_recognition`.
*   **Live Recognition**: Real-time monitoring via Raspberry Pi/Webcam. Students are marked PRESENT automatically based on cosine similarity thresholds (> 0.6).
*   **Hardware Integration**: Supports MQTT-based event streams for live "Face Detected" notifications.

### 2. ≡ƒÄ» ML Risk Prediction Engine
*   **Advanced Feature Engineering**: Processes 20+ behavioral indicators including attendance trends, CA score slopes, and lab submission consistency.
*   **Ensemble Modeling**: Utilizes an ensemble of **XGBoost** and **Random Forest** classifiers, trained with **SMOTE** to handle class imbalances.
*   **Explainable AI (SHAP)**: Provides transparency into AI decisions by identifying the top-3 impact factors (e.g., "Decreasing Attendance", "Low Internal Marks") for every student at risk.

### 3. Professional Multi-Role Dashboards
*   **HOD Control Center**: Department-wide intelligence, faculty performance audits, and risk distribution matrices. Features specialized views for **Analytics**, **Faculties**, **Students**, and **Management**.
*   **Faculty Dashboard**: Class-level heatmaps, automated parent alerting system, and SHAP-based student drill-downs.
*   **Student Portal**: Personalized success tracking, "You vs Class" benchmarking, and AI-generated improvement tips.

### 4. ≡ƒôú Multi-Channel Alerting
*   **SMS/WhatsApp**: Automated parent notifications for high-risk flags via **Twilio**.
*   **Email Reports**: Weekly performance dossiers sent to faculty via **SMTP**.

---

## ≡ƒùé∩╕Å System Architecture

```text
EduSense/
Γö£ΓöÇ backend/              # Flask REST API with JWT Authentication
Γö£ΓöÇ frontend/             # React (Vite) + Tailwind CSS + Framer Motion
Γö£ΓöÇ data_pipeline/        # CSV/JSON Ingestion & Feature Engineering
Γö£ΓöÇ hardware/             # Face recognition (OpenCV/dlib) & IoT logic
Γö£ΓöÇ ml_engine/            # Model training & XAI (SHAP) logic
Γö£ΓöÇ data/                 # Raw departmental JSON and CSV marks sheets
Γö£ΓöÇ requirements.txt      # Python dependencies
Γö£ΓöÇ db_config.py          # PostgreSQL connection utilities
```

---

## ≡ƒÜÇ Getting Started

### 1. Prerequisites
*   Python 3.10+
*   Node.js 18+

### 2. Live Deployment
*   **Frontend**: [Vercel](https://vercel.com/) (Vite/React)
*   **Backend**: [Render](https://render.com/) (Flask/Gunicorn)
*   **Initialization**: The system features **Auto-Initialization** on startup for easy deployment on free-tier platforms.

### 3. Local Backend Setup
1.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Configure Environment**:
    Create a `.env` file or set environment variables:
    ```env
    JWT_SECRET_KEY=your_secret_key
    DB_PATH=edusense.db (Optional for SQLite)
    ```
3.  **Ingest Data & Train Models**:
    ```bash
    python auto_init.py
    ```
4.  **Run API**:
    ```bash
    $env:PYTHONPATH="."; python backend/run.py
    ```

### 4. Local Frontend Setup
1.  **Install packages**:
    ```bash
    cd frontend
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

---

## ≡ƒæ¬ Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Student** | `Roll Number` (e.g., CS225201) | `Full PRN` (e.g., 24022521242003) |
| **S.E Class Teacher** | `DRS` (Prof. Devkar R.S.) | `edu123` |
| **T.E Class Teacher** | `BPG` (Prof. Bais P.G.) | `edu123` |
| **B.E Class Teacher** | `JPK` (Prof. Jadhav P.K.) | `edu123` |
| **HOD** | `PVK` (Prof. Pawar V.K.) | `edu123` |

---

## ≡ƒæ¿ΓÇì≡ƒÆ╗ Developed For
**SSIEMS Computer Science & Engineering Department**  
*Predicting success, preventing failure.*
