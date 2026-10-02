import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import { SelectedContext } from "../Display";

export default function DayItem({ item }) {
  const multiCtx = useContext(MultiContext);
  const { selectedDays, setSelectedDays } = useContext(SelectedContext);

  const toggleSelected = () => {
    let selectedDays_ = [...selectedDays];
    if (selectedDays_.includes(item.fullStamp)) {
      selectedDays_ = selectedDays_.filter((x) => x !== item.fullStamp);
    } else {
      selectedDays_.push(item.fullStamp);
    }

    setSelectedDays(selectedDays_);
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
            multiCtx.selected?.date_ === item.date_ ? null : item,
          );
        } else {
          toggleSelected();
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
          ? "feather2"
          : item.entries.length > 0
            ? multiCtx.currentHabit
              ? "diamond-fill"
              : "diamond-fill"
            : multiCtx.hovered?.date_ === item.date_ ||
                multiCtx.selected?.date_ === item.date_ ||
                selectedDays.includes(item.fullStamp)
              ? "x"
              : "dot") +
        (multiCtx.selected?.date_ === item.date_ ? " opacity-25" : "") +
        (item.entries.length < 11
          ? ` filled-${Math.round(item.entries.length / 2)}`
          : " circle-fill")
      }></i>
  );
}
