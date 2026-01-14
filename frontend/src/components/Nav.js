import { useContext, useEffect, useState } from "react";
import Dropdown from "./atoms/Dropdown";
import { MultiContext } from "../Context";
import api from "../util";
import Spinner from "./atoms/Spinner";

export default function Nav() {
  const multiCtx = useContext(MultiContext);

  const [theme, setTheme] = useState(
    localStorage.getItem("loops-theme") || "light"
  );

  const logout = () => {
    multiCtx.setLoading(true);
    api("logout", {}, (data) => {
      multiCtx.setCurrentUser(null);
      multiCtx.setLoading(false);
    });
  };

  useEffect(() => {
    localStorage.setItem("loops-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (multiCtx.currentUser) {
      localStorage.setItem("loops-user", JSON.stringify(multiCtx.currentUser));
    } else {
      localStorage.removeItem("loops-user");
    }
  }, [multiCtx.currentUser]);

  const themes = ["light", "dark"];

  return (
    <div className="nav-custom">
      <div>{multiCtx.loading && <Spinner />}</div>
      <div>
        {multiCtx.currentUser && (
          <Dropdown
            icon="person-fill"
            text={multiCtx.currentUser?.username}
            classNameMenu="text-center">
            <div onClick={() => logout()} className="dropdown-item">
              Sign Out
            </div>
          </Dropdown>
        )}
        <Dropdown
          target="themes"
          icon="paint-bucket"
          // text={theme}
          classNameMenu="text-center">
          {themes.map((x) => (
            <div
              onClick={() => setTheme(x)}
              className={
                "text-capitalize dropdown-item" + (theme === x ? " active" : "")
              }>
              {x}
            </div>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
