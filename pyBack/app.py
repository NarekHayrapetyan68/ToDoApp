from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from auth import auth_bp
from task import task_bp
from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)




app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(task_bp, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
