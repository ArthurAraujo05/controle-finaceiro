config_code = """
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or "super-secret-key"
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or "jwt-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    #CONFIG FOR EMAIL
    MAIL_SERVER = 'smtp.googlemail.com'
    PORT = 587
    MAIL_USE_TLS = True
    export MAIL_USERNAME="arthur@gmail.com"
    export MAIL_PASSWORD="teste123"

"""

with open("my-finance/backend/app/config/config.py", "w") as file:
    f.write(config_code.strip())