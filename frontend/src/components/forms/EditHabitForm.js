import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import { AnotherContext } from "../pages/HomePage";
import api from "../../util";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

export default function EditHabitForm({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [deleting, setDeleting] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeColor = (e) => setColor(e.target.value);

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
      },
      (data) => {
        multiCtx.setCurrentHabit(data.habit);
        multiCtx.setHabits(data.habits);
        multiCtx.setDays(data.days);
        multiCtx.setLoading(false);
      }
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
      }
    );
  };

  useEffect(() => {
    if (multiCtx.currentHabit) {
      setName(multiCtx.currentHabit?.name);
      setColor(multiCtx.currentHabit?.color);
    }
  }, [multiCtx.currentHabit]);

  return (
    <form onSubmit={(e) => editHabit(e)} className="d-flex mt-4">
      <input
        type="color"
        className="input-color"
        onChange={onChangeColor}
        value={color}
      />
      <Input onChange={onChangeName} value={name} />
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
  );
}
