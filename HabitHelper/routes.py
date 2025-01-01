import datetime
import random

# from datetime import datetime
from pathlib import Path

import click
from flask import current_app, render_template, request

from habithelper.models import Day, Entry, Habit


@current_app.route("/")
def index():
    return render_template(
        "index.html", debug=current_app.config.get("ENV") == "development"
    )


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
def add_habit():
    success = True
    msg = ""

    try:
        habit_ = Habit(
            name=request.json.get("name"),
            start_date=datetime.date.today(),
            frequency="daily",
            reminder=False,
            color="#{:06x}".format(random.randint(0, 0xFFFFFF)),
        )
        habit_.add()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/add_entry")
def add_entry():
    success = True
    msg = ""

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        date_ = datetime.datetime.strptime(request.json.get("date"), "%a %b %d %Y")

        if date_.strftime("%Y-%m-%d") not in [
            str(i.entry_date) for i in habit_.entries
        ]:
            entry_ = Entry(
                entry_date=date_,
                habit_id=habit_.id,
            )
            entry_.add()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/delete_habit")
def delete_habit():
    success = True
    msg = ""

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        habit_.delete()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/edit_habit")
def edit_habit():
    success = True
    msg = ""

    try:
        habit_ = Habit.get(int(request.json.get("id")))
        habit_.name = request.json.get("name")
        habit_.color = request.json.get("color")

        habit_.edit()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/delete_entry")
def delete_entry():
    success = True
    msg = ""

    try:
        entry_ = Entry.get(int(request.json.get("id")))
        entry_.delete()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/get_habits")
def get_habits():
    success = True
    msg = ""
    habits_ = []

    try:
        habits_ = [i.to_dict() for i in Habit.all()]
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "habits": habits_,
    }


@current_app.post("/get_calendar")
def get_calendar():
    success = True
    msg = ""
    days = []

    try:
        days = Day.get_calendar(limit=int(request.json.get("limit")))
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
