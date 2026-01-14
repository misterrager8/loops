import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import Button from "../atoms/Button";

export default function HabitItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [deleting, setDeleting] = useState(false);

  const deleteEntry = () => {
    multiCtx.setLoading(true);
    api("delete_entry", { id: item.id, limit: multiCtx.limit }, (data) => {
      multiCtx.setDays(data.days);
      multiCtx.setLoading(false);
    });
  };

  return (
    <div className="between">
      <div className="d-flex">
        <i
          className="bi bi-record-fill me-1 my-auto"
          style={{ color: item.habitColor }}></i>
        <div className="my-auto">{item.habitName}</div>
      </div>
      <div>
        {deleting && (
          <Button onClick={() => deleteEntry()} icon="question-lg" />
        )}
        <Button onClick={() => setDeleting(!deleting)} icon="trash2" />
      </div>
    </div>
  );
}
