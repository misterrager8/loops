from loops import create_app, config

app = create_app(config)

if __name__ == "__main__":
    app.run()
