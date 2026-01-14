import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import AddHabitForm from "../forms/AddHabitForm";
import Sorter from "../Sorter";
import HabitItem from "../items/HabitItem";
import Button from "../atoms/Button";
import DayItem from "../items/DayItem";
import EditHabitForm from "../forms/EditHabitForm";
import ButtonGroup from "../atoms/ButtonGroup";
import LoginForm from "../forms/LoginForm";
import SignupForm from "../forms/SignupForm";

export const AnotherContext = createContext();

export default function HomePage({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [clearing, setClearing] = useState(false);

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

        setDays(days_[0].weekdayInt + 1 === 7 ? days_ : filled);
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

          setDays(days_[0].weekdayInt + 1 === 7 ? days_ : filled);
        }
      );
  };

  const clearDay = () => {
    api("clear_day", { date: selected?.fullStamp }, (data) => {
      getMonth();
      setClearing(false);
      setSelected(null);
    });
  };

  useEffect(() => {
    if (multiCtx.currentHabit) {
      setSelected(null);
      getMonthWithHabit();
    } else {
      getMonth();
    }
  }, [currentMonth, currentYear, multiCtx.currentHabit]);

  useEffect(() => {
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
        <div className={className + " d-flex"}>
          <div className="w-50 mx-auto row">
            <div className="col-6">
              <div
                className={
                  "habit-item" + (!multiCtx.currentHabit ? " active" : "")
                }>
                <a
                  className="label"
                  onClick={() => multiCtx.setCurrentHabit(null)}>
                  <i
                    className={
                      "bi me-2 bi-square" +
                      (multiCtx.currentHabit ? "" : "-fill")
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
            <div className="col-6 d-flex">
              <div className="m-auto">
                {multiCtx.currentHabit ? (
                  <>
                    <div className="text-center mb-3">
                      <span>{days[days.length - 1]?.monthName}</span>{" "}
                      {selected ? (
                        <span>{selected?.day}, </span>
                      ) : (
                        <>{hovered && <span>{hovered?.day}, </span>}</>
                      )}
                      <span>{days[days.length - 1]?.year}</span>
                    </div>
                    <div className="between mb-3">
                      <Button
                        size="lg"
                        onClick={() => {
                          if (currentMonth === 1) {
                            setCurrentMonth(12);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        icon="arrow-left"
                      />
                      {days.length > 26 && (
                        <Button
                          size="lg"
                          onClick={() => {
                            if (currentMonth === 12) {
                              setCurrentMonth(1);
                              setCurrentYear(currentYear + 1);
                            } else {
                              setCurrentMonth(currentMonth + 1);
                            }
                          }}
                          icon="arrow-right"
                        />
                      )}
                    </div>
                    <div
                      className="month"
                      onMouseLeave={() => setHovered(null)}>
                      {weekdays.map((x) => (
                        <div className="weekday">{x}</div>
                      ))}
                      {days.map((x) => (
                        <DayItem item={x} />
                      ))}
                    </div>
                    <div className="mt-4">
                      <hr />
                      <EditHabitForm />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3">
                      <span>{days[days.length - 1]?.monthName}</span>{" "}
                      {selected ? (
                        <span>{selected?.day}, </span>
                      ) : (
                        <>{hovered && <span>{hovered?.day}, </span>}</>
                      )}
                      <span>{days[days.length - 1]?.year}</span>
                    </div>
                    <div className="between mb-3">
                      <Button
                        size="lg"
                        onClick={() => {
                          if (currentMonth === 1) {
                            setCurrentMonth(12);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        icon="arrow-left"
                      />
                      {days.length > 26 && (
                        <Button
                          size="lg"
                          onClick={() => {
                            if (currentMonth === 12) {
                              setCurrentMonth(1);
                              setCurrentYear(currentYear + 1);
                            } else {
                              setCurrentMonth(currentMonth + 1);
                            }
                          }}
                          icon="arrow-right"
                        />
                      )}
                    </div>
                    <div
                      className="month"
                      onMouseLeave={() => setHovered(null)}>
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
                          {" entr" +
                            (selected.entries.length > 1 ? "ies" : "y")}
                        </div>
                        <div className="px-3">
                          {selected?.entries.map((x) => (
                            <div className="m-1">
                              <i
                                className="bi bi-square-fill me-2"
                                style={{ color: x.habitColor }}></i>
                              <span className="label small">{x.habitName}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <ButtonGroup>
                            <Button
                              onClick={() => setClearing(!clearing)}
                              text="Clear Day"
                              icon="x-lg"
                            />
                            {clearing && (
                              <Button
                                onClick={() => clearDay()}
                                // text="Clear Day"
                                icon="question-lg"
                              />
                            )}
                          </ButtonGroup>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex">
          <div className="m-auto">
            <LoginForm />
            <SignupForm />
          </div>
        </div>
      )}
    </AnotherContext.Provider>
  );
}
