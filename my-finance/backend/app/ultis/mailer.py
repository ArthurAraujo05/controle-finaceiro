mailer_code = """
from flask_mail import Mail, Message
from flask import current_app

mail = Mail()

def send_reset_email(to_email, code):
    msg = Message("Código de recuperação de senha",
                  sender=current_app.config["MAIL_USERNAME"],
                  recipients=[to_email])
    msg.body = f"Seu código de recuperação de senha é: {code}"
    mail.send(msg)
"""

with open("my-finance/backend/app/utils/mailer.py", "w") as file:
    file.write(mailer_code.strip())