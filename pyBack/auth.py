from datetime import timedelta

from flask import Blueprint, request, jsonify
from .models import User, db
from flask_jwt_extended import create_access_token,decode_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
        return jsonify({"token": token})
    return jsonify({"message": "Invalid credentials"}), 401\



@auth_bp.route('/decode', methods=['POST'])
def decode_jwt_token():
    token = request.json.get('token')  # Assuming you send the token in the body
    try:
        # Decode the token using the JWT_SECRET_KEY from your Flask app config
        decoded_token = decode_token(token)
        return jsonify(decoded_token), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400