import os
import subprocess
import sys

def run_init():
    print("Starting automated data initialization...")
    
    # Set up environment with current directory in PYTHONPATH
    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()
    
    try:
        # 1. Run Data Ingestion
        print("Ingesting real data...")
        subprocess.run([sys.executable, "data_pipeline/ingest_real_data.py"], env=env, check=True)
        
        # 2. Run Feature Engineering
        print("Engineering features...")
        subprocess.run([sys.executable, "data_pipeline/feature_engineering.py"], env=env, check=True)
        
        # 3. Run ML Training
        print("Training ML models...")
        subprocess.run([sys.executable, "ml_engine/trainer.py"], env=env, check=True)
        
        print("Initialization complete!")
    except Exception as e:
        print(f"Initialization failed: {e}")
        raise

if __name__ == "__main__":
    run_init()
