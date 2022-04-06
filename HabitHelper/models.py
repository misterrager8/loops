from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship

from HabitHelper import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    password = Column(Text)
    date_created = Column(DateTime)
    habits = relationship("Habit", lazy="dynamic")

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    def get_habits(self, filter_: str = "", order_by: str = "date_created desc"):
        return self.habits.filter(text(filter_)).order_by(text(order_by))


class Habit(db.Model):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True)
    description = Column(Text)
    color = Column(Text)
    frequency = Column(Text, default="Daily")
    date_created = Column(DateTime)
    user = Column(Integer, ForeignKey("users.id"))

    def __init__(self, **kwargs):
        super(Habit, self).__init__(**kwargs)
