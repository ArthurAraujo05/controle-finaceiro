auth_routes_code = """

import ramdom
from flask import Blueprint, request, jsonify
from app.models.user import User, db    
from app.utils.mailer import send_reset_email
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already in use"}), 400
    user = User(name=data["name"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.commit()
    return jsonify({"message": "User created"}), 201
    
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and.check_password(data["password"]):
        token = create_access_token(identity=user.id)
        return jsonfy({"token": token}), 200
    return jsonify({"message": "Invalid credentials"}), 401
    
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not use or user.reset_code != data["code"]:
        return jsonify({"msg": "Codigo invalido"}), 400
    user.set_password(data["new_password"])
    user.reset_code = None
    db.session.commit()
    return jsonify({"msg": "Senha alterada com sucesso"}), 200

"""

with open ("my-finance/backend/app/routes/auth.py", "w") as file:
    file.write(auth_routes_code.strip())