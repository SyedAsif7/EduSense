# EduSense: AI-Powered Student Success System

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%203.0-lightgrey?logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-SQLite%20/%20PostgreSQL-336791?logo=sqlite)](https://www.sqlite.org/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Machine Learning](https://img.shields.io/badge/ML-XGBoost%20%2B%20RF-orange?logo=scikitlearn)](https://scikit-learn.org/)

**EduSense** is a comprehensive, enterprise-grade educational analytics platform designed to enhance student success through real-time engagement monitoring and predictive academic risk assessment. By integrating Computer Vision, Machine Learning, and Explainable AI (XAI), EduSense provides actionable insights for students, faculty, and administrators.

---

## Key Features

### 1. Biometric Attendance System
*   **Smart Enrollment**: Capture multi-angle facial photos to generate 128-D biometric signatures using `dlib` and `face_recognition`.
*   **Live Recognition**: Real-time monitoring via Raspberry Pi/Webcam. Students are marked PRESENT automatically based on cosine similarity thresholds (> 0.6).
*   **Hardware Integration**: Supports MQTT-based event streams for live "Face Detected" notifications.

### 2. ML Risk Prediction Engine
*   **Advanced Feature Engineering**: Processes 20+ behavioral indicators including attendance trends, CA score slopes, and lab submission consistency.
*   **Ensemble Modeling**: Utilizes an ensemble of **XGBoost** and **Random Forest** classifiers, trained with **SMOTE** to handle class imbalances.
*   **Explainable AI (SHAP)**: Provides transparency into AI decisions by identifying the top-3 impact factors (e.g., "Decreasing Attendance", "Low Internal Marks") for every student at risk.

### 3. Professional Multi-Role Dashboards
*   **HOD Control Center**: Department-wide intelligence, faculty performance audits, and risk distribution matrices. Features specialized views for **Analytics**, **Faculties**, **Students**, and **Management**.
*   **Faculty Dashboard**: Class-level heatmaps, automated parent alerting system, and SHAP-based student drill-downs.
*   **Student Portal**: Personalized success tracking, "You vs Class" benchmarking, and AI-generated improvement tips.

### 4. Multi-Channel Alerting
*   **SMS/WhatsApp**: Automated parent notifications for high-risk flags via **Twilio**.
*   **Email Reports**: Weekly performance dossiers sent to faculty via **SMTP**.

---

## System Architecture

```text
EduSense/
├── backend/              # Flask REST API with JWT Authentication
├── frontend/             # React (Vite) + Tailwind CSS + Framer Motion
├── data_pipeline/        # CSV/JSON Ingestion & Feature Engineering
├── hardware/             # Face recognition (OpenCV/dlib) & IoT logic
├── ml_engine/            # Model training & XAI (SHAP) logic
├── data/                 # Raw departmental JSON and CSV marks sheets
├── requirements.txt      # Python dependencies
├── db_config.py          # PostgreSQL connection utilities
```

---

## Deployment Guide

### 1. Render (Backend)
To deploy the backend on Render successfully:
1.  **New Web Service**: Connect your GitHub repository.
2.  **Environment**: `Python 3`.
3.  **Root Directory**: `(Leave Empty / Project Root)`.
4.  **Build Command**: `pip install -r requirements.txt && python auto_init.py`.
5.  **Start Command**: `gunicorn --timeout 120 --bind 0.0.0.0:$PORT backend.run:app`.
6.  **Environment Variables**:
    *   `PYTHONPATH`: `.`
    *   `JWT_SECRET_KEY`: `any-secret-string`

### 2. Vercel (Frontend)
The frontend is already configured with `vercel.json` in the root:
1.  **Framework Preset**: `Vite`.
2.  **Root Directory**: `(Leave Empty / Project Root)`.
3.  **Build Command**: `cd frontend && npm install && npm run build`.
4.  **Output Directory**: `frontend/dist`.

---

## Login Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Student** | `Roll Number` (e.g., CS225201) | `Full PRN` (e.g., 24022521242003) |
| **S.E Class Teacher** | `DRS` (Prof. Devkar R.S.) | `edu123` |
| **T.E Class Teacher** | `BPG` (Prof. Bais P.G.) | `edu123` |
| **B.E Class Teacher** | `JPK` (Prof. Jadhav P.K.) | `edu123` |
| **HOD** | `PVK` (Prof. Pawar V.K.) | `edu123` |

---

## Developed For
**SSIEMS Computer Science & Engineering Department**  
*Predicting success, preventing failure.*
