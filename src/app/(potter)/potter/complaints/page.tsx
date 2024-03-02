"use client";
import Spinner from "@/components/Spinner";
import PotterDashboard from "@/components/UI/PotterDashboard";
import useFetcher from "@/hooks/useFetcher";
import { formatTimestamp } from "@/lib/utils";
import ComplaintService from "@/services/Complaint";
import usePotter from "@/store/potter/usePotter";
import { Complaint } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RespondModal from "./RespondModal";

export default function ComplaintsPage() {
  const { loading, user } = usePotter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const complaintsToMeFetcher = useFetcher<Complaint[]>([]);
  let [isOpen, setIsOpen] = useState(false);
  let [complaint, setComplaint] = useState<Complaint | undefined>();

  const closeModal = () => {
    setIsOpen(false);
    setComplaint(undefined);
  };
  const openModal = (complaint: Complaint) => {
    setIsOpen(true);
    setComplaint(complaint);
  };

  useEffect(() => {
    if (loading) return;
    const complaint = new ComplaintService();
    complaintsToMeFetcher.wrapper(complaint.findAllComplaintsToMe);

    const interval = setInterval(() => {
      complaintsToMeFetcher.wrapper(complaint.findAllComplaintsToMe);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (complaintsToMeFetcher.data) {
      setComplaints(complaintsToMeFetcher.data);
    }
  }, [complaintsToMeFetcher.data]);

  useEffect(() => {
    if (complaintsToMeFetcher.error) {
      toast.error(complaintsToMeFetcher.error);
    }
  }, [complaintsToMeFetcher.error]);

  return (
    <PotterDashboard active="complaints">
      <>
        <main className="max-w-lg mx-auto">
          {complaintsToMeFetcher.loading && complaints.length === 0 ? (
            <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
              <Spinner />

              <p className="text-gray-700 text-sm">fetching complaints</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-gray-700 text-sm text-center mt-5">
              No complaints have been submitted from your hostel
            </div>
          ) : complaints.length > 0 ? (
            <div className="mt-5">
              {complaints.map((complaint) => (
                <button
                  onClick={() => openModal(complaint)}
                  className="border-b p-2 gap-10 flex justify-between items-center text-left w-full"
                  key={complaint.id}
                >
                  <div className=" flex-grow-0 overflow-hidden">
                    <p className="text-sm font-bold">{complaint.heading}</p>
                    <p className="text-sm truncate">{complaint.complaint}</p>
                    <p className="text-xs mt-1">
                      {formatTimestamp(complaint.createdAt.seconds)}
                    </p>
                  </div>
                  <div
                    className={`uppercase text-xs px-4 py-1 rounded-full w-fit font-bold ${
                      complaint.resolved
                        ? "text-green-800 bg-green-200"
                        : "text-yellow-800 bg-yellow-200"
                    }`}
                  >
                    {complaint.resolved ? "resolved" : "pending"}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </main>
        {complaint && (
          <RespondModal
            complaint={complaint}
            isOpen={isOpen}
            toggleIsOpen={closeModal}
          />
        )}
      </>
    </PotterDashboard>
  );
}
