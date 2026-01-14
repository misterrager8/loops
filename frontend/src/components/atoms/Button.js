export default function Button({
  className,
  type_ = "button",
  onClick,
  icon,
  text,
  border = false,
  active = false,
}) {
  return (
    <button
      type={type_}
      className={
        className +
        " btn" +
        (border ? "" : " border-0") +
        (active ? " active" : "")
      }
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
      {text}
    </button>
  );
}
