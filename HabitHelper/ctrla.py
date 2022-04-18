import datetime
from calendar import Calendar
from datetime import timedelta, date

from flask_login import current_user
from sqlalchemy import text

from HabitHelper import db


class Database:
    def __init__(self):
        pass

    @staticmethod
    def add(object_):
        db.session.add(object_)
        db.session.commit()

    @staticmethod
    def add_multiple(objects: list):
        for i in objects: db.session.add(i)
        db.session.commit()

    @staticmethod
    def get(type_, id_: int):
        return db.session.query(type_).get(id_)

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(object_):
        db.session.delete(object_)
        db.session.commit()

    @staticmethod
    def delete_multiple(objects: list):
        for i in objects: db.session.delete(i)
        db.session.commit()

    @staticmethod
    def search(type_, filter_: str = "", order_by: str = ""):
        return db.session.query(type_).filter(text(filter_)).order_by(text(order_by))

    @staticmethod
    def execute_stmt(stmt: str):
        db.session.execute(stmt)
        db.session.commit()


class HabitCalendar(Calendar):
    def __init__(self):
        super().__init__()

    @staticmethod
    def format_day(day: date):
        some = []
        for i in current_user.entries:
            if i.date_created == day:
                some.append(
                    "<a href='habit?id_=%s' class='bi bi-circle-fill m-1' style='color:%s'></a>" % (
                        i.habit, i.habits.color))
        return "<div class='card col-2'><div class='card-body my-3'>%s %s</div></div>" % (day.day, "".join(some))

    def get_last_week(self):
        return [self.format_day(datetime.date.today() - timedelta(days=i)) for i in range(0, 7)]

    def get_last_month(self):
        return [self.format_day(datetime.date.today() - timedelta(days=i)) for i in range(0, 30)]
