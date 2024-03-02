"use client";

import Button from "@/components/Button";
import useFetcher from "@/hooks/useFetcher";
import HostelService from "@/services/Hostel";
import useStudent from "@/store/student/useStudent";
import { Hostel } from "@/types";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ApplyModal() {
  let [isOpen, setIsOpen] = useState(false);
  const createFetcher = useFetcher();
  const hostelFetcher = useFetcher<Hostel[]>([]);
  let [hostelId, setHostelId] = useState<string | undefined>();
  const { user, loading } = useStudent();

  const toggleIsOpen = () =>
    createFetcher.loading ? null : setIsOpen((s) => !s);

  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();
    hostelFetcher.wrapper(hostel.findAll);
  }, [loading]);

  async function apply() {
    if (hostelId === undefined) return;
    const hostelService = new HostelService();

    await createFetcher.wrapper(() => hostelService.apply(hostelId as string));
  }

  useEffect(() => {
    if (createFetcher.error) {
      toast.error(createFetcher.error);
    }
  }, [createFetcher.error]);
  useEffect(() => {
    if (createFetcher.data) {
      toast.success("Your application has been sucessful");
      setHostelId(undefined);
    }
  }, [createFetcher.data]);
  useEffect(() => {
    return () => {
      setHostelId(undefined);
    };
  }, [isOpen]);

  if(user?.hostelId) return null

  return (
    <>
      <Button label="Apply for accomodation" onClick={toggleIsOpen} size="sm" />

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
            <Dialog.Panel className="max-w-screen-lg w-[80vw] md:w-[50vw] mx-auto p-10 rounded bg-white flex gap-6 flex-col items-center">
              <h1 className="text-2xl">Apply for accomodation</h1>

              <div className="grid lg:grid-cols-2 gap-5 w-full">
                {hostelFetcher.data.map((hostel) => (
                  <label
                    htmlFor={hostel.id}
                    key={hostel.id}
                    className={`grid grid-cols-2 gap-2 border rounded-md p-4 ${
                      hostel.id == hostelId ? "ring-primary-base ring" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="hostel"
                      id={hostel.id}
                      checked={hostel.id === hostelId}
                      onChange={(e) => setHostelId(hostel.id)}
                      className="hidden"
                    />
                    <p className="text-sm">
                      <strong className="capitalize">Hostel Name</strong>
                      <br />
                      <span className="capitalize">{hostel.name}</span>
                    </p>
                    <p className="text-sm">
                      <strong className="capitalize">Potter</strong>
                      <br />
                      <span className="capitalize">
                        {hostel.potter?.displayName}
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong className="capitalize">Number of rooms</strong>
                      <br />
                      {hostel.noOfRooms}
                    </p>
                    <p className="text-sm">
                      <strong className="capitalize">Persons per room</strong>
                      <br />
                      {hostel.personsPerRoom}
                    </p>
                    <p className="text-sm">
                      <strong className="capitalize">total applications</strong>
                      <br />
                      {hostel.rooms.reduce((a, b) => a + b)}
                    </p>
                  </label>
                ))}
              </div>

              {/* <table className="w-full mt-5">
                <thead>
                  <tr>
                    <th className="px-2 py-3 text-left text-sm font-semibold"></th>
                    <th className="px-2 py-3 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-semibold">
                      No of rooms
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-semibold">
                      Persons per room
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-semibold">
                      Potter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hostelFetcher.data.map((hostel, index) => (
                    <tr key={hostel.id} className="odd:bg-gray-200 ">
                      <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
                        <input
                          type="checkbox"
                          name="hostel"
                          id={hostel.id}
                          className="appearance-none checked:bg-primary-base checked:border-primary-base border-2 border-gray-100 w-4 h-4 rounded-full"
                        />
                      </td>
                      <td className="capitalize border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
                        {hostel.name}
                      </td>
                      <td className="lowercase border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                        {hostel.noOfRooms}
                      </td>
                      <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                        {hostel.personsPerRoom}
                      </td>
                      <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                        {hostel.potter?.displayName ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}

              <Button
                label="Apply"
                loading={createFetcher.loading}
                disabled={!hostelId}
                onClick={apply}
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
