import os

import dotenv

dotenv.load_dotenv()

PORT = os.getenv("PORT") or "4999"
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")


def get():
    return dotenv.dotenv_values()


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
