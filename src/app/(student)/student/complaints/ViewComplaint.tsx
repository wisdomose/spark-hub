import { formatTimestamp } from "@/lib/utils";
import { Complaint } from "@/types";
import { Dialog } from "@headlessui/react";

export default function ViewComplaint({
  isOpen,
  toggleIsOpen,
  complaint,
}: {
  isOpen: boolean;
  toggleIsOpen(): void;
  complaint: Complaint;
}) {
  return (
    <Dialog open={isOpen} onClose={toggleIsOpen} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Full-screen scrollable container */}
      <div className="fixed inset-0 w-screen overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="max-w-screen-md w-[80vw] md:w-[70vw] mx-auto p-10 rounded bg-white flex gap-6 flex-col items-center">
            <h1 className="text-2xl uppercase mb-10">complaint information</h1>
            <div className="w-full grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <div className="">
                  <p className="font-semibold capitalize">heading</p>
                  <p className="text-sm mt-1">{complaint.heading}</p>
                </div>
                <div className="">
                  <p className="font-semibold capitalize">complaint</p>
                  <p className="text-sm mt-1">{complaint.complaint}</p>
                </div>
                <div className="">
                  <p className="font-semibold capitalize">response</p>
                  <p className={`text-sm mt-1 ${!!complaint.response?"":"text-gray-300 pointer-events-none select-none"}`}>
                    {!!complaint.response
                      ? complaint.response
                      : "awaiting response"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="">
                  <p className="font-semibold capitalize">submitted at</p>
                  <p className="text-xs mt-1">
                    {formatTimestamp(complaint.createdAt.seconds)}
                  </p>
                </div>
                <div className="">
                  <p className="font-semibold capitalize">status</p>
                  <div
                    className={`uppercase text-xs px-4 py-1 rounded-full w-fit font-bold mt-1 ${
                      complaint.resolved
                        ? "text-green-800 bg-green-200"
                        : "text-yellow-800 bg-yellow-200"
                    }`}
                  >
                    {complaint.resolved ? "resolved" : "pending"}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
