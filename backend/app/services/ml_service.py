from ml_engine.model import RiskPredictionEngine
from data_pipeline.feature_engineering import FeatureEngineer
import os

class MLService:
    def __init__(self, db_path):
        self.engine = RiskPredictionEngine()
        self.engineer = FeatureEngineer(db_path)
        # In a real app, you'd load pre-trained models here
        # self.engine.load_models()

    def get_prediction(self, roll_number):
        features = self.engineer.get_all_features(roll_number)
        # features_df = pd.DataFrame([features])
        # risk = self.engine.predict_risk(features_df)
        
        # Mocking for now since models aren't trained
        return {
            "roll_number": roll_number,
            "risk_level": "Low",
            "confidence": 0.92,
            "top_factors": ["High Attendance", "Consistent CA Scores"]
        }

# Singleton instance
ml_service = MLService(os.path.join(os.path.dirname(__file__), '..', 'edusense.db'))
