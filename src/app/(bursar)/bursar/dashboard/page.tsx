"use client";
import BursarDashboard from "@/components/UI/BursarDashboard";
import useFetcher from "@/hooks/useFetcher";
import HostelService from "@/services/Hostel";
import PotterService from "@/services/Potter";
import StudentService from "@/services/Student";
import useBursar from "@/store/bursar/useBursar";
import { useEffect } from "react";

export default function DashboardPage() {
  const hostelCountFetcher = useFetcher<number>(0);
  const studentCountFetcher = useFetcher<number>(0);
  const potterCountFetcher = useFetcher<number>(0);

  const { loading } = useBursar();
  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();
    const student = new StudentService();
    const potter = new PotterService();
    hostelCountFetcher.wrapper(hostel.count);
    studentCountFetcher.wrapper(student.count);
    potterCountFetcher.wrapper(potter.count);
  }, [loading]);
  return (
    <BursarDashboard active="dashboard">
      <main>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-10">
            <p className="font-medium uppercase text-xs mb-3">Hostels</p>
            <p className="font-semibold text-2xl">{hostelCountFetcher.data}</p>
          </div>
          <div className="bg-white p-10">
            <p className="font-medium uppercase text-xs mb-3">Students</p>
            <p className="font-semibold text-2xl">{studentCountFetcher.data}</p>
          </div>
          <div className="bg-white p-10 md:col-span-2 lg:col-span-1">
            <p className="font-medium uppercase text-xs mb-3">Potters</p>
            <p className="font-semibold text-2xl">{potterCountFetcher.data}</p>
          </div>
        </div>
        
      </main>
    </BursarDashboard>
  );
}
