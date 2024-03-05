"use client";
import ManagerDashboard from "@/components/UI/ManagerDashboard";
import AddHostel from "./AddHostel";
import useFetcher from "@/hooks/useFetcher";
import { Hostel } from "@/types";
import useManager from "@/store/manager/useManager";
import { useEffect, useState } from "react";
import HostelService from "@/services/Hostel";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import HostelTable from "@/components/UI/HostelTable";

export default function HostelsPage() {
  const fetcher = useFetcher<Hostel[]>([]);
  const { loading } = useManager();
  const [hostels, setHostels] = useState<Hostel[]>([]);

  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();

    fetcher.wrapper(hostel.findAll);
    const interval = setInterval(() => {
      fetcher.wrapper(hostel.findAll);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (fetcher.error) {
      toast.error(fetcher.error);
    }
  }, [fetcher.error]);
  useEffect(() => {
    if (fetcher.data) {
      setHostels(fetcher.data);
    }
  }, [fetcher.data]);
  return (
    <ManagerDashboard active="hostels">
      <main>
        <AddHostel />

        {fetcher.loading && hostels.length === 0 ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching hostels</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            No hostels have been created
          </div>
        ) : hostels.length > 0 ? (
          <HostelTable hostels={hostels} />
        ) : null}
      </main>
    </ManagerDashboard>
  );
}
