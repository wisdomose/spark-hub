"use client";
import StudentDashboard from "@/components/UI/StudentDashboard";
import ApplyModal from "./ApplyModal";
import useStudent from "@/store/student/useStudent";
import { useEffect, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import { Hostel, Student } from "@/types";
import HostelService from "@/services/Hostel";
import StudentsTable from "@/components/UI/StudentsTable";
import Spinner from "@/components/Spinner";

export default function DashboardPage() {
  const { loading, user } = useStudent();
  const [roomMates, setRoomMates] = useState<Student[]>([]);
  const myHostelFetcher = useFetcher<Hostel>();
  const myRoomMatesFetcher = useFetcher<Student[]>([]);

  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();
    myHostelFetcher.wrapper(hostel.findMyHostel);
    myRoomMatesFetcher.wrapper(hostel.findAllMyRoomMates);
  }, [loading]);

  useEffect(() => {
    if (myRoomMatesFetcher.data) {
      setRoomMates(
        myRoomMatesFetcher.data.filter((student) => student.id != user?.id)
      );
    }
  }, [myRoomMatesFetcher.data]);

  return (
    <StudentDashboard active="dashboard">
      <main>
        <ApplyModal />

        <p className="font-bold text-sm mb-2">My Hostel</p>
        <div
          className={`grid grid-cols-2 gap-2 max-w-sm border rounded-md p-4 w-full`}
        >
          <p className="text-sm">
            <strong className="capitalize">Hostel Name</strong>
            <br />
            <span className="capitalize">{myHostelFetcher.data?.name}</span>
          </p>
          <p className="text-sm">
            <strong className="capitalize">Potter</strong>
            <br />
            <span className="capitalize">
              {myHostelFetcher.data?.potter?.displayName}
            </span>
          </p>
          <p className="text-sm">
            <strong className="capitalize">Number of rooms</strong>
            <br />
            {myHostelFetcher.data?.noOfRooms}
          </p>
          <p className="text-sm">
            <strong className="capitalize">Persons per room</strong>
            <br />
            {myHostelFetcher.data?.personsPerRoom}
          </p>
          <p className="text-sm">
            <strong className="capitalize">total applications</strong>
            <br />
            {myHostelFetcher.data?.rooms.reduce((a, b) => a + b)}
          </p>
          <p className="text-sm">
            <strong className="capitalize">Room Number</strong>
            <br />
            {user?.room}
          </p>
        </div>

        {/* room mates */}
        <p className="font-bold text-sm mb-2 mt-10">Your room mates</p>
        {myRoomMatesFetcher.loading ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching room mates</p>
          </div>
        ) : roomMates.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            You have no room mates yet
          </div>
        ) : roomMates.length > 0 ? (
          <StudentsTable students={myRoomMatesFetcher.data} omit={["hostel"]} />
        ) : null}
      </main>
    </StudentDashboard>
  );
}
