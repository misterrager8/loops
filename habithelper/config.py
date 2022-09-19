import os

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
