import { useContext, useEffect } from "react";
import Nav from "./Nav";
import { MultiContext } from "../Context";
import LoginForm from "./forms/LoginForm";
import Dropdown from "./atoms/Dropdown";
import Button from "./atoms/Button";
import DayItem from "./items/DayItem";
import HabitItem from "./items/HabitItem";
import api from "../util";
import AddHabitForm from "./forms/AddHabitForm";
import EditHabitForm from "./forms/EditHabitForm";

export default function Display() {
  const multiCtx = useContext(MultiContext);

  useEffect(() => {
    multiCtx.currentUser && multiCtx.getCalendar();
    // eslint-disable-next-line
  }, [multiCtx.limit, multiCtx.currentUser, multiCtx.currentHabit]);

  useEffect(() => {
    multiCtx.setSelected(null);
    // eslint-disable-next-line
  }, [multiCtx.currentHabit]);

  const clearDay = () => {
    multiCtx.setLoading(true);
    api("clear_day", { date: multiCtx.selected?.fullStamp }, (data) => {
      multiCtx.setSelected(null);
      multiCtx.getCalendar();
      multiCtx.setLoading(false);
    });
  };

  return (
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
                        icon="x"
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
                          (multiCtx.currentHabit?.id === x.id ? " active" : "")
                        }>
                        <i
                          className="me-2 bi bi-record-fill"
                          style={{ color: x.color }}></i>
                        <span className="my-auto">{x.name}</span>
                      </div>
                    ))}
                  </Dropdown>
                </div>
                <div className="d-flex">
                  {multiCtx.selected && (
                    <Button
                      className="px-1 py-0 me-1"
                      icon="x"
                      onClick={() => multiCtx.setSelected(null)}
                    />
                  )}
                  <div className="my-auto small me-2 text-truncate">
                    {multiCtx.selected ? (
                      <span>{multiCtx.selected?.date_}</span>
                    ) : multiCtx.hovered ? (
                      <span>{multiCtx.hovered?.date_}</span>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </div>
                  <Button
                    active={multiCtx.limit === 7}
                    text="Week"
                    onClick={() => multiCtx.setLimit(7)}
                  />
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
                    maxHeight: "50vh",
                    overflowY: "auto",
                  }}>
                  {multiCtx.days.map((x) => (
                    <DayItem item={x} />
                  ))}
                </div>
              </div>

              {multiCtx.selected &&
              !multiCtx.currentHabit &&
              multiCtx.selected?.entries.length > 0 ? (
                <div className="between mt-3">
                  <Button
                    onClick={() => clearDay()}
                    text="Clear Day"
                    icon="eraser-fill"
                  />
                </div>
              ) : multiCtx.currentHabit ? (
                <EditHabitForm />
              ) : (
                <div className="mt-4">
                  <AddHabitForm />
                </div>
              )}
              {multiCtx.selected && !multiCtx.currentHabit && (
                <div
                  className="mt-3"
                  style={{ height: "15vh", overflowY: "auto" }}>
                  {multiCtx.selected?.entries.map((x) => (
                    <HabitItem item={x} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <LoginForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
