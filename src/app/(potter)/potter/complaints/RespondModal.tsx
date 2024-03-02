import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import useFetcher from "@/hooks/useFetcher";
import ComplaintService from "@/services/Complaint";
import { Complaint } from "@/types";
import { Dialog } from "@headlessui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function RespondModal({
  isOpen,
  toggleIsOpen,
  complaint,
}: {
  isOpen: boolean;
  toggleIsOpen(): void;
  complaint: Complaint;
}) {
  const [response, setResponse] = useState(complaint.response);
  const fetcher = useFetcher();
  const resolveFetcher = useFetcher<Boolean>();

  const updateResponse = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  async function respond() {
    const complaintService = new ComplaintService();
    await fetcher.wrapper(() =>
      complaintService.respond(complaint.id, { response })
    );
  }

  async function resolve() {
    const complaintService = new ComplaintService();
    await resolveFetcher.wrapper(() => complaintService.resolve(complaint.id));
  }

  useEffect(() => {
    if (fetcher.error) {
      toast.error(fetcher.error);
    }
  }, [fetcher.error]);
  useEffect(() => {
    if (fetcher.data) {
      toast.success("Success");
      toggleIsOpen();
    }
  }, [fetcher.data]);
  useEffect(() => {
    if (resolveFetcher.data) {
      toast.success("Complaint has been resolved");
      toggleIsOpen();
    }
  }, [resolveFetcher.data]);
  useEffect(() => {
    return () => {
      !isOpen && setResponse("");
    };
  }, [isOpen]);
  return (
    <>
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
              <h1 className="text-2xl">Respond</h1>

              <div className="flex justify-start w-full">
                <Button
                  label="Resolve"
                  onClick={resolve}
                  disabled={fetcher.loading}
                  loading={resolveFetcher.loading}
                />
              </div>

              <form
                className="w-full flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  !fetcher.loading && respond();
                }}
              >
                <div className="">
                  <p className="font-semibold capitalize">heading</p>
                  <p className="text-sm mt-1">{complaint.heading}</p>
                </div>

                <div className="">
                  <p className="font-semibold capitalize">complaint</p>
                  <p className="text-sm mt-1">{complaint.complaint}</p>
                </div>

                {complaint.resolved ? (
                  <div className="">
                    <p className="font-semibold capitalize">response</p>
                    <p
                      className={`text-sm mt-1 ${
                        !!complaint.response
                          ? ""
                          : "text-gray-300 pointer-events-none select-none"
                      }`}
                    >
                      {!!complaint.response
                        ? complaint.response
                        : "awaiting response"}
                    </p>
                  </div>
                ) : (
                  <TextArea
                    id="response"
                    value={response}
                    onChange={updateResponse}
                    label="Response"
                  />
                )}

                <Button
                  type="submit"
                  label="Respond"
                  block
                  loading={fetcher.loading}
                  disabled={resolveFetcher.loading}
                />
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
