export default function ButtonGroup({ className = "", children }) {
  return <div className={className + " btn-group"}>{children}</div>;
}
