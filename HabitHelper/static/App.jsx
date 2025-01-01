const defaultSettings = {
  theme: "light",
};

const MultiContext = React.createContext();

const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => (!data.success ? alert(data.msg) : callback(data)));

function Icon({ className, name }) {
  return <i className={className + " bi bi-" + name}></i>;
}

function Button({ className, type_, onClick, icon, text, size }) {
  return (
    <button
      type={type_}
      className={className + " btn" + (size === "sm" ? " btn-sm" : "")}
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
      {text}
    </button>
  );
}

function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
  size,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={
        className + " form-control" + (size === "sm" ? " form-control-sm" : "")
      }
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}

function ButtonGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " btn-group" + (size === "sm" ? " btn-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function InputGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " input-group" + (size === "sm" ? " input-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function Spinner({ className }) {
  return (
    <span className={className + " spinner-border spinner-border-sm"}></span>
  );
}

function Badge({ className, icon, text }) {
  return (
    <span className={className + " badge"}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </span>
  );
}

function Dropdown({
  className,
  classNameBtn,
  classNameMenu,
  target,
  icon,
  children,
  text,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        className={classNameBtn + " dropdown-toggle"}>
        {icon && <Icon name={icon} className="me-1" />}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}

function Modal({ className, classNameBtn, target, icon, children, text }) {
  return (
    <>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="modal"
        className={classNameBtn + " btn"}>
        {icon && <Icon name={icon} className="me-1" />}
        {text}
      </a>
      <div id={target} className="modal">
        <div className="modal-dialog">
          <div className={"modal-content p-3 " + className}>{children}</div>
        </div>
      </div>
    </>
  );
}

function Heading({ className, size = 1, icon, text }) {
  return (
    <div className={className + " text-center h" + size}>
      {icon && <Icon name={icon} className="me-3" />}
      {text}
    </div>
  );
}

function HomePage({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);
  const onChangeLimit = (e) => setLimit(e.target.value);

  const limitOptions = [7, 14, 30, 90];

  React.useEffect(() => {
    multiCtx.getHabits();
  }, []);

  React.useEffect(() => {
    multiCtx.getCalendar();
  }, [multiCtx.limit]);

  return (
    <>
      <div>
        <div className="row">
          <div className="col-3">
            <form
              className="mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                multiCtx.addHabit(name);
                setName("");
              }}>
              <Input
                size="sm"
                onChange={onChangeName}
                className="label"
                value={name}
                placeholder="New Habit"
              />
            </form>
            {multiCtx.habits?.map((x) => (
              <React.Fragment key={x.id}>
                <HabitItem item={x} />
              </React.Fragment>
            ))}
          </div>
          <div className="col-9">
            <ButtonGroup size="sm" className="mb-3">
              {limitOptions.map((x) => (
                <Button
                  className={multiCtx.limit === x ? "active" : ""}
                  onClick={() => multiCtx.setLimit(x)}
                  text={x}
                />
              ))}
            </ButtonGroup>
            <div
              className={className}
              style={{ display: "flex", flexWrap: "wrap" }}>
              {multiCtx.days.map((x) => (
                <DayItem item={x} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Display({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " py-4"}>
      <HomePage />
    </div>
  );
}

function HabitItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeColor = (e) => setColor(e.target.value);

  React.useEffect(() => {
    setName(item.name);
    setColor(item.color);
  }, []);

  const editHabit = (e) => {
    e.preventDefault();
    api("edit_habit", { id: item.id, name: name, color: color }, (data) => {
      multiCtx.getHabits();
      setSaved(true);
      setTimeout(() => setSaved(false), 500);
    });
  };

  const deleteHabit = () => {
    api("delete_habit", { id: item.id }, (data) => {
      multiCtx.getHabits();
      multiCtx.getCalendar();
    });
    m;
  };

  return (
    <form onSubmit={(e) => editHabit(e)} className="input-group mb-1">
      <Button
        type_="button"
        className="border-0"
        icon="fast-forward-fill"
        onClick={() => {
          multiCtx.addEntry(item.id, new Date().toDateString());
        }}
      />
      {saved && <Button className="border-0" icon="check-lg" />}
      <Input
        className="m-1"
        type_="color"
        onChange={onChangeColor}
        value={color}
      />
      <Input
        value={name}
        onChange={onChangeName}
        className="py-0 border-0 label"
      />
      <Button type_="submit" className="d-none" />
      {deleting && (
        <Button
          className="border-0"
          onClick={() => deleteHabit()}
          type_="button"
          icon="question-lg"
        />
      )}
      <Button
        className="border-0"
        onClick={() => setDeleting(!deleting)}
        type_="button"
        icon="x-circle"
      />
    </form>
  );
}

function EntryItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

  const deleteEntry = () => {
    api("delete_entry", { id: item.id }, (data) => {
      multiCtx.getHabits();
    });
  };

  return (
    <>
      <div className={className + " between"}>
        <div>{item.entryDate}</div>
        <ButtonGroup size="sm">
          {deleting && (
            <Button
              className="border-0 text-danger"
              onClick={() => deleteEntry()}
              icon="question-lg"
            />
          )}
          <Button
            className="border-0 text-danger"
            onClick={() => setDeleting(!deleting)}
            icon="x-lg"
          />
        </ButtonGroup>
      </div>
    </>
  );
}

function DayItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

  const deleteEntry = () => {
    api("delete_entry", { id: item.entries[0].id }, (data) => {
      multiCtx.getHabits();
      multiCtx.getCalendar();
      multiCtx.setHovered(null);
    });
  };

  const excludeHabits = () => {
    let ids = [];
    for (let x = 0; x < item.entries.length; x++) {
      ids.push(item.entries[x].habitId);
    }
    return ids;
  };

  return (
    <div className="day-outer">
      <div className="day-inner">
        <Dropdown
          className="text-center mb-3"
          classNameBtn="label small"
          target="add-entry"
          text={item.date_}>
          {multiCtx.habits.map((x) => (
            <>
              {!excludeHabits().includes(x.id) && (
                <a
                  onClick={() =>
                    multiCtx.addEntry(
                      x.id,
                      new Date(item.year, item.month, item.day).toDateString()
                    )
                  }
                  className="dropdown-item">
                  <i
                    className="bi bi-square-fill me-2"
                    style={{ color: x.color }}></i>
                  <span>{x.name}</span>
                </a>
              )}
            </>
          ))}
        </Dropdown>
        <div>
          {item.entries.map((y) => (
            <i
              onClick={() => {
                multiCtx.setHovered(y);
              }}
              style={{ color: y.habitColor }}
              className={"cursor bi bi-square-fill p-1"}></i>
          ))}
        </div>
        {multiCtx.hovered?.entryDate === item.entries[0]?.entryDate &&
          multiCtx.hovered && (
            <div>
              <div className="text-center my-2 label small">
                {multiCtx.hovered?.habitName}
              </div>
              <div className="d-flex">
                <ButtonGroup size="sm" className="mx-auto">
                  <Button
                    icon="arrow-left"
                    className="border-0"
                    onClick={() => multiCtx.setHovered(null)}
                  />
                  <Button
                    icon="x-circle"
                    onClick={() => setDeleting(!deleting)}
                  />
                  {deleting && (
                    <Button icon="question-lg" onClick={() => deleteEntry()} />
                  )}
                </ButtonGroup>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  const themes = [
    "light",
    "dark",
    "red-light",
    "orange-light",
    "yellow-light",
    "green-light",
    "blue-light",
    "indigo-light",
    "violet-light",
    "red-dark",
    "orange-dark",
    "yellow-dark",
    "green-dark",
    "blue-dark",
    "indigo-dark",
    "violet-dark",
  ];

  return (
    <div className={className + " between"}>
      <ButtonGroup size="sm">
        {multiCtx.loading && (
          <button className="btn border-0">
            <Spinner />
          </button>
        )}

        <Button text="habit-helper" className={"border-0 "} />
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button
          text={multiCtx.settings.theme}
          icon={multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"}
          className={"text-capitalize border-0 "}
          onClick={() =>
            multiCtx.setSettings({
              ...multiCtx.settings,
              theme: multiCtx.settings.theme === "light" ? "dark" : "light",
            })
          }
        />
      </ButtonGroup>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("habithelper")) || defaultSettings
  );
  const [habits, setHabits] = React.useState([]);
  const [days, setDays] = React.useState([]);
  const [currentHabit, setCurrentHabit] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);

  const [limit, setLimit] = React.useState(14);

  const getHabit = (id) => {
    api("get_habit", { id: id }, (data) => setCurrentHabit(data.habit));
  };

  const getHabits = () => {
    api("get_habits", {}, (data) => setHabits(data.habits));
  };

  const addHabit = (name) => {
    api("add_habit", { name: name }, (data) => {
      getHabits();
    });
  };

  const addEntry = (id, date) => {
    api("add_entry", { id: id, date: date }, (data) => {
      getHabits();
      getCalendar();
    });
  };

  const getCalendar = () => {
    api("get_calendar", { limit: limit }, (data) => setDays(data.days));
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    habits: habits,
    setHabits: setHabits,
    getHabits: getHabits,
    getHabit: getHabit,
    addHabit: addHabit,
    currentHabit: currentHabit,
    setCurrentHabit: setCurrentHabit,

    addEntry: addEntry,

    hovered: hovered,
    setHovered: setHovered,
    getCalendar: getCalendar,

    limit: limit,
    setLimit: setLimit,
    days: days,
    setDays: setDays,
  };

  React.useEffect(() => {
    localStorage.setItem("habithelper", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-5">
        <div>
          <Nav />
          <Display />
        </div>
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
