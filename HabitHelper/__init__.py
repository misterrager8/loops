import mysql.connector
from flask import Flask

from habithelper import config

mysql_ = mysql.connector.connect(
    user=config.USER, password=config.PASSWORD, host=config.HOST
)
cursor_ = mysql_.cursor()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from . import views

        cursor_.execute("CREATE DATABASE IF NOT EXISTS HabitHelper")
        # cursor_.execute("DROP TABLE HabitHelper.habits")
        cursor_.execute(
            "CREATE TABLE IF NOT EXISTS HabitHelper.habits (id INT PRIMARY KEY AUTO_INCREMENT, name TEXT, color TEXT, date_added DATETIME)"
        )

        return app
