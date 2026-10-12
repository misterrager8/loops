from datetime import date, timedelta

import click

from loops import config, create_app
from loops.models import Habit


def split_year_into_chunks(year, chunk_size=10):
    app = create_app(config)
    v = []

    with app.app_context():
        v = Habit.query.all()

    for i in v:
        print(i.name)

    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)

    chunks = []
    current_date = start_date

    while current_date <= end_date:
        chunk_end = min(current_date + timedelta(days=chunk_size - 1), end_date)

        chunks.append(
            {
                "start": current_date,
                "end": chunk_end,
                "days": (chunk_end - current_date).days + 1,
            }
        )

        current_date = chunk_end + timedelta(days=1)

    return chunks


f = split_year_into_chunks(2026, 7)
# for (
#     idx,
#     i,
# ) in enumerate(f):
#     click.secho(f"{idx} - {i.get("start")}", fg="blue")
