const defaultSettings = {
  theme: "light",
};

const MultiContext = React.createContext();
const AnotherContext = React.createContext();

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
      className={className + " btn" + (size ? ` btn-${size}` : "")}
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
        {icon && <Icon name={icon} className="me-2" />}
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

function SignupForm({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);

  const signup = (e) => {
    e.preventDefault();
    api(
      "signup",
      {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
      },
      (data) => {
        multiCtx.setCurrentUser(data.user);
      }
    );
  };

  return (
    <form onSubmit={(e) => signup(e)} className={className}>
      <Input
        onChange={onChangeUsername}
        value={username}
        className="mb-1"
        placeholder="Username"
        size="sm"
      />
      <Input
        onChange={onChangePassword}
        value={password}
        className="mb-1"
        type_="password"
        placeholder="Password"
        size="sm"
      />
      <Input
        onChange={onChangePasswordConfirm}
        value={passwordConfirm}
        className="mb-1"
        type_="password"
        placeholder="Confirm Password"
        size="sm"
      />
      <Button size="sm" type_="submit" text="Sign Up" className="w-100" />
    </form>
  );
}

function LoginForm({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const login = (e) => {
    e.preventDefault();
    api(
      "login",
      {
        username: username,
        password: password,
      },
      (data) => {
        multiCtx.setCurrentUser(data.user);
      }
    );
  };

  return (
    <form onSubmit={(e) => login(e)} className={className}>
      <Input
        onChange={onChangeUsername}
        value={username}
        className="mb-1"
        placeholder="Username"
        size="sm"
      />
      <Input
        onChange={onChangePassword}
        value={password}
        className="mb-1"
        type_="password"
        placeholder="Password"
        size="sm"
      />
      <Button size="sm" type_="submit" text="Log In" className="w-100" />
    </form>
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

  const getMonthWithHabit = () => {
    api(
      "get_month_with_habit",
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

  const getMonth = () => {
    multiCtx.currentUser &&
      api(
        "get_month",
        {
          month: currentMonth,
          year: currentYear,
        },
        (data) => {
          let days_ = data.days;

          let filler = Array(days_[0].weekdayInt + 1).fill({ filler: true });
          let filled = filler.concat(days_);

          setDays(days_[0].weekdayInt + 1 == 7 ? days_ : filled);
        }
      );
  };

  React.useEffect(() => {
    if (multiCtx.currentHabit) {
      setSelected(null);
      getMonthWithHabit();
    } else {
      getMonth();
    }
  }, [currentMonth, currentYear, multiCtx.currentHabit]);

  React.useEffect(() => {
    multiCtx.setCurrentHabit(null);
    if (multiCtx.currentUser) {
      localStorage.setItem("loops-user", JSON.stringify(multiCtx.currentUser));
      getMonth();
    } else {
      localStorage.removeItem("loops-user");
    }
  }, [multiCtx.currentUser]);

  const contextValue = {
    selected: selected,
    setSelected: setSelected,
    hovered: hovered,
    setHovered: setHovered,
    getMonthWithHabit: getMonthWithHabit,
  };

  return (
    <AnotherContext.Provider value={contextValue}>
      {multiCtx.currentUser ? (
        <div className={className + " row"}>
          <div className="col-3">
            <div
              className={
                "p-1 m-1" + (!multiCtx.currentHabit ? " selected" : "")
              }>
              <a
                className="label"
                onClick={() => multiCtx.setCurrentHabit(null)}>
                <i
                  className={
                    "bi me-2 bi-square" + (multiCtx.currentHabit ? "" : "-fill")
                  }></i>
                <span className="small">All Habits</span>
              </a>
            </div>
            <AddHabitForm className="my-2 py-2" />
            <Sorter className="mb-2" />
            {multiCtx.habits.map((x) => (
              <HabitItem key={x.id} item={x} />
            ))}
          </div>
          <div className="col-9">
            {multiCtx.currentHabit ? (
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
                <div className="mb-3">
                  <Button
                    size="lg"
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
                      size="lg"
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
                    <DayItem item={x} />
                  ))}
                </div>
                <div className="w-25 mt-4">
                  <hr />
                  <EditHabitForm />
                </div>
              </>
            ) : (
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
                <div className="mb-3">
                  <Button
                    size="lg"
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
                      size="lg"
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
                    <DayItem item={x} />
                  ))}
                </div>
                {selected?.entries?.length > 0 && (
                  <div className="mt-4 d-flex">
                    <div className="label fw-bold mb-3">
                      {selected?.entries?.length}
                      {" entr" + (selected.entries.length > 1 ? "ies" : "y")}
                    </div>
                    <div className="ps-3">
                      {selected?.entries.map((x) => (
                        <div className="m-1">
                          <i
                            className="bi bi-square-fill me-2"
                            style={{ color: x.habitColor }}></i>
                          <span className="label small">{x.habitName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div>Log In or Sign Up</div>
      )}
    </AnotherContext.Provider>
  );
}

function AddHabitForm({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);

  const addHabit = (e) => {
    e.preventDefault();
    api("add_habit", { name: name }, (data) => {
      multiCtx.getHabits();
      setName("");
    });
  };

  return (
    <form
      onSubmit={(e) => addHabit(e)}
      className={className + " input-group input-group-sm"}>
      <Input onChange={onChangeName} value={name} placeholder="New Habit" />
    </form>
  );
}

function EditHabitForm({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);
  const anotherCtx = React.useContext(AnotherContext);

  const [saved, setSaved] = React.useState(false);
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);
  const onChangeColor = (e) => setColor(e.target.value);

  const editHabit = (e) => {
    e.preventDefault();
    api(
      "edit_habit",
      {
        id: multiCtx.currentHabit.id,
        name: name,
        color: color,
      },
      (data) => {
        anotherCtx.getMonthWithHabit();
        multiCtx.getHabits();
        setSaved(true);
        setTimeout(() => setSaved(false), 1000);
      }
    );
  };

  React.useEffect(() => {
    if (multiCtx.currentHabit) {
      setName(multiCtx.currentHabit?.name);
      setColor(multiCtx.currentHabit?.color);
    }
  }, [multiCtx.currentHabit]);

  return (
    <form
      onSubmit={(e) => editHabit(e)}
      className={className + " input-group input-group-lg"}>
      <Input type_="color" onChange={onChangeColor} value={color} />
      <Input
        className="label py-0 border-0"
        onChange={onChangeName}
        value={name}
      />
      <Button
        className="border-0"
        icon={saved ? "check-lg" : "pen"}
        type_="submit"
      />
    </form>
  );
}

function HabitItem({ item, className = "" }) {
  const multiCtx = React.useContext(MultiContext);

  const [deleting, setDeleting] = React.useState(false);

  const deleteHabit = () => {
    api("delete_habit", { id: item.id }, (data) => {
      multiCtx.getHabits();
      multiCtx.setCurrentHabit(null);
    });
  };

  return (
    <div
      className={
        className +
        " p-1 m-1 between " +
        (multiCtx.currentHabit?.id === item.id ? "selected" : "")
      }>
      <a
        className="label"
        onClick={() => multiCtx.setCurrentHabit(item)}
        key={item.id}>
        <i className="bi bi-square-fill me-2" style={{ color: item.color }}></i>
        <span className="small">{item.name}</span>
      </a>
      {multiCtx.currentHabit?.id == item.id && (
        <ButtonGroup size="sm">
          {deleting && (
            <Button
              className="border-0 text-danger"
              icon="question-lg"
              onClick={() => deleteHabit()}
            />
          )}
          <Button
            className="border-0 text-danger"
            icon="trash2"
            onClick={() => setDeleting(!deleting)}
          />
        </ButtonGroup>
      )}
    </div>
  );
}

function DayItem({ item, className = "" }) {
  const anotherCtx = React.useContext(AnotherContext);
  const multiCtx = React.useContext(MultiContext);

  const [deleting, setDeleting] = React.useState(false);

  const addEntry = (id, date) => {
    api(
      "add_entry",
      {
        id: id,
        date: date,
      },
      (data) => anotherCtx.getMonthWithHabit()
    );
  };

  const deleteEntry = (id) => {
    api("delete_entry", { id: id }, (data) => {
      anotherCtx.getMonthWithHabit();
      setDeleting(false);
    });
  };

  return (
    <>
      {multiCtx.currentHabit ? (
        <div
          key={item.id}
          onClick={() => {
            if (item.entries.length > 0) {
              setDeleting(!deleting);
            } else {
              addEntry(
                multiCtx.currentHabit.id,
                new Date(item.year, item.monthInt - 1, item.day).toDateString()
              );
            }
          }}
          onMouseEnter={() => anotherCtx.setHovered(item)}
          style={{
            backgroundColor: item.entries?.[0]?.habitColor,
            border: item.entries?.[0] ? "none" : "",
          }}
          className={
            "day" +
            (item.filler ? " filler" : "") +
            (anotherCtx.hovered === item && !item.filler ? " hovered" : "") +
            (anotherCtx.selected === item && !item.filler
              ? " selected-day"
              : "")
          }></div>
      ) : (
        <div
          key={item.id}
          onClick={() =>
            anotherCtx.setSelected(item === anotherCtx.selected ? null : item)
          }
          onMouseEnter={() => anotherCtx.setHovered(item)}
          className={
            "day" +
            (item.filler ? " filler" : "") +
            (anotherCtx.hovered === item && !item.filler ? " hovered" : "") +
            (anotherCtx.selected === item && !item.filler
              ? " selected-day"
              : "") +
            ` unempty-${item.entries?.length > 5 ? 5 : item.entries?.length} ` +
            className
          }></div>
      )}
      {deleting && (
        <div className="day d-flex border-danger">
          <a
            className="m-auto text-danger small"
            onClick={() => deleteEntry(item.entries[0].id)}>
            Delete
          </a>
        </div>
      )}
    </>
  );
}

function Sorter({ className = "" }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " between"}>
      <div className="btn-group">
        <Button
          className="border-0 pe-1"
          onClick={() => multiCtx.setReverse(!multiCtx.reverse)}
          icon={multiCtx.reverse ? "sort-down" : "sort-down-alt"}
        />
        <Dropdown
          classNameMenu="text-center"
          target="sort"
          text={multiCtx.sortType?.label}
          classNameBtn="btn btn-sm border-0">
          {multiCtx.sortOptions.map((x) => (
            <>
              {x.label !== multiCtx.sortType?.label && (
                <a
                  onClick={() => multiCtx.setSortType(x)}
                  className="dropdown-item small">
                  {x.label}
                </a>
              )}
            </>
          ))}
        </Dropdown>
      </div>
      <span className="btn btn-sm border-0 non-btn">
        {multiCtx.habits.length}
        {" Habit" + (multiCtx.habits.length === 1 ? "" : "s")}
      </span>
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

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  const logout = () => {
    api("logout", {}, (data) => {
      multiCtx.setCurrentUser(null);
    });
  };

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
      <div className="btn-group btn-group-sm">
        <Dropdown
          className="btn-group"
          classNameBtn="btn"
          icon="person-fill"
          text={multiCtx.currentUser?.username || "Log In / Sign Up"}>
          {multiCtx.currentUser ? (
            <a className="dropdown-item" onClick={() => logout()}>
              Log Out
            </a>
          ) : (
            <>
              <LoginForm />
              <SignupForm />
            </>
          )}
        </Dropdown>
        <ButtonGroup size="sm">
          <Button
            text={multiCtx.settings.theme}
            icon={
              multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"
            }
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

  const [sortType, setSortType] = React.useState(null);
  const [reverse, setReverse] = React.useState(false);

  const [limit, setLimit] = React.useState(30);
  const [currentUser, setCurrentUser] = React.useState(
    JSON.parse(localStorage.getItem("loops-user"))
  );

  const sortOptions = [
    {
      label: "Color",
      value: "color",
    },
    {
      label: "Date Added",
      value: "id",
    },
    {
      label: "Name",
      value: "name",
    },
  ];

  const getHabit = (id) => {
    setLoading(true);
    api("get_habit", { id: id }, (data) => {
      setCurrentHabit(data.habit);
      setLoading(false);
    });
  };

  const getHabits = () => {
    setLoading(true);
    api(
      "get_habits",
      { sortType: sortType?.value, reverse: reverse },
      (data) => {
        setHabits(data.habits);
        setLoading(false);
      }
    );
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

  React.useEffect(() => {
    if (sortType && currentUser) {
      getHabits();
    }
  }, [sortType, reverse, currentUser]);

  React.useEffect(() => {
    setSortType(sortOptions[0]);
  }, []);

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

    sortType: sortType,
    setSortType: setSortType,
    reverse: reverse,
    setReverse: setReverse,
    sortOptions: sortOptions,

    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
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
