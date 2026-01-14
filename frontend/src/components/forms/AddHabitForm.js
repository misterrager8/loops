import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import Input from "../atoms/Input";

export default function AddHabitForm({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  const addHabit = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api("add_habit", { name: name }, (data) => {
      multiCtx.getHabits();
      setName("");
      multiCtx.setLoading(false);
    });
  };

  return (
    <form onSubmit={(e) => addHabit(e)} className={className + " input-group"}>
      <Input onChange={onChangeName} value={name} placeholder="New Habit" />
    </form>
  );
}
