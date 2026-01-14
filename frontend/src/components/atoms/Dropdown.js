import Icon from "./Icon";

export default function Dropdown({
  classNameBtn = "",
  classNameMenu = "",
  target,
  icon,
  children,
  text,
  autoClose = true,
  border = false,
  showCaret = true,
}) {
  return (
    <>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        data-bs-auto-close={autoClose}
        className={
          classNameBtn +
          " btn" +
          (border ? "" : " border-0") +
          (showCaret ? " dropdown-toggle" : "")
        }>
        {icon && <Icon name={icon} className={text ? "me-2" : ""} />}
        {text && <span>{text}</span>}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </>
  );
}
