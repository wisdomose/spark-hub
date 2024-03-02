"use client";
import Spinner from "@/components/Spinner";
import PotterDashboard from "@/components/UI/PotterDashboard";
import StudentsTable from "@/components/UI/StudentsTable";
import useFetcher from "@/hooks/useFetcher";
import HostelService from "@/services/Hostel";
import usePotter from "@/store/potter/usePotter";
import { Hostel, Student } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HostelsPage() {
  const { loading, user } = usePotter();
  const [hostel, setHostel] = useState<Hostel>();
  const myHostelFetcher = useFetcher<Hostel>();
  const myHostelStudentsFetcher = useFetcher<Student[]>([]);

  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();
    myHostelFetcher.wrapper(hostel.findHostelAssignedToMe);
    myHostelStudentsFetcher.wrapper(hostel.findAllStudentsInMyHostel);
  }, [loading]);

  useEffect(() => {
    if (myHostelFetcher.data) {
      setHostel(myHostelFetcher.data);
    }
  }, [myHostelFetcher.data]);
  useEffect(() => {
    if (myHostelFetcher.error) {
      toast.error(myHostelFetcher.error);
    }
  }, [myHostelFetcher.error]);
  useEffect(() => {
    if (myHostelStudentsFetcher.error) {
      toast.error(myHostelStudentsFetcher.error);
    }
  }, [myHostelStudentsFetcher.error]);
  // remove student from a   room
  function kickout() {}

  return (
    <PotterDashboard active="hostel">
      <main>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-10">
            <p className="font-medium uppercase text-xs mb-3">Vacant slots</p>
            <p className="font-semibold text-2xl">
              {hostel
                ? hostel?.noOfRooms * hostel?.personsPerRoom -
                  hostel?.rooms.reduce((a, b) => a + b)
                : "-"}
            </p>
          </div>
          <div className="bg-white p-10">
            <p className="font-medium uppercase text-xs mb-3">Rooms</p>
            <p className="font-semibold text-2xl">
              {hostel ? hostel?.noOfRooms : "-"}
            </p>
          </div>
          <div className="bg-white p-10 md:col-span-2 lg:col-span-1">
            <p className="font-medium uppercase text-xs mb-3">Occupants</p>
            <p className="font-semibold text-2xl">
              {hostel ? hostel?.rooms.reduce((a, b) => a + b) : "-"}
            </p>
          </div>
        </div>

        {myHostelStudentsFetcher.loading ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching students</p>
          </div>
        ) : myHostelStudentsFetcher.data.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            No complaints have been submitted from your hostel
          </div>
        ) : myHostelStudentsFetcher.data.length > 0 ? (
          <div className="mt-10">
            <StudentsTable
              students={myHostelStudentsFetcher.data}
              omit={["hostel"]}
            />
          </div>
        ) : null}
      </main>
    </PotterDashboard>
  );
}
