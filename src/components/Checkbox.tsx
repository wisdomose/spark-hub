type Props = {
  label: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  options: string[];
  checked: string[];
  onChange(value: string): void;
};

export default function Checkbox({
  label,
  name,
  disabled = false,
  required = false,
  options,
  checked,
  onChange,
}: Props) {
  return (
    <div className="">
      <p className="">{label}</p>

      <div className="flex flex-col gap-5">
        {options.map((option) => (
          <label
            key={option.replaceAll(" ", "-")}
            htmlFor={option.replaceAll(" ", "-")}
            className="capitalize flex items-center gap-2"
          >
            <input
              type="checkbox"
              name={name}
              id={option.replaceAll(" ", "-")}
              required={required}
              disabled={disabled}
              checked={checked.includes(option)}
              onChange={(e) => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
