import { useContext } from "react";
import { MultiContext } from "../Context";
import Button from "./atoms/Button";
import Dropdown from "./atoms/Dropdown";

export default function Sorter({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div className={className + " between"}>
      <div className="btn-group">
        <Button
          className="pe-1"
          onClick={() => multiCtx.setReverse(!multiCtx.reverse)}
          icon={multiCtx.reverse ? "sort-down" : "sort-down-alt"}
        />
        <Dropdown
          classNameMenu="text-center"
          target="sort"
          text={multiCtx.sortType?.label}>
          {multiCtx.sortOptions.map((x) => (
            <>
              {x.label !== multiCtx.sortType?.label && (
                <a
                  onClick={() => multiCtx.setSortType(x)}
                  className="dropdown-item small">
                  {x.label}
                </a>
              )}
            </>
          ))}
        </Dropdown>
      </div>
      <span className="btn non-btn">
        {multiCtx.habits.length}
        {" Habit" + (multiCtx.habits.length === 1 ? "" : "s")}
      </span>
    </div>
  );
}
