import Spinner from "./Spinner";

export default function Loader({ label }: { label?: string }) {
  return (
    <div className="bg-black backdrop-blur-sm fixed inset-0 z-[99] flex items-center justify-center flex-col gap-5">
      <Spinner />
      {label && <p className="text-white">{label}</p>}
    </div>
  );
}
