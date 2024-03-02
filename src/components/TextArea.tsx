import { ChangeEvent } from "react";

type Props = {
    label: string;
    placeholder?: string;
    id: string;
    disabled?: boolean;
    percent?: string;
    required?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
};

export default function TextArea({ value, onChange, label, placeholder, id, disabled = false, required = false, percent }: Props) {
    return (
        <div>
            <label htmlFor={id} className='block mb-2 text-sm font-medium'>{label} {!!percent && <span className="ml-2 inline-block bg-[#00FF19] bg-opacity-5 text-[#037400] text-xs px-3 rounded-full">{percent}%</span>}</label>
            <textarea value={value} onChange={onChange} name={id} id={id} placeholder={placeholder} disabled={disabled} required={required} className='bg-white border border-primary-[#007D35] rounded-md px-3 py-3 text-sm placeholder:text-sm min-h-[250px] w-full outline-none focus:bg-[#F8F7F7]' />
        </div>
    )
}