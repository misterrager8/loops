from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, text, Date
from sqlalchemy.orm import relationship

from HabitHelper import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    password = Column(Text)
    date_created = Column(DateTime)
    habits = relationship("Habit", lazy="dynamic")
    entries = relationship("Entry", lazy="dynamic")

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def get_habits(self, filter_: str = "", order_by: str = "date_created desc"):
        return self.habits.filter(text(filter_)).order_by(text(order_by))

    def get_entries(self):
        return self.entries.order_by(text("date_created desc"))


class Habit(db.Model):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True)
    description = Column(Text)
    color = Column(Text)
    frequency = Column(Text, default="Daily")
    date_created = Column(DateTime)
    user = Column(Integer, ForeignKey("users.id"))
    entries = relationship("Entry", lazy="dynamic", backref="habits")

    def __init__(self, **kwargs):
        super(Habit, self).__init__(**kwargs)

    def get_entries(self):
        return self.entries.order_by(text("date_created desc"))


class Entry(db.Model):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True)
    date_created = Column(Date)
    habit = Column(Integer, ForeignKey("habits.id"))
    user = Column(Integer, ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(Entry, self).__init__(**kwargs)
