import { createContext, useEffect, useState } from "react";
import api from "./util";

export const MultiContext = createContext();

const defaultSettings = {
  theme: "light",
};

export default function Context({ children }) {
  const [currentPage, setCurrentPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("loops")) || defaultSettings,
  );
  const [habits, setHabits] = useState([]);
  const [days, setDays] = useState([]);
  const [currentHabit, setCurrentHabit] = useState(null);

  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const [sortType, setSortType] = useState(null);
  const [reverse, setReverse] = useState(false);

  const [limit, setLimit] = useState(30);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("loops-user")),
  );

  const sortOptions = [
    {
      label: "Color",
      value: "color",
    },
    {
      label: "Date Added",
      value: "id",
    },
    {
      label: "Name",
      value: "name",
    },
  ];

  const getHabit = (id) => {
    setLoading(true);
    api("get_habit", { id: id }, (data) => {
      setCurrentHabit(data.habit);
      setLoading(false);
    });
  };

  const getHabits = () => {
    setLoading(true);
    api("get_habits", {}, (data) => {
      setHabits(data.habits);
      setLoading(false);
    });
  };

  const addHabit = (name) => {
    setLoading(true);
    api("add_habit", { name: name }, (data) => {
      setCurrentHabit(data.habit);
      setHabits(data.habits);
      setLoading(false);
    });
  };

  const getCalendar = () => {
    setLoading(true);
    api("get_calendar", { limit: limit, habitId: currentHabit?.id }, (data) => {
      setDays(data.days);
      setLoading(false);
    });
  };

  useEffect(() => {
    currentUser && getHabits();
  }, [currentUser]);

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    habits: habits,
    setHabits: setHabits,
    getHabits: getHabits,
    getHabit: getHabit,
    addHabit: addHabit,
    currentHabit: currentHabit,
    setCurrentHabit: setCurrentHabit,

    hovered: hovered,
    setHovered: setHovered,
    getCalendar: getCalendar,

    limit: limit,
    setLimit: setLimit,
    days: days,
    setDays: setDays,

    sortType: sortType,
    setSortType: setSortType,
    reverse: reverse,
    setReverse: setReverse,
    sortOptions: sortOptions,

    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    selected: selected,
    setSelected: setSelected,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
