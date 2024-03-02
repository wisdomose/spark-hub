import Spinner from "./Spinner";

export default function Loader() {
  return (
    <div className="bg-black backdrop-blur-sm fixed inset-0 z-[99] grid place-items-center">
      <Spinner />
    </div>
  );
}
