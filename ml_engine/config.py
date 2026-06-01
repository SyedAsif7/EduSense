class MLConfig:
    RANDOM_STATE = 42
    TEST_SIZE = 0.2
    MODEL_PATH = "ml_engine/models/"
    FEATURE_COLS = [
        "attendance_percentage", "absence_streak", "attendance_slope", 
        "verification_rate", "proxy_attempt_count", "ca_score_pct", 
        "ca_trend", "lab_completion_rate", "assignment_submission_rate"
    ] + [f"subject_{i}_att" for i in range(1, 8)] + ["extra_signal_1", "extra_signal_2", "extra_signal_3", "extra_signal_4"]
    
    # XGBoost Hyperparameters
    XGB_PARAMS = {
        'n_estimators': 100,
        'max_depth': 5,
        'learning_rate': 0.1,
        'random_state': 42
    }
    
    # Random Forest Hyperparameters
    RF_PARAMS = {
        'n_estimators': 100,
        'max_depth': 10,
        'random_state': 42
    }
