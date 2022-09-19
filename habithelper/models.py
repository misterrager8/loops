import datetime

from habithelper import cursor_, mysql_


class Item(object):
    def __init__(
        self, name: str, color: str, date_added: datetime.datetime, id: int = None
    ):
        self.name = name
        self.color = color
        self.date_added = date_added
        self.id = id

    @classmethod
    def get(cls, id: int):
        cursor_.execute(
            "SELECT name, color, date_added, id FROM HabitHelper.habits WHERE id=%s",
            (id,),
        )
        result = cursor_.fetchone()
        return Item(result[0], result[1], result[2], result[3])

    @classmethod
    def all(cls):
        cursor_.execute(
            "SELECT name, color, date_added, id FROM HabitHelper.habits ORDER BY id DESC"
        )
        results = cursor_.fetchall()
        return [Item(i[0], i[1], i[2], i[3]) for i in results]

    def insert(self):
        cursor_.execute(
            "INSERT INTO HabitHelper.habits (name, color, date_added) VALUES (%s, %s, %s)",
            (
                self.name,
                self.color,
                self.date_added,
            ),
        )
        mysql_.commit()

    def edit(self):
        cursor_.execute(
            "UPDATE HabitHelper.habits SET name=%s, color=%s, date_added=%s WHERE id=%s",
            (
                self.name,
                self.color,
                self.date_added,
                self.id,
            ),
        )
        mysql_.commit()

    def delete(self):
        cursor_.execute("DELETE FROM HabitHelper.habits WHERE id=%s", (self.id,))
        mysql_.commit()
