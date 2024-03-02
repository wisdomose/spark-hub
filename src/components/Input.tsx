import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type Props = {
  label: string;
  subLabel?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  id: string;
  disabled?: boolean;
  required?: boolean;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  info?: string;
};

export default function Input({
  value,
  onChange,
  label,
  subLabel,
  placeholder,
  type = "text",
  id,
  disabled = false,
  required = false,
  min,
  info,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {subLabel && <p className="text-xs italic font-light">{subLabel}</p>}
      {info && <span className="text-xs inline-block">{info}</span>}
      <input
        min={min}
        value={value}
        onChange={onChange}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="mt-2 bg-white border border-primary-[#007D35] rounded-md px-3 py-3 text-sm placeholder:text-sm w-full outline-none focus:bg-[#F8F7F7]"
      />
    </div>
  );
}
