from flask_login import UserMixin
from sqlalchemy import Column, Integer, Text, DateTime

from HabitHelper import db


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    password = Column(Text)
    date_created = Column(DateTime)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
