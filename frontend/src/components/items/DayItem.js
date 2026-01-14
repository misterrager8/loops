import { useContext } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";

export default function DayItem({ item }) {
  const multiCtx = useContext(MultiContext);

  const addEntry = (id, date) => {
    multiCtx.setLoading(true);
    api(
      "add_entry",
      {
        id: id,
        date: date,
        limit: multiCtx.limit,
      },
      (data) => {
        multiCtx.getCalendar();
        multiCtx.setLoading(false);
      }
    );
  };

  const isToday = (day) => {
    let today = new Date();
    return (
      day.day === today.getDate() &&
      day.monthInt === today.getMonth() &&
      day.year === today.getFullYear()
    );
  };

  return (
    <i
      onClick={() => {
        if (!multiCtx.currentHabit) {
          multiCtx.setSelected(
            multiCtx.selected?.date_ === item.date_ ? null : item
          );
        } else {
          addEntry(
            multiCtx.currentHabit?.id,
            new Date(item.year, item.monthInt, item.day).toDateString()
          );
        }
      }}
      style={{
        cursor: "pointer",
        color: item.entries.length > 0 ? multiCtx.currentHabit?.color : null,
      }}
      onMouseLeave={() => multiCtx.setHovered(null)}
      onMouseEnter={() => multiCtx.setHovered(item)}
      className={
        "day-item bi bi-" +
        (isToday(item)
          ? "brightness-low-fill"
          : item.entries.length > 0
          ? `record2`
          : multiCtx.hovered?.date_ === item.date_ ||
            multiCtx.selected?.date_ === item.date_
          ? "x"
          : "dot")
      }></i>
  );
}
