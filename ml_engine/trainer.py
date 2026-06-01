import pandas as pd
import numpy as np
import pickle
import shap
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, f1_score
from imblearn.over_sampling import SMOTE
import os

class ModelTrainer:
    def __init__(self, data_path="features.csv"):
        self.data_path = data_path
        self.rf_model = None
        self.xgb_model = None

    def load_data(self):
        if not os.path.exists(self.data_path):
            print(f"Data file {self.data_path} not found. Run feature engineering first.")
            return None, None
        
        df = pd.read_csv(self.data_path)
        X = df.drop(["roll_number", "label"], axis=1)
        y = df["label"]
        return X, y

    def train_and_compare(self):
        X, y = self.load_data()
        if X is None: return

        # Handle class imbalance
        # Use a small k_neighbors because real data might have few samples per class
        min_samples = y.value_counts().min()
        k = min(5, min_samples - 1) if min_samples > 1 else 1
        
        if min_samples > 1:
            smote = SMOTE(random_state=42, k_neighbors=k)
            X_res, y_res = smote.fit_resample(X, y)
        else:
            print("Warning: Too few samples for SMOTE. Using original data.")
            X_res, y_res = X, y

        models = {
            "Logistic Regression": LogisticRegression(max_iter=1000),
            "Decision Tree": DecisionTreeClassifier(),
            "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42),
            "SVM": SVC(probability=True),
            "XGBoost": XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1, use_label_encoder=False, eval_metric='mlogloss')
        }

        cv = StratifiedKFold(n_splits=5)
        best_f1 = 0
        best_model_name = ""

        print("Comparing models...")
        for name, model in models.items():
            f1 = cross_val_score(model, X_res, y_res, cv=cv, scoring="f1_weighted").mean()
            print(f"{name} F1: {f1:.3f}")
            if f1 > best_f1:
                best_f1 = f1
                best_model_name = name

        print(f"\nBest Model: {best_model_name} with F1: {best_f1:.3f}")

        # Train final models (RF and XGBoost as requested)
        self.rf_model = models["Random Forest"]
        self.rf_model.fit(X_res, y_res)
        
        self.xgb_model = models["XGBoost"]
        self.xgb_model.fit(X_res, y_res)

        # Save models
        pickle.dump(self.rf_model, open("rf_model.pkl", "wb"))
        pickle.dump(self.xgb_model, open("xgb_model.pkl", "wb"))
        print("Models saved as rf_model.pkl and xgb_model.pkl")

        # SHAP explainability on XGBoost
        try:
            explainer = shap.Explainer(self.xgb_model, X)
            shap_values = explainer(X)
            # In a real script we might save the plot, but here we just confirm it works
            print("SHAP values calculated successfully.")
        except Exception as e:
            print(f"Error calculating SHAP values: {e}")

if __name__ == "__main__":
    trainer = ModelTrainer()
    trainer.train_and_compare()
