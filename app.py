from loops import config, create_app

app = create_app(config)

if __name__ == "__main__":
    app.run(port=config.PORT, debug=True)
