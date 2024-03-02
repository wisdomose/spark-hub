"use client"
import BursarDashboard from "@/components/UI/BursarDashboard";
import AddPotter from "./AddPotter";
import PotterTable from "@/components/UI/PotterTable";
import useFetcher from "@/hooks/useFetcher";
import { Potter } from "@/types";
import { useEffect, useState } from "react";
import useBursar from "@/store/bursar/useBursar";
import PotterService from "@/services/Potter";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

export default function PottersPage() {
  const fetcher = useFetcher<Potter[]>([]);
  const { loading } = useBursar();
  const [potters, setPotters] = useState<Potter[]>([]);

  useEffect(() => {
    if (loading) return;
    const potter = new PotterService();

    fetcher.wrapper(potter.findAll);
    const interval = setInterval(() => {
      fetcher.wrapper(potter.findAll);
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
      setPotters(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <BursarDashboard active="potters">
      <main>
        <AddPotter />

        {fetcher.loading && potters.length === 0 ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching potters</p>
          </div>
        ) : potters.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            No potters have been created
          </div>
        ) : potters.length > 0 ? (
          <PotterTable potters={potters} />
        ) : null}
      </main>
    </BursarDashboard>
  );
}
