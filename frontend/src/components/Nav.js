import { useContext, useEffect, useState } from "react";
import Dropdown from "./atoms/Dropdown";
import { MultiContext } from "../Context";
import api from "../util";
import Spinner from "./atoms/Spinner";
import Button from "./atoms/Button";

export default function Nav() {
  const multiCtx = useContext(MultiContext);

  const [theme, setTheme] = useState(
    localStorage.getItem("loops-theme") || "light",
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
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          icon={theme === "dark" ? "sun-fill" : "moon-fill"}
        />
      </div>
    </div>
  );
}
