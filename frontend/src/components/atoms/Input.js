export default function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={className + " form-control"}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}
