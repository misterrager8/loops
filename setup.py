import setuptools

setuptools.setup(
    name="habithelper",
    entry_points={"console_scripts": ["habithelper=habithelper.__main__:cli"]},
)
