import datetime

from flask import render_template, current_app, request, url_for
from flask_login import login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import redirect

from HabitHelper import login_manager
from HabitHelper.ctrla import Database
from HabitHelper.models import User

database = Database()


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    user_: User = User.query.filter(User.username == username).first()
    if user_ and check_password_hash(user_.password, password):
        login_user(user_)
        return redirect(url_for("index"))
    else:
        return "Login failed."


@current_app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@current_app.route("/signup", methods=["POST"])
def signup():
    username = request.form["username"]
    password = request.form["password"]
    password_confirm = request.form["password_confirm"]

    if password == password_confirm:
        _ = User(username=username, password=generate_password_hash(password), date_created=datetime.datetime.now())
        database.add(_)
        login_user(_)
        return redirect(url_for("index"))
    else:
        return "Try again."


@current_app.route("/change_account", methods=["POST"])
def change_account():
    current_user.username = request.form["username"]
    database.update()

    return redirect(request.referrer)


@current_app.route("/change_password", methods=["POST"])
def change_password():
    old_password = request.form["old_password"]
    new_password = request.form["new_password"]
    new_password_confirm = request.form["new_password_confirm"]

    if check_password_hash(current_user.password, old_password) and new_password == new_password_confirm:
        current_user.password = generate_password_hash(new_password)
        database.update()
    else:
        return "Try again."

    return redirect(request.referrer)


@current_app.route("/delete_account")
def delete_account():
    database.delete(current_user)

    return redirect(url_for("index"))
