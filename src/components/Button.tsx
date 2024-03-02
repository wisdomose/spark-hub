import Spinner from "./Spinner";

type Props = {
    label: string;
    type?: "button" | "submit";
    block?: boolean;
    size?: "sm" | "md" | "lg";
    danger?: boolean;
    variant?: "filled" | "outline";
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void
}

export default function Button({ label, type = "button", block, size, danger = false, variant = "filled", onClick, loading = false, disabled = false }: Props) {
    const className = (function () {
        let className = "outline-none text-sm rounded font-medium hover:cursor-pointer relative"
        className += block ? " w-full" : " w-fit" // block
        className += size == "sm" ? " py-2 px-7" : " py-4 px-10" // size
        if (variant === "filled") {
            className += loading ? " text-transparent" : " text-white";
            className += danger ? " bg-red-500 hover:bg-red-600 focus:bg-red-600" : " bg-primary-dark hover:bg-primary-dark focus:bg-primary-dark" // size
        } else {
            className += " border-2";
            className += danger ? " text-red-500 border-red-500 hover:bg-red-500 focus:bg-red-500 hover:text-white focus:text-white" : " text-primary-dark border-primary-dark bg-transparent hover:bg-primary-dark focus:bg-primary-dark hover:text-white focus:text-white"
        }

        return className
    })();
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabled}>
            {loading && (
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square h-[50%]">
                    <div className="aspect-square h-full w-full rounded-full bg-transparent border-2 border-white border-b-primary-base animate-spin"></div>
                </div>
            )}
            {label}
        </button>
    )
}