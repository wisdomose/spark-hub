"use client";
import useBursar from "@/store/bursar/useBursar";
import { ROLES } from "@/types/types";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { MdOutlineBedroomParent } from "react-icons/md";
import { BiMailSend } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";

export default function BursarDashboard({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const { loading, loggedIn, user, logout } = useBursar();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleOpen = () => setOpen((s) => !s);

  useEffect(() => {
    if (loading) return;
    if ((!loading && !loggedIn) || user?.role !== ROLES.BURSAR) {
      logout();
      router.replace("/");
    }
  }, [loading, loggedIn]);

  if (loading) return <Loader />;

  return (
    <main className="h-screen max-h-screen overflow-hidden grid max-md:grid-rows-[max-content_1fr] md:grid-cols-[max-content_1fr] relative">
      {/* mobile navigation */}
      <nav className="md:hidden z-20 px-5 py-5 flex max-md:justify-between md:flex-col bg-white">
        <button onClick={toggleOpen}>
          <svg
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.75 7.5C20.75 7.69891 20.671 7.88968 20.5303 8.03033C20.3897 8.17098 20.1989 8.25 20 8.25H4C3.80109 8.25 3.61032 8.17098 3.46967 8.03033C3.32902 7.88968 3.25 7.69891 3.25 7.5C3.25 7.30109 3.32902 7.11032 3.46967 6.96967C3.61032 6.82902 3.80109 6.75 4 6.75H20C20.1989 6.75 20.3897 6.82902 20.5303 6.96967C20.671 7.11032 20.75 7.30109 20.75 7.5ZM20.75 12.5C20.75 12.6989 20.671 12.8897 20.5303 13.0303C20.3897 13.171 20.1989 13.25 20 13.25H4C3.80109 13.25 3.61032 13.171 3.46967 13.0303C3.32902 12.8897 3.25 12.6989 3.25 12.5C3.25 12.3011 3.32902 12.1103 3.46967 11.9697C3.61032 11.829 3.80109 11.75 4 11.75H20C20.1989 11.75 20.3897 11.829 20.5303 11.9697C20.671 12.1103 20.75 12.3011 20.75 12.5ZM20.75 17.5C20.75 17.6989 20.671 17.8897 20.5303 18.0303C20.3897 18.171 20.1989 18.25 20 18.25H4C3.80109 18.25 3.61032 18.171 3.46967 18.0303C3.32902 17.8897 3.25 17.6989 3.25 17.5C3.25 17.3011 3.32902 17.1103 3.46967 16.9697C3.61032 16.829 3.80109 16.75 4 16.75H20C20.1989 16.75 20.3897 16.829 20.5303 16.9697C20.671 17.1103 20.75 17.3011 20.75 17.5Z"
              fill="#060A31"
            />
          </svg>
        </button>

        {/* <div className="lg:py-5">
          <Image src="/img/Logo.svg" alt="logo" width={80} height={200} />
        </div> */}

        <button>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.75 7.5C7.75 6.94188 7.85993 6.38923 8.07351 5.8736C8.28709 5.35796 8.60015 4.88945 8.9948 4.4948C9.38944 4.10015 9.85796 3.78709 10.3736 3.57351C10.8892 3.35993 11.4419 3.25 12 3.25C12.5581 3.25 13.1108 3.35993 13.6264 3.57351C14.142 3.78709 14.6106 4.10015 15.0052 4.4948C15.3999 4.88945 15.7129 5.35796 15.9265 5.8736C16.1401 6.38923 16.25 6.94188 16.25 7.5C16.25 8.62717 15.8022 9.70817 15.0052 10.5052C14.2082 11.3022 13.1272 11.75 12 11.75C10.8728 11.75 9.79183 11.3022 8.9948 10.5052C8.19777 9.70817 7.75 8.62717 7.75 7.5ZM12 4.75C11.2707 4.75 10.5712 5.03973 10.0555 5.55546C9.53973 6.07118 9.25 6.77065 9.25 7.5C9.25 8.22935 9.53973 8.92882 10.0555 9.44454C10.5712 9.96027 11.2707 10.25 12 10.25C12.7293 10.25 13.4288 9.96027 13.9445 9.44454C14.4603 8.92882 14.75 8.22935 14.75 7.5C14.75 6.77065 14.4603 6.07118 13.9445 5.55546C13.4288 5.03973 12.7293 4.75 12 4.75ZM8 14.75C7.40326 14.75 6.83097 14.9871 6.40901 15.409C5.98705 15.831 5.75 16.4033 5.75 17V18.188C5.75 18.206 5.763 18.222 5.781 18.225C9.9 18.897 14.101 18.897 18.219 18.225C18.2277 18.2236 18.2357 18.219 18.2414 18.2123C18.2471 18.2055 18.2501 18.1969 18.25 18.188V17C18.25 16.4033 18.0129 15.831 17.591 15.409C17.169 14.9871 16.5967 14.75 16 14.75H15.66C15.6332 14.7498 15.6065 14.7538 15.581 14.762L14.716 15.045C12.9512 15.6212 11.0488 15.6212 9.284 15.045L8.418 14.762C8.39311 14.754 8.36713 14.75 8.341 14.75H8ZM4.25 17C4.25 16.0054 4.64509 15.0516 5.34835 14.3483C6.05161 13.6451 7.00544 13.25 8 13.25H8.34C8.525 13.25 8.709 13.28 8.884 13.336L9.75 13.619C11.212 14.0962 12.788 14.0962 14.25 13.619L15.116 13.336C15.291 13.279 15.475 13.25 15.659 13.25H16C16.9946 13.25 17.9484 13.6451 18.6517 14.3483C19.3549 15.0516 19.75 16.0054 19.75 17V18.188C19.75 18.942 19.204 19.584 18.46 19.705C14.1817 20.4034 9.81835 20.4034 5.54 19.705C5.17992 19.6464 4.85244 19.4616 4.61611 19.1837C4.37978 18.9057 4.25001 18.5528 4.25 18.188V17Z"
              fill="black"
            />
          </svg>
        </button>
      </nav>

      {/* mobile navigation content */}
      <div
        className={`z-20 relative h-full flex md:hidden flex-col bg-white max-md:absolute max-md:left-0 max-md:transition-transform max-md:duration-200 max-md:top-[68.3px] max-md:w-[80vw] ${
          open ? "max-md:-translate-x-0" : "max-md:-translate-x-full"
        }`}
      >
        <Nav activePage={active} open={open} />
      </div>

      {/* overlay */}
      <div
        onClick={toggleOpen}
        className={`bg-[#F4F6FF]/70 backdrop-blur-sm absolute inset-0 md:hidden z-10 ${
          open ? "max-md:block" : "max-md:hidden"
        }`}
      ></div>

      {/* tablet and laptop */}
      <nav className="hidden py-5 md:flex max-md:justify-between md:flex-col items-start lg:items-center relative">
        <div className="lg:py-5 px-5 flex gap-6 items-center">
          <button onClick={toggleOpen} className="lg:hidden">
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.75 7.5C20.75 7.69891 20.671 7.88968 20.5303 8.03033C20.3897 8.17098 20.1989 8.25 20 8.25H4C3.80109 8.25 3.61032 8.17098 3.46967 8.03033C3.32902 7.88968 3.25 7.69891 3.25 7.5C3.25 7.30109 3.32902 7.11032 3.46967 6.96967C3.61032 6.82902 3.80109 6.75 4 6.75H20C20.1989 6.75 20.3897 6.82902 20.5303 6.96967C20.671 7.11032 20.75 7.30109 20.75 7.5ZM20.75 12.5C20.75 12.6989 20.671 12.8897 20.5303 13.0303C20.3897 13.171 20.1989 13.25 20 13.25H4C3.80109 13.25 3.61032 13.171 3.46967 13.0303C3.32902 12.8897 3.25 12.6989 3.25 12.5C3.25 12.3011 3.32902 12.1103 3.46967 11.9697C3.61032 11.829 3.80109 11.75 4 11.75H20C20.1989 11.75 20.3897 11.829 20.5303 11.9697C20.671 12.1103 20.75 12.3011 20.75 12.5ZM20.75 17.5C20.75 17.6989 20.671 17.8897 20.5303 18.0303C20.3897 18.171 20.1989 18.25 20 18.25H4C3.80109 18.25 3.61032 18.171 3.46967 18.0303C3.32902 17.8897 3.25 17.6989 3.25 17.5C3.25 17.3011 3.32902 17.1103 3.46967 16.9697C3.61032 16.829 3.80109 16.75 4 16.75H20C20.1989 16.75 20.3897 16.829 20.5303 16.9697C20.671 17.1103 20.75 17.3011 20.75 17.5Z"
                fill="#060A31"
              />
            </svg>
          </button>
        </div>

        {/* show only on mobile */}
        <div className="flex md:hidden justify-end gap-6 lg:p-5">
          {/* <button className="bg-primary-base py-2 px-4 text-sm text-white rounded font-medium">
                    Top up
                </button> */}

          <button>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75 7.5C7.75 6.94188 7.85993 6.38923 8.07351 5.8736C8.28709 5.35796 8.60015 4.88945 8.9948 4.4948C9.38944 4.10015 9.85796 3.78709 10.3736 3.57351C10.8892 3.35993 11.4419 3.25 12 3.25C12.5581 3.25 13.1108 3.35993 13.6264 3.57351C14.142 3.78709 14.6106 4.10015 15.0052 4.4948C15.3999 4.88945 15.7129 5.35796 15.9265 5.8736C16.1401 6.38923 16.25 6.94188 16.25 7.5C16.25 8.62717 15.8022 9.70817 15.0052 10.5052C14.2082 11.3022 13.1272 11.75 12 11.75C10.8728 11.75 9.79183 11.3022 8.9948 10.5052C8.19777 9.70817 7.75 8.62717 7.75 7.5ZM12 4.75C11.2707 4.75 10.5712 5.03973 10.0555 5.55546C9.53973 6.07118 9.25 6.77065 9.25 7.5C9.25 8.22935 9.53973 8.92882 10.0555 9.44454C10.5712 9.96027 11.2707 10.25 12 10.25C12.7293 10.25 13.4288 9.96027 13.9445 9.44454C14.4603 8.92882 14.75 8.22935 14.75 7.5C14.75 6.77065 14.4603 6.07118 13.9445 5.55546C13.4288 5.03973 12.7293 4.75 12 4.75ZM8 14.75C7.40326 14.75 6.83097 14.9871 6.40901 15.409C5.98705 15.831 5.75 16.4033 5.75 17V18.188C5.75 18.206 5.763 18.222 5.781 18.225C9.9 18.897 14.101 18.897 18.219 18.225C18.2277 18.2236 18.2357 18.219 18.2414 18.2123C18.2471 18.2055 18.2501 18.1969 18.25 18.188V17C18.25 16.4033 18.0129 15.831 17.591 15.409C17.169 14.9871 16.5967 14.75 16 14.75H15.66C15.6332 14.7498 15.6065 14.7538 15.581 14.762L14.716 15.045C12.9512 15.6212 11.0488 15.6212 9.284 15.045L8.418 14.762C8.39311 14.754 8.36713 14.75 8.341 14.75H8ZM4.25 17C4.25 16.0054 4.64509 15.0516 5.34835 14.3483C6.05161 13.6451 7.00544 13.25 8 13.25H8.34C8.525 13.25 8.709 13.28 8.884 13.336L9.75 13.619C11.212 14.0962 12.788 14.0962 14.25 13.619L15.116 13.336C15.291 13.279 15.475 13.25 15.659 13.25H16C16.9946 13.25 17.9484 13.6451 18.6517 14.3483C19.3549 15.0516 19.75 16.0054 19.75 17V18.188C19.75 18.942 19.204 19.584 18.46 19.705C14.1817 20.4034 9.81835 20.4034 5.54 19.705C5.17992 19.6464 4.85244 19.4616 4.61611 19.1837C4.37978 18.9057 4.25001 18.5528 4.25 18.188V17Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
        {/* max-md:-translate-x-full */}
        {/* sidenav on large screen */}
        <div
          className={`max-lg:pt-5 lg:px-5 md:flex flex-col bg-white max-md:absolute max-md:left-0 max-md:transition-transform max-md:duration-200 max-md:top-full max-md:w-[80vw] ${
            open ? "max-md:-translate-x-0" : "max-md:-translate-x-full"
          }`}
        >
          <Nav activePage={active} open={open} />
        </div>
      </nav>

      <div className="md:grid md:grid-rows-[max-content_1fr] overflow-hidden">
        <nav className="hidden md:flex justify-end gap-6 p-5">
          <button>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75 7.5C7.75 6.94188 7.85993 6.38923 8.07351 5.8736C8.28709 5.35796 8.60015 4.88945 8.9948 4.4948C9.38944 4.10015 9.85796 3.78709 10.3736 3.57351C10.8892 3.35993 11.4419 3.25 12 3.25C12.5581 3.25 13.1108 3.35993 13.6264 3.57351C14.142 3.78709 14.6106 4.10015 15.0052 4.4948C15.3999 4.88945 15.7129 5.35796 15.9265 5.8736C16.1401 6.38923 16.25 6.94188 16.25 7.5C16.25 8.62717 15.8022 9.70817 15.0052 10.5052C14.2082 11.3022 13.1272 11.75 12 11.75C10.8728 11.75 9.79183 11.3022 8.9948 10.5052C8.19777 9.70817 7.75 8.62717 7.75 7.5ZM12 4.75C11.2707 4.75 10.5712 5.03973 10.0555 5.55546C9.53973 6.07118 9.25 6.77065 9.25 7.5C9.25 8.22935 9.53973 8.92882 10.0555 9.44454C10.5712 9.96027 11.2707 10.25 12 10.25C12.7293 10.25 13.4288 9.96027 13.9445 9.44454C14.4603 8.92882 14.75 8.22935 14.75 7.5C14.75 6.77065 14.4603 6.07118 13.9445 5.55546C13.4288 5.03973 12.7293 4.75 12 4.75ZM8 14.75C7.40326 14.75 6.83097 14.9871 6.40901 15.409C5.98705 15.831 5.75 16.4033 5.75 17V18.188C5.75 18.206 5.763 18.222 5.781 18.225C9.9 18.897 14.101 18.897 18.219 18.225C18.2277 18.2236 18.2357 18.219 18.2414 18.2123C18.2471 18.2055 18.2501 18.1969 18.25 18.188V17C18.25 16.4033 18.0129 15.831 17.591 15.409C17.169 14.9871 16.5967 14.75 16 14.75H15.66C15.6332 14.7498 15.6065 14.7538 15.581 14.762L14.716 15.045C12.9512 15.6212 11.0488 15.6212 9.284 15.045L8.418 14.762C8.39311 14.754 8.36713 14.75 8.341 14.75H8ZM4.25 17C4.25 16.0054 4.64509 15.0516 5.34835 14.3483C6.05161 13.6451 7.00544 13.25 8 13.25H8.34C8.525 13.25 8.709 13.28 8.884 13.336L9.75 13.619C11.212 14.0962 12.788 14.0962 14.25 13.619L15.116 13.336C15.291 13.279 15.475 13.25 15.659 13.25H16C16.9946 13.25 17.9484 13.6451 18.6517 14.3483C19.3549 15.0516 19.75 16.0054 19.75 17V18.188C19.75 18.942 19.204 19.584 18.46 19.705C14.1817 20.4034 9.81835 20.4034 5.54 19.705C5.17992 19.6464 4.85244 19.4616 4.61611 19.1837C4.37978 18.9057 4.25001 18.5528 4.25 18.188V17Z"
                fill="black"
              />
            </svg>
          </button>
        </nav>

        {/* <div className="bg-red-500 h-full overflow-auto"> */}
        <div className="bg-[#FAFBFF] h-full overflow-auto p-5">{children}</div>
      </div>
    </main>
  );
}

function Nav({ activePage, open }: { activePage: string; open: boolean }) {
  const { logout } = useBursar();
  return (
    <>
      <Link
        href="/bursar/dashboard"
        className={`flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === "dashboard"
            ? "fill-primary-base text-primary-base"
            : "fill-primary-dark"
        }`}
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="inherit"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4H20V10H12V4ZM12 21V11H20V21H12ZM3 21V15H11V21H3ZM3 14V4H11V14H3ZM4 5V13H10V5H4ZM13 5V9H19V5H13ZM13 12V20H19V12H13ZM4 16V20H10V16H4Z"
            fill="inherit"
          />
        </svg>

        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Dashboard
        </span>
      </Link>
      <Link
        href="/bursar/students"
        className={`flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === "students"
            ? "stroke-primary-base text-primary-base"
            : "stroke-primary-dark"
        }`}
      >
        <HiOutlineUsers className="w-6 h-auto stroke-inherit" />
        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Students
        </span>
      </Link>
      <Link
        href="/bursar/potters"
        className={`flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === "potters"
            ? "stroke-primary-base text-primary-base"
            : "stroke-primary-dark"
        }`}
      >
        <FaRegUser className="w-6 h-6 stroke-inherit" />
        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Potter
        </span>
      </Link>
      <Link
        href="/bursar/hostels"
        className={`flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === "hostels"
            ? "stroke-primary-base text-primary-base"
            : "stroke-primary-dark"
        }`}
      >
        <MdOutlineBedroomParent className="w-6 h-6 stroke-inherit" />
        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Hostels
        </span>
      </Link>
      <Link
        href="/bursar/complaints"
        className={`flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === "complaints"
            ? "stroke-primary-base text-primary-base"
            : "stroke-primary-dark"
        }`}
      >
        <BiMailSend className="w-6 h-6 stroke-inherit" />

        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Complaints
        </span>
      </Link>
      <hr className="my-5" />
      <button
        className={` flex gap-6 justify-start items-center px-5 py-4  ${
          activePage === ""
            ? "fill-primary-base text-primary-base"
            : "fill-primary-dark"
        }`}
        onClick={logout}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="inherit"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 3H11C11.7956 3 12.5587 3.31607 13.1213 3.87868C13.6839 4.44129 14 5.20435 14 6V10H13V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H11C11.5304 21 12.0391 20.7893 12.4142 20.4142C12.7893 20.0391 13 19.5304 13 19V15H14V19C14 19.7956 13.6839 20.5587 13.1213 21.1213C12.5587 21.6839 11.7956 22 11 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V6C2 5.20435 2.31607 4.44129 2.87868 3.87868C3.44129 3.31607 4.20435 3 5 3ZM8 12H19.25L16 8.75L16.66 8L21.16 12.5L16.66 17L16 16.25L19.25 13H8V12Z"
            fill="inherit"
          />
        </svg>

        <span
          className={`lg:inline-block ${
            open ? "md:inline-block" : "md:hidden"
          }`}
        >
          Logout
        </span>
      </button>
    </>
  );
}
