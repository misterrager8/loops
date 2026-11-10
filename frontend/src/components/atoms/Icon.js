export default function Icon({ className, name, style }) {
  return <i style={style} className={className + " bi bi-" + name}></i>;
}
