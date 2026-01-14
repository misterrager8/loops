import datetime
import random

# from datetime import datetime
from pathlib import Path

from flask import current_app, request, send_from_directory
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from loops.models import Day, Entry, Habit, User

from . import login_manager


@current_app.route("/")
def index():
    return send_from_directory(current_app.static_folder, "index.html")


@current_app.post("/signup")
def signup():
    success = True
    msg = ""
    user_ = None

    try:
        email = request.json.get("email")
        username = request.json.get("username")
        password = request.json.get("password")
        password_confirm = request.json.get("passwordConfirm")

        if password == password_confirm:
            user__ = User(
                email=email,
                username=username,
                password=generate_password_hash(password),
            )

            user__.add()
            login_user(user__)

            user_ = user__.todict()

    except Exception as e:
        success = False
        msg = str(e)

    return {"success": success, "msg": msg, "user": user_}


@login_manager.user_loader
def load_user(id_: int):
    return User.query.get(id_)


@current_app.post("/login")
def login():
    success = True
    msg = ""
    user_ = None

    try:
        username = request.json.get("username")
        password = request.json.get("password")

        user__: User = User.query.filter_by(username=username).first()
        if user__ and check_password_hash(user__.password, password):
            user_ = user__.todict()
            login_user(user__)
        else:
            success = False
            msg = "User not found, Try again"

    except Exception as e:
        success = False
        msg = str(e)

    return {"success": success, "msg": msg, "user": user_}


@current_app.post("/logout")
def logout():
    success = True
    msg = ""

    try:
        logout_user()
        success = True
    except Exception as e:
        success = False
        msg = str(e)

    return {"success": success, "msg": msg}


@current_app.post("/about")
def about():
    success = True
    msg = ""
    readme_ = ""

    try:
        readme_ = open(Path(__file__).parent.parent / "README.md").read()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "readme": readme_,
    }


@current_app.post("/add_habit")
@login_required
def add_habit():
    success = True
    msg = ""
    habit_ = None
    habits_ = []

    try:
        habit_ = Habit(
            user_id=current_user.id,
            name=request.json.get("name"),
            start_date=datetime.date.today(),
            frequency="daily",
            reminder=False,
            color="#{:06x}".format(random.randint(0, 0xFFFFFF)),
        )
        habit_.add()

        habit_ = habit_.to_dict()
        habits_ = [i.to_dict() for i in Habit.all(current_user.id)]
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "habits": habits_,
        "habit": habit_,
    }


@current_app.post("/add_entry")
@login_required
def add_entry():
    success = True
    msg = ""
    days = []

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        date_ = datetime.datetime.strptime(request.json.get("date"), "%a %b %d %Y")

        if date_.strftime("%Y-%m-%d") not in [
            str(i.entry_date) for i in habit_.entries
        ]:
            entry_ = Entry(
                entry_date=date_, habit_id=habit_.id, user_id=current_user.id
            )
            entry_.add()

        days = Day.get_calendar(current_user.id, limit=int(request.json.get("limit")))

    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
    }


@current_app.post("/delete_habit")
def delete_habit():
    success = True
    msg = ""
    days = []
    habits_ = []

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        habit_.delete()

        days = Day.get_calendar(current_user.id, limit=int(request.json.get("limit")))
        habits_ = [i.to_dict() for i in Habit.all(current_user.id)]
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
        "habits": habits_,
    }


@current_app.post("/edit_habit")
def edit_habit():
    success = True
    msg = ""
    habit_ = None
    days = []
    habits_ = []

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        habit_.name = request.json.get("name")
        habit_.color = request.json.get("color")

        habit_.edit()

        days = Day.get_calendar(current_user.id, limit=int(request.json.get("limit")))
        habits_ = [i.to_dict() for i in Habit.all(current_user.id)]
        habit_ = habit_.to_dict()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
        "habits": habits_,
        "habit": habit_,
    }


@current_app.post("/delete_entry")
def delete_entry():
    success = True
    msg = ""
    days = []

    try:
        entry_ = Entry.get(int(request.json.get("id")))
        entry_.delete()

        days = Day.get_calendar(current_user.id, limit=int(request.json.get("limit")))

    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
    }


@current_app.post("/get_habits")
@login_required
def get_habits():
    success = True
    msg = ""
    habits_ = []

    try:
        habits_ = [i.to_dict() for i in Habit.all(current_user.id)]
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "habits": habits_,
    }


@current_app.post("/get_calendar")
@login_required
def get_calendar():
    success = True
    msg = ""
    days = []

    try:
        if not request.json.get("habitId"):
            days = Day.get_calendar(
                current_user.id, limit=int(request.json.get("limit"))
            )
        else:
            days = Day.get_calendar_with_habit(
                current_user.id,
                int(request.json.get("habitId")),
                limit=int(request.json.get("limit")),
            )
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
    }


@current_app.post("/get_month_with_habit")
def get_month_with_habit():
    success = True
    msg = ""
    days = []

    try:
        days = Day.get_month_with_habit(
            int(request.json.get("month")),
            int(request.json.get("year")),
            int(request.json.get("habitId")),
        )
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
    }


@current_app.post("/get_month")
@login_required
def get_month():
    success = True
    msg = ""
    days = []

    try:
        days = Day.get_month(
            int(request.json.get("month")),
            int(request.json.get("year")),
            current_user.id,
        )
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "days": days,
    }


@current_app.post("/get_habit")
def get_habit():
    success = True
    msg = ""

    try:
        habit_ = Habit.get(int(request.json.get("id")))
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "habit": habit_.to_dict(),
    }


@current_app.post("/clear_habit")
def clear_habit():
    success = True
    msg = ""

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        habit_.clear()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "habit": habit_.to_dict(),
    }


@current_app.post("/clear_day")
@login_required
def clear_day():
    success = True
    msg = ""

    try:
        date_ = datetime.datetime.strptime(request.json.get("date"), "%a %b %d %Y")
        Day.clear(date_, current_user.id)
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }
