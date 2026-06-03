# EduSense: AI-Powered Student Success System

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%203.0-lightgrey?logo=flask)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-336791?logo=sqlite)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Machine Learning](https://img.shields.io/badge/ML-XGBoost%20%2B%20RF-orange?logo=scikitlearn)](https://scikit-learn.org/)

**EduSense** is a sophisticated, enterprise-grade educational analytics platform designed to enhance student success through real-time engagement monitoring and predictive academic risk assessment. By integrating Computer Vision, Machine Learning, and Explainable AI (XAI), EduSense provides actionable insights for students, faculty, and administrators.

---

## 🚀 Project Overview

EduSense revolutionizes classroom management by combining real-time biometric facial recognition with advanced machine learning for predictive risk assessment. Using 128-D biometric signatures for automated attendance and transparent SHAP insights for early academic warning, the platform provides role-based smart dashboards and multi-channel auto alerts (SMS, WhatsApp, and Email) to ensure a seamless, data-driven ecosystem for student success and proactive intervention.

### Core Technologies
*   **Biometric Attendance**: Real-time facial recognition using 128-D biometric signatures for high-accuracy identification.
*   **Risk Prediction**: ML models (XGBoost + Random Forest) identifying at-risk students with deep SHAP insights for proactive intervention.
*   **Smart Dashboards**: Role-based control centers providing real-time intelligence for HODs, Faculty, and Students.
*   **Auto Alerts**: Multi-channel notifications via SMS, WhatsApp, and Email to ensure a fast response loop.

---

## 🛠️ System Architecture

```text
EduSense/
├── backend/              # Flask REST API with JWT Authentication
│   ├── app/              # Application logic & routes
│   └── run.py            # Server entry point
├── frontend/             # React (Vite) + Tailwind CSS + Framer Motion
│   ├── src/components/   # Modular UI components
│   └── src/services/     # API integration
├── ml_engine/            # Model training & XAI (SHAP) logic
├── data_pipeline/        # CSV/JSON Ingestion & Feature Engineering
├── hardware/             # Face recognition (OpenCV/dlib) & IoT logic
├── data/                 # Raw departmental JSON and CSV marks sheets
└── db_config.py          # Database connection utilities
```

---

## 👨‍💻 Development Team

| Name | Role | Profile |
| :--- | :--- | :--- |
| **Syed Asif Syed Gaffar** | Lead Developer | [LinkedIn](https://www.linkedin.com/in/the-syed-as_if) |
| **Arpita Mukund Jondhale** | Researcher & Developer | [LinkedIn](https://www.linkedin.com/in/arpita-jondhale-87816629a) |
| **Gayatri Shriram Bharose** | Data Analyst | [LinkedIn](https://www.linkedin.com/in/gayatri-bharose-68a059292) |

### Under the Guidance of
**Prof. Pawar V.K.**  
*Head of Department, Computer Science & Engineering*  
MSPM’S Shri Shivaji Institute of Engineering and Management Studies, Parbhani.

---

## ⚙️ Installation & Setup

### 1. Backend Setup
1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Initialize & Train**:
    ```bash
    python auto_init.py
    ```
3.  **Run Server**:
    ```bash
    python backend/run.py
    ```

### 2. Frontend Setup
1.  **Navigate to directory**: `cd frontend`
2.  **Install Packages**: `npm install`
3.  **Start Dev Server**: `npm run dev`

---

## 🎓 Academic Batches (2025-26)

| Batch | Students | Focus Area |
| :--- | :--- | :--- |
| **S.E. (Second Year)** | 71 | Foundation & Core Engineering |
| **T.E. (Third Year)** | 75 | Advanced Systems & Algorithms |
| **B.E. (Final Year)** | 70 | Research & Project Specialization |

---

## 🔐 Login Credentials (Demo)

| Role | Username | Password |
| :--- | :--- | :--- |
| **HOD** | `PVK` | `edu123` |
| **Faculty (S.E)** | `DRS` | `edu123` |
| **Faculty (T.E)** | `BPG` | `edu123` |
| **Faculty (B.E)** | `JPK` | `edu123` |
| **Student (S.E)** | `CS225201` | `24022521242003` |
| **Student (T.E)** | `CS25301` | `2222521242041` |
| **Student (B.E)** | `BECSE_1` | `2022521242021` |

---

**SSIEMS Computer Science & Engineering Department**  
*Predicting success, preventing failure.*
