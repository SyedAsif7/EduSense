import joblib
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import shap
import pandas as pd

class RiskPredictionEngine:
    def __init__(self):
        self.rf_model = RandomForestClassifier()
        self.xgb_model = XGBClassifier()
        self.explainer = None

    def train_ensemble(self, X, y):
        """
        Trains the RF + XGBoost ensemble
        """
        self.rf_model.fit(X, y)
        self.xgb_model.fit(X, y)
        
        # Initialize SHAP explainer (using RF as representative)
        self.explainer = shap.TreeExplainer(self.rf_model)
        print("Ensemble models trained successfully.")

    def predict_risk(self, features_df):
        """
        Predicts risk level (Low, Medium, High)
        """
        rf_probs = self.rf_model.predict_proba(features_df)
        xgb_probs = self.xgb_model.predict_proba(features_df)
        
        # Average probabilities for ensemble
        avg_probs = (rf_probs + xgb_probs) / 2
        prediction = avg_probs.argmax(axis=1)
        
        risk_map = {0: "Low", 1: "Medium", 2: "High"}
        return risk_map.get(prediction[0], "Unknown")

    def explain_prediction(self, features_df):
        """
        Generates SHAP explanations
        """
        if self.explainer:
            shap_values = self.explainer.shap_values(features_df)
            return shap_values
        return None

    def save_models(self, path="models/"):
        joblib.dump(self.rf_model, f"{path}rf_model.pkl")
        joblib.dump(self.xgb_model, f"{path}xgb_model.pkl")
