from calendar import Calendar
import datetime

import click

from . import db


class Habit(db.Model):
    __tablename__ = "habits"

    name = db.Column(db.Text)
    start_date = db.Column(db.Date)
    frequency = db.Column(db.Text, default="daily")
    end_date = db.Column(db.Date)
    reminder = db.Column(db.Boolean, default=False)
    color = db.Column(db.Text)
    entries = db.relationship("Entry", backref="habits", lazy="dynamic")
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Habit, self).__init__(**kwargs)

    @classmethod
    def get(cls, id):
        return Habit.query.get(id)

    @classmethod
    def all(cls):
        return sorted([i for i in Habit.query.all()], key=lambda x: x.id, reverse=True)

    @classmethod
    def delete_all(cls):
        for i in Habit.all():
            db.session.delete(i)

        db.session.commit()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        for i in self.entries:
            db.session.delete(i)

        db.session.delete(self)
        db.session.commit()

    def clear(self):
        for i in self.entries:
            db.session.delete(i)

        db.session.commit()

    def get_streaks(self):
        data = sorted(self.entries, key=lambda x: x.entry_date, reverse=True)

        if not data:
            return None

        streaks = []
        current_streak_value = data[0]
        current_streak_length = 1

        for i in range(1, len(data)):
            if ((current_streak_value.entry_date - data[i].entry_date).days) == 1:
                current_streak_length += 1
                current_streak_value = data[i]
            else:
                streaks.append(current_streak_length)
                current_streak_value = data[i]
                current_streak_length = 1

        if current_streak_length > 1:
            streaks.append(current_streak_length)

        sorted_ = sorted([i for i in streaks if i > 1], key=lambda g: g, reverse=True)
        if len(sorted_) > 0:
            return sorted_[0]
        else:
            return None

    def to_dict(self):
        entries_ = sorted(self.entries, key=lambda x: x.entry_date, reverse=True)

        return {
            "name": self.name,
            "start_date": self.start_date,
            "frequency": self.frequency,
            "end_date": self.end_date,
            "reminder": self.reminder,
            "color": self.color,
            "entries": [i.to_dict() for i in entries_],
            "id": self.id,
            "streaks": self.get_streaks(),
        }


class Day:
    def __init__(self):
        pass

    @classmethod
    def get_calendar(cls, limit=7):
        today = datetime.datetime.now()
        dates = []

        for i in range(0, limit):
            currentDate = today - datetime.timedelta(i)
            found = []

            for j in Entry.all():
                if str(j.entry_date) == str(currentDate)[:10]:
                    new_dict = {
                        "id": j.id,
                        "entryDate": j.entry_date.strftime("%B %-d, %Y"),
                        "habitColor": j.habits.color,
                        "habitName": j.habits.name,
                        "habitId": j.habits.id,
                    }
                    found.append(new_dict)

            dates.append(
                {
                    "date_": currentDate.strftime("%a %-m/%-d"),
                    "year": currentDate.year,
                    "month": currentDate.month - 1,
                    "day": currentDate.day,
                    "entries": sorted(
                        found, key=lambda d: d.get("habitId"), reverse=True
                    ),
                }
            )

        return dates

    @classmethod
    def get_month(cls, month, year, habit_id):
        dates = []
        habit_ = Habit.get(habit_id)
        for i in Calendar(6).itermonthdates(year, month):
            found = []
            if i.month == month and i <= datetime.date.today():
                for j in habit_.entries:
                    if str(j.entry_date) == str(i):
                        found.append(
                            {
                                "id": j.id,
                                "entryDate": j.entry_date.strftime("%B %-d, %Y"),
                                "habitColor": j.habits.color,
                                "habitName": j.habits.name,
                                "habitId": j.habits.id,
                            }
                        )

                dates.append(
                    {
                        "id": i.strftime("%y%m%d"),
                        "year": i.year,
                        "monthInt": i.month,
                        "monthName": i.strftime("%B"),
                        "day": i.day,
                        "weekdayInt": i.weekday(),
                        "weekdayName": i.strftime("%a"),
                        "fullStamp": i.strftime("%B %-d"),
                        "entries": found,
                    }
                )
        return dates

    @classmethod
    def clear(cls, date):
        found = []

        for j in Entry.all():
            if str(j.entry_date) == str(date)[:10]:
                found.append(j)

        for k in found:
            db.session.delete(k)

        db.session.commit()


class Entry(db.Model):
    __tablename__ = "entries"

    entry_date = db.Column(db.Date)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"))
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Entry, self).__init__(**kwargs)

    @classmethod
    def get(cls, id):
        return Entry.query.get(id)

    @classmethod
    def all(cls):
        return sorted([i for i in Entry.query.all()], key=lambda x: x.id, reverse=True)

    @classmethod
    def delete_all(cls):
        for i in Entry.all():
            db.session.delete(i)

        db.session.commit()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "entryDate": self.entry_date.strftime("%B %-d, %Y"),
            "entryDateFormat2": self.entry_date.strftime("%a %b %d %Y"),
            "habitId": self.habit_id,
        }
