import { createContext, useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import { MultiContext } from "../Context";
import LoginForm from "./forms/LoginForm";
import Dropdown from "./atoms/Dropdown";
import Button from "./atoms/Button";
import DayItem from "./items/DayItem";
import api from "../util";
import AddHabitForm from "./forms/AddHabitForm";
import EditHabitForm from "./forms/EditHabitForm";
import Icon from "./atoms/Icon";
import SignupForm from "./forms/SignupForm";

export const SelectedContext = createContext();

export default function Display() {
  const multiCtx = useContext(MultiContext);
  const [selectedDays, setSelectedDays] = useState([]);

  const [addingThese, setAddingThese] = useState([]);
  const [deletingThese, setDeletingThese] = useState([]);

  useEffect(() => {
    multiCtx.currentUser && multiCtx.getCalendar();
    // eslint-disable-next-line
  }, [multiCtx.limit, multiCtx.currentUser, multiCtx.currentHabit]);

  useEffect(() => {
    multiCtx.setSelected(null);
    // eslint-disable-next-line
  }, [multiCtx.currentHabit]);

  useEffect(() => {
    setAddingThese([]);
    setDeletingThese([]);
  }, [multiCtx.selected]);

  const clearSelection = () => {
    setAddingThese([]);
    setDeletingThese([]);
  };

  const addEntriesByDate = () => {
    multiCtx.setLoading(true);
    api(
      "add_entry",
      {
        id: multiCtx.currentHabit?.id,
        date: JSON.stringify(selectedDays),
        limit: multiCtx.limit,
      },
      (data) => {
        multiCtx.setDays(data.days);
        setSelectedDays([]);
        multiCtx.setLoading(false);
      },
    );
  };

  const addEntriesByHabit = () => {
    multiCtx.setLoading(true);
    api(
      "add_entries_by_habit",
      {
        id: JSON.stringify(addingThese),
        date: new Date(
          multiCtx.selected?.year,
          multiCtx.selected?.monthInt,
          multiCtx.selected?.day,
        ).toDateString(),
        limit: multiCtx.limit,
      },
      (data) => {
        multiCtx.setSelected(null);
        multiCtx.setDays(data.days);
        multiCtx.setLoading(false);
      },
    );
  };

  const deleteEntriesByHabit = () => {
    multiCtx.setLoading(true);
    api(
      "delete_entries_by_habit",
      {
        id: JSON.stringify(deletingThese),
        limit: multiCtx.limit,
      },
      (data) => {
        multiCtx.setSelected(null);
        multiCtx.setDays(data.days);
        multiCtx.setLoading(false);
      },
    );
  };

  const addToAdding = (id) => {
    let addingThese_ = [...addingThese];
    if (addingThese_.includes(id)) {
      addingThese_ = addingThese_.filter((x) => x !== id);
    } else {
      addingThese_.push(id);
    }

    setAddingThese(addingThese_);
  };

  const addToDeleting = (id) => {
    let deletingThese_ = [...deletingThese];
    if (deletingThese_.includes(id)) {
      deletingThese_ = deletingThese_.filter((x) => x !== id);
    } else {
      deletingThese_.push(id);
    }

    setDeletingThese(deletingThese_);
  };

  const isEntryFound = (habitId) => {
    return multiCtx.selected?.entries.map((x) => x.habitId).includes(habitId);
  };

  const contextValue = {
    selectedDays: selectedDays,
    setSelectedDays: setSelectedDays,
  };

  return (
    <SelectedContext.Provider value={contextValue}>
      <div className="body">
        <div className="inner">
          <Nav />
          <div className="mt-4">
            {multiCtx.currentUser ? (
              <>
                <div className="between">
                  <div className="d-flex text-truncate">
                    {multiCtx.currentHabit && (
                      <>
                        <Button
                          className="px-1 red"
                          icon="x-lg"
                          onClick={() => multiCtx.setCurrentHabit(null)}
                        />
                        <i
                          style={{ color: multiCtx.currentHabit?.color }}
                          className="my-auto mx-1 bi bi-record-fill"></i>
                      </>
                    )}
                    <Dropdown
                      classNameBtn="text-truncate"
                      text={multiCtx.currentHabit?.name || "Select"}>
                      {multiCtx.habits.map((x) => (
                        <div
                          onClick={() => multiCtx.setCurrentHabit(x)}
                          className={
                            "d-flex dropdown-item px-2" +
                            (multiCtx.currentHabit?.id === x.id
                              ? " active"
                              : "")
                          }>
                          <i
                            className="me-2 bi bi-record-fill"
                            style={{ color: x.color }}></i>
                          <span className="my-auto">{x.name}</span>
                        </div>
                      ))}
                    </Dropdown>
                  </div>

                  {multiCtx.currentHabit?.streaks > 1 && (
                    <div className="my-auto">
                      Highest Streak: {multiCtx.currentHabit?.streaks}
                    </div>
                  )}
                </div>
                <div className="between mt-3">
                  <div className="d-flex my-auto">
                    {selectedDays.length > 0 && (
                      <>
                        <Button
                          className="px-1 py-0 me-1"
                          icon="x-lg"
                          onClick={() => setSelectedDays([])}
                        />
                      </>
                    )}
                    <div className="my-auto me-2 text-truncate">
                      {multiCtx.selected ? (
                        <span>{multiCtx.selected?.date_}</span>
                      ) : multiCtx.hovered ? (
                        <span>{multiCtx.hovered?.date_}</span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      active={multiCtx.limit === 30}
                      text="Month"
                      onClick={() => multiCtx.setLimit(30)}
                    />
                    <Button
                      active={multiCtx.limit === 365}
                      text="Year"
                      onClick={() => multiCtx.setLimit(365)}
                    />
                  </div>
                </div>
                <div className="d-flex mt-4">
                  <div
                    className="d-flex mx-auto"
                    style={{
                      flexWrap: "wrap",
                      maxHeight: "30vh",
                      overflowY: "auto",
                    }}>
                    {multiCtx.days.map((x) => (
                      <DayItem item={x} />
                    ))}
                  </div>
                </div>

                {multiCtx.selected && !multiCtx.currentHabit ? (
                  <div
                    className={
                      "between mt-3" +
                      (addingThese.length > 0 || deletingThese.length > 0
                        ? ""
                        : " invisible")
                    }>
                    <Button
                      onClick={() => clearSelection()}
                      text="Clear Selection"
                      icon="eraser-fill"
                    />
                    <div>
                      {addingThese.length > 0 && (
                        <Button
                          className="green"
                          onClick={() => addEntriesByHabit()}
                          icon="plus-lg"
                          text={`Add ${addingThese.length}`}
                        />
                      )}

                      {deletingThese.length > 0 && (
                        <Button
                          className="red"
                          onClick={() => deleteEntriesByHabit()}
                          icon="x-lg"
                          text={`Delete ${deletingThese.length}`}
                        />
                      )}
                    </div>
                  </div>
                ) : multiCtx.currentHabit ? (
                  <EditHabitForm />
                ) : (
                  <div className="mt-4">
                    <AddHabitForm />
                  </div>
                )}
                {multiCtx.selected && !multiCtx.currentHabit && (
                  <>
                    <div
                      className="mt-2 p-2"
                      style={{
                        height: "38vh",
                        overflowY: "auto",
                        borderTop: ".5px dotted",
                        borderBottom: ".5px dotted",
                      }}>
                      {multiCtx.habits
                        .filter((x) => !isEntryFound(x.id))
                        .map((x) => (
                          <div
                            style={{ cursor: "pointer" }}
                            className="d-flex mb-2"
                            onClick={() => addToAdding(x.id)}>
                            <Icon
                              name={
                                (addingThese.includes(x.id) ? "check-" : "") +
                                "square"
                              }
                            />
                            <div
                              className="my-auto mx-1"
                              style={{ color: x.color }}>
                              <Icon name="record-fill" />
                            </div>
                            <div className="my-auto text-truncate">
                              {x.name}
                            </div>
                          </div>
                        ))}
                      {multiCtx.habits
                        .filter((x) => isEntryFound(x.id))
                        .map((x) => (
                          <div
                            style={{ cursor: "pointer" }}
                            className="d-flex mb-2"
                            onClick={() =>
                              addToDeleting(
                                multiCtx.selected?.entries.find(
                                  (y) => y.habitId === x.id,
                                )?.id,
                              )
                            }>
                            <Icon
                              name={
                                (deletingThese.includes(
                                  multiCtx.selected?.entries.find(
                                    (y) => y.habitId === x.id,
                                  )?.id,
                                )
                                  ? ""
                                  : "check-") + "square"
                              }
                            />
                            <div
                              className="my-auto mx-1"
                              style={{ color: x.color }}>
                              <Icon name="record-fill" />
                            </div>
                            <div className="my-auto text-truncate">
                              {x.name}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
                {selectedDays.length > 0 && (
                  <div>
                    <div className="my-4">
                      {selectedDays.map((x) => (
                        <div>{x}</div>
                      ))}
                    </div>
                    <Button
                      text="Add Entries"
                      className=""
                      icon="plus-lg"
                      onClick={() => addEntriesByDate()}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <LoginForm />
                <SignupForm />
              </>
            )}
          </div>
        </div>
      </div>
    </SelectedContext.Provider>
  );
}
