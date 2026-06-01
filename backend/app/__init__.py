from flask import Flask
from flask_cors import CORS
from .models import db
from ..config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    # Register Blueprints
    from .routes.student_routes import student_bp
    from .routes.attendance_routes import attendance_bp
    
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    
    @app.route('/api/status')
    def status():
        return {"status": "EduSense API is running", "version": "1.1.0"}
        
    return app
