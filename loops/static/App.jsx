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
  autoClose = true,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        data-bs-auto-close={autoClose}
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

function HomePage2({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);

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
              <React.Fragment key={`top-${x.id}`}>
                <HabitItem item={x} />
              </React.Fragment>
            ))}
          </div>
          <div className="col-9">
            <ButtonGroup size="sm" className="mb-3">
              {limitOptions.map((x) => (
                <React.Fragment key={x}>
                  <Button
                    className={multiCtx.limit === x ? "active" : ""}
                    onClick={() => multiCtx.setLimit(x)}
                    text={`${x} Days`}
                  />
                </React.Fragment>
              ))}
            </ButtonGroup>
            <div className="scroller">
              {multiCtx.days.map((x) => (
                <React.Fragment key={x.date_}>
                  <DayItem item={x} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomePage({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [currentMonth, setCurrentMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [days, setDays] = React.useState([]);
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  const weekdays = ["S", "M", "T", "W", "Th", "F", "S"];

  const getMonth = () => {
    api(
      "get_month",
      {
        month: currentMonth,
        year: currentYear,
        habitId: multiCtx.currentHabit.id,
      },
      (data) => {
        let days_ = data.days;

        let filler = Array(days_[0].weekdayInt + 1).fill({ filler: true });
        let filled = filler.concat(days_);

        setDays(days_[0].weekdayInt + 1 == 7 ? days_ : filled);
      }
    );
  };

  const addEntry = (id, date) => {
    api(
      "add_entry",
      {
        id: id,
        date: date,
      },
      (data) => {
        getMonth();
      }
    );
  };

  const deleteEntry = (id) => {
    api("delete_entry", { id: id }, (data) => getMonth());
  };

  const isToday = (day) => {
    let today = new Date();
    return (
      day.monthInt === today.getMonth() + 1 &&
      day.day === today.getDate() &&
      day.year === today.getFullYear()
    );
  };

  React.useEffect(() => {
    multiCtx.getHabits();
    if (multiCtx.currentHabit) {
      setSelected(null);
      getMonth();
    }
  }, [currentMonth, currentYear, multiCtx.currentHabit]);

  return (
    <div>
      <div className={className + " row"}>
        <div className="col-3">
          {multiCtx.habits.map((x) => (
            <div
              className={
                "p-1 m-1 " +
                (multiCtx.currentHabit?.id === x.id ? "selected" : "")
              }>
              <a
                className="label"
                onClick={() => multiCtx.setCurrentHabit(x)}
                key={x.id}>
                <i
                  className="bi bi-square-fill me-2"
                  style={{ color: x.color }}></i>
                <span className="small">{x.name}</span>
              </a>
            </div>
          ))}
        </div>
        <div className="col-9">
          {multiCtx.currentHabit && (
            <>
              <h1 className="mb-3">
                <span>{days[days.length - 1]?.monthName}</span>{" "}
                {selected ? (
                  <span>{selected?.day}, </span>
                ) : (
                  <>{hovered && <span>{hovered?.day}, </span>}</>
                )}
                <span>{days[days.length - 1]?.year}</span>
              </h1>
              <div className="">
                <div className="">
                  <div className="mb-3">
                    <Button
                      onClick={() => {
                        if (currentMonth == 1) {
                          setCurrentMonth(12);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                      className="border-0"
                      icon="arrow-left"
                    />
                    {days.length > 26 && (
                      <Button
                        onClick={() => {
                          if (currentMonth == 12) {
                            setCurrentMonth(1);
                            setCurrentYear(currentYear + 1);
                          } else {
                            setCurrentMonth(currentMonth + 1);
                          }
                        }}
                        className="border-0"
                        icon="arrow-right"
                      />
                    )}
                  </div>
                  <div className="month" onMouseLeave={() => setHovered(null)}>
                    {weekdays.map((x) => (
                      <div className="weekday">{x}</div>
                    ))}
                    {days.map((x) => (
                      <div
                        key={x.id}
                        onClick={() => {
                          if (x.entries.length > 0) {
                            deleteEntry(x.entries[0].id);
                          } else {
                            addEntry(
                              multiCtx.currentHabit.id,
                              new Date(
                                x.year,
                                x.monthInt - 1,
                                x.day
                              ).toDateString()
                            );
                          }
                        }}
                        onMouseEnter={() => setHovered(x)}
                        style={{
                          backgroundColor: x.entries?.[0]?.habitColor,
                          border: x.entries?.[0] ? "none" : "",
                        }}
                        className={
                          "day" +
                          (x.filler ? " filler" : "") +
                          (hovered === x && !x.filler ? " hovered" : "") +
                          (selected === x && !x.filler ? " selected-day" : "")
                        }></div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {selected?.entries.length > 0 && (
        <div className="mt-3">{JSON.stringify(selected)}</div>
      )}
    </div>
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
      multiCtx.getCalendar();
      setSaved(true);
      setTimeout(() => setSaved(false), 1000);
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
    <React.Fragment>
      <form
        onSubmit={(e) => editHabit(e)}
        className={
          "input-group input-group-sm mb-1 " +
          (multiCtx.hovered?.habitId === item.id ? "selected" : "")
        }>
        {item.entries[0]?.entryDateFormat2 !== new Date().toDateString() && (
          <Button
            type_="button"
            className="border-0"
            icon="check-lg"
            onClick={() => {
              multiCtx.addEntry(item.id, new Date().toDateString());
            }}
          />
        )}
        {saved && <Button className="border-0" icon="floppy2" />}
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
        {item.streaks && (
          <span className="input-group-text">
            <i className="bi bi-caret-up-fill text-success me-2"></i>
            <span>{item.streaks}</span>
          </span>
        )}
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
          icon="x-lg"
        />
      </form>
    </React.Fragment>
  );
}

function DayItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);

  const deleteEntry = (id) => {
    api("delete_entry", { id: id }, (data) => {
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

  const clearAll = () => {
    api(
      "clear_day",
      {
        date: new Date(item.year, item.month, item.day).toDateString(),
      },
      (data) => multiCtx.getCalendar()
    );
  };

  return (
    <div className="day-outer">
      <div className="day-inner position-relative">
        <Dropdown
          autoClose="outside"
          className="text-center mb-2"
          classNameBtn="label small"
          target="add-entry"
          text={item.date_}>
          {multiCtx.habits.map((x) => (
            <React.Fragment key={x.id}>
              {!excludeHabits().includes(x.id) && (
                <a
                  onClick={() =>
                    multiCtx.addEntry(
                      x.id,
                      new Date(item.year, item.month, item.day).toDateString()
                    )
                  }
                  className="dropdown-item label small">
                  <i
                    className="bi bi-square-fill me-2"
                    style={{ color: x.color }}></i>
                  <span>{x.name}</span>
                </a>
              )}
            </React.Fragment>
          ))}
          {item.entries.length > 0 && (
            <>
              <hr className="my-2 mx-3" />
              <div className="d-flex">
                <ButtonGroup size="sm" className="mx-auto">
                  <Button
                    onClick={() => setClearing(!clearing)}
                    className="border-0"
                    text="Clear All"
                  />
                  {clearing && (
                    <Button
                      icon="question-lg"
                      onClick={() => clearAll()}
                      className="border-0"
                    />
                  )}
                </ButtonGroup>
              </div>
            </>
          )}
        </Dropdown>
        <div>
          {item.entries.map((y) => (
            <i
              key={y.id}
              onClick={() => {
                multiCtx.setHovered(y);
              }}
              style={{ color: y.habitColor }}
              className={
                "cursor bi bi-check-square-fill p-1 " +
                (multiCtx.hovered === y ? "selected-entry" : "")
              }></i>
          ))}
        </div>
        <div className="position-absolute bottom-0">
          {multiCtx.hovered?.entryDate === item.entries[0]?.entryDate &&
            multiCtx.hovered && (
              <div className="mb-2">
                <div className="label small">{multiCtx.hovered?.habitName}</div>
                <div className="d-flex">
                  <ButtonGroup size="sm" className="mx-auto">
                    <Button
                      icon="arrow-left"
                      className="border-0"
                      onClick={() => multiCtx.setHovered(null)}
                    />
                    <Button
                      className="border-0"
                      icon="x-lg"
                      onClick={() => setDeleting(!deleting)}
                    />
                    {deleting && (
                      <Button
                        className="border-0"
                        icon="question-lg"
                        onClick={() => deleteEntry(multiCtx.hovered?.id)}
                      />
                    )}
                  </ButtonGroup>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " between"}>
      <ButtonGroup size="sm">
        {multiCtx.loading && (
          <button className="btn border-0">
            <Spinner />
          </button>
        )}
        <button
          onClick={() => {
            multiCtx.getHabits();
            multiCtx.getCalendar();
            multiCtx.setHovered(null);
          }}
          className="btn border-0">
          <i
            style={{ color: "#8f73ff", fontSize: "1.5rem" }}
            className="bi bi-infinity me-2"></i>
          loops
        </button>
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
    JSON.parse(localStorage.getItem("loops")) || defaultSettings
  );
  const [habits, setHabits] = React.useState([]);
  const [days, setDays] = React.useState([]);
  const [currentHabit, setCurrentHabit] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);

  const [limit, setLimit] = React.useState(30);

  const getHabit = (id) => {
    setLoading(true);
    api("get_habit", { id: id }, (data) => {
      setCurrentHabit(data.habit);
      setLoading(false);
    });
  };

  const getHabits = () => {
    setLoading(true);
    api("get_habits", {}, (data) => {
      setHabits(data.habits);
      setLoading(false);
    });
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
    setLoading(true);
    api("get_calendar", { limit: limit }, (data) => {
      setDays(data.days);
      setLoading(false);
    });
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
    localStorage.setItem("loops", JSON.stringify(settings));

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
