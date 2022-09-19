from habithelper import config, create_app


def run():
    app = create_app(config)
    app.run()
