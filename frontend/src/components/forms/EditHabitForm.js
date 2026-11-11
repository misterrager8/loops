import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import moment from "moment-timezone";

export default function EditHabitForm({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deleting, setDeleting] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeColor = (e) => setColor(e.target.value);
  const onChangeStartDate = (e) => setStartDate(e.target.value);

  const editHabit = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "edit_habit",
      {
        id: multiCtx.currentHabit.id,
        name: name,
        color: color,
        limit: multiCtx.limit,
        startDate: startDate,
      },
      (data) => {
        multiCtx.setCurrentHabit(data.habit);
        multiCtx.setHabits(data.habits);
        multiCtx.setDays(data.days);
        multiCtx.setLoading(false);
      },
    );
  };

  const deleteHabit = () => {
    api(
      "delete_habit",
      {
        id: multiCtx.currentHabit?.id,
        limit: multiCtx.limit,
      },
      (data) => {
        multiCtx.setHabits(data.habits);
        multiCtx.setDays(data.days);
        multiCtx.setCurrentHabit(null);
        setDeleting(false);
      },
    );
  };

  useEffect(() => {
    if (multiCtx.currentHabit) {
      setName(multiCtx.currentHabit?.name);
      setColor(multiCtx.currentHabit?.color);
      setStartDate(
        moment
          .tz(multiCtx.currentHabit?.start_date, "America/New_York")
          .format("YYYY-MM-DD"),
      );
    }
  }, [multiCtx.currentHabit]);

  return (
    <>
      <form onSubmit={(e) => editHabit(e)} className="d-flex mt-4 gap-1">
        <div className="d-flex">
          <input
            type="color"
            className="input-color"
            onChange={onChangeColor}
            value={color}
          />
        </div>
        <Input onChange={onChangeName} value={name} />
        <input
          className="form-control"
          type="date"
          value={startDate}
          onChange={onChangeStartDate}
        />
        {deleting && (
          <Button
            className="red"
            icon="question-lg"
            onClick={() => deleteHabit()}
          />
        )}
        <Button
          className="red"
          icon="trash2"
          onClick={() => setDeleting(!deleting)}
        />
        <button type="submit" className="d-none"></button>
      </form>
      <div className="mt-3">
        Added: {moment(multiCtx.currentHabit?.start_date).format("L")}
      </div>
    </>
  );
}
