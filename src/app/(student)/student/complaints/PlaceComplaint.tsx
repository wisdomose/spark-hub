"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import useFetcher from "@/hooks/useFetcher";
import ComplaintService from "@/services/Complaint";
import useStudent from "@/store/student/useStudent";
import { Dialog } from "@headlessui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PlaceComplaint() {
  const [data, setData] = useState({
    heading: "",
    complaint: "",
  });
  let [isOpen, setIsOpen] = useState(false);
  const createFetcher = useFetcher();
  const { user } = useStudent();

  const toggleIsOpen = () =>
    createFetcher.loading ? null : setIsOpen((s) => !s);

  const updateData =
    (key: keyof typeof data) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      setData((state) => {
        const newState = {
          ...state,
          [key]: e.target.value,
        };

        return newState;
      });
    };

  async function add() {
    if (!user?.hostelId) return;
    const complaint = new ComplaintService();

    await createFetcher.wrapper(() => complaint.create({ ...data }));
  }

  useEffect(() => {
    if (createFetcher.error) {
      toast.error(createFetcher.error);
    }
  }, [createFetcher.error]);
  useEffect(() => {
    if (createFetcher.data) {
      toast.success("Complaint has been submitted");
      setData({
        heading: "",
        complaint: "",
      });
    }
  }, [createFetcher.data]);
  useEffect(() => {
    return () =>
      setData({
        heading: "",
        complaint: "",
      });
  }, [isOpen]);

  if (!user?.hostelId) return null;

  return (
    <>
      <Button label="Place a complaint" onClick={toggleIsOpen} size="sm" />
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
              <h1 className="text-2xl">Make a complaint</h1>
              <form
                className="w-full flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  !createFetcher.loading && add();
                }}
              >
                <Input
                  label="Heading"
                  id="heading"
                  type="text"
                  onChange={updateData("heading")}
                  value={data.heading}
                  placeholder="Broken water system"
                />

                <TextArea
                  id="complaint"
                  value={data.complaint}
                  onChange={updateData("complaint")}
                  label="Complaint"
                />

                <Button
                  type="submit"
                  label="Place complaint"
                  block
                  loading={createFetcher.loading}
                />
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
