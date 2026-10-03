import { useContext } from "react";
import { MultiContext } from "../../Context";
import { SelectedContext } from "../Display";
import { Icon } from "@iconify/react";

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
    <div
      className={
        "day-item" +
        (multiCtx.selected?.date_ === item.date_ ? " text-success" : "") +
        (item.entries.length < 11
          ? ` filled-${Math.round(item.entries.length / 2)}`
          : "")
      }>
      <Icon
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
          borderBottom: item.entries.length > 0 ? ".5px solid" : null,
        }}
        onMouseLeave={() => multiCtx.setHovered(null)}
        onMouseEnter={() => multiCtx.setHovered(item)}
        icon={
          "" +
          (isToday(item)
            ? "tabler:arrow-badge-down-filled"
            : item.entries.length > 0
              ? multiCtx.currentHabit
                ? "bi:check-lg"
                : `tabler:number-${item.entries.length}-small`
              : multiCtx.hovered?.date_ === item.date_ ||
                  multiCtx.selected?.date_ === item.date_ ||
                  selectedDays.includes(item.fullStamp)
                ? "bi:x"
                : "bi:dot")
        }
      />
    </div>
  );
}
