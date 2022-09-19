import setuptools

setuptools.setup(
    name="HabitHelper",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["habits=habithelper.cli:run"]},
)
