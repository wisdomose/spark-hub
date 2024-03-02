"use client"
import { Menu } from "@headlessui/react";
type Props = {
    label: string;
    placeholder: string;
    id: string;
    disabled?: boolean;
    percent?: string;
    required?: boolean;
    value: string;
    options: string[];
    onChange(value: string): void
};

export default function Select({ label, placeholder, id, disabled = false, required = false, percent, value, options, onChange }: Props) {
    return (
        <div>
            <label htmlFor={id} className='block mb-2 text-sm font-medium'>{label} {required && <span className="text-red-500">*</span>} {!!percent && <span className="ml-2 inline-block bg-[#00FF19] bg-opacity-5 text-[#037400] text-xs px-3 rounded-full">{percent}%</span>}</label>
            <Menu>
                {({ open }) => (
                    <>
                        <Menu.Button className='bg-white border border-primary-[#007D35] py-3 px-3 w-full text-left placeholder:text-sm text-sm outline-none rounded-md flex justify-between items-center'>
                            <span>
                                {value}
                            </span>
                            <svg width={16} height={17} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={`duration-200 ${open ? "-rotate-180" : ""}`}>
                                <path d="M3.20009 6.24009C3.26706 6.16786 3.34761 6.10952 3.43712 6.06842C3.52664 6.02732 3.62338 6.00425 3.72181 6.00053C3.82024 5.99682 3.91844 6.01253 4.0108 6.04677C4.10316 6.08101 4.18787 6.13311 4.26009 6.20009L8.00009 9.72709L11.7401 6.20009C11.8123 6.13312 11.897 6.08103 11.9894 6.04679C12.0817 6.01256 12.1799 5.99685 12.2784 6.00056C12.3768 6.00428 12.4735 6.02734 12.5631 6.06844C12.6526 6.10954 12.7331 6.16787 12.8001 6.24009C12.8671 6.31232 12.9192 6.39703 12.9534 6.48939C12.9876 6.58175 13.0033 6.67995 12.9996 6.77838C12.9959 6.87681 12.9728 6.97354 12.9317 7.06306C12.8906 7.15258 12.8323 7.23312 12.7601 7.30009L8.51009 11.3001C8.37141 11.4287 8.18924 11.5002 8.00009 11.5002C7.81095 11.5002 7.62878 11.4287 7.49009 11.3001L3.24009 7.30009C3.16786 7.23313 3.10952 7.15258 3.06842 7.06307C3.02732 6.97355 3.00425 6.87681 3.00053 6.77838C2.99682 6.67995 3.01253 6.58175 3.04677 6.48939C3.08101 6.39703 3.13311 6.31232 3.20009 6.24009Z" fill="#060A31" />
                            </svg>
                        </Menu.Button>
                        <Menu.Items className={`flex flex-col bg-white mt-1`}>
                            {options.map(option => (
                                <Menu.Item key={option}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => onChange(option)}
                                            className={`text-left px-4 py-1 text-sm ${active && 'bg-primary-dark/5'}`}
                                        >
                                            {option}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                            {/* <Menu.Item disabled>
                        <span className="opacity-75">Invite a friend (coming soon!)</span>
                    </Menu.Item> */}
                        </Menu.Items>
                    </>
                )}
            </Menu>
        </div>
    )
}