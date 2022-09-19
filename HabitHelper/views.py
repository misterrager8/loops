import datetime
import random

from flask import current_app, redirect, render_template, request

from habithelper.models import Item


@current_app.context_processor
def get_items():
    return dict(items_=Item.all())


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/add_item", methods=["POST"])
def add_item():
    item_ = Item(
        request.form["name"],
        color="#{:06x}".format(random.randint(0, 0xFFFFFF)),
        date_added=datetime.datetime.now(),
    )
    item_.insert()

    return redirect(request.referrer)


@current_app.route("/edit_item", methods=["POST"])
def edit_item():
    item_ = Item.get(int(request.args.get("id_")))
    item_.name = request.form["name"]
    item_.edit()

    return redirect(request.referrer)


@current_app.route("/delete_item")
def delete_item():
    item_ = Item.get(int(request.args.get("id_")))
    item_.delete()

    return redirect(request.referrer)
