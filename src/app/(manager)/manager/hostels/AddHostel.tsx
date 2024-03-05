"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useFetcher from "@/hooks/useFetcher";
import HostelService from "@/services/Hostel";
import PotterService from "@/services/Potter";
import useManager from "@/store/manager/useManager";
import { Potter } from "@/types";
import { Dialog } from "@headlessui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddHostel() {
  const [data, setData] = useState({
    name: "",
    noOfRooms: 0,
    personsPerRoom: 0,
  });
  const { loading } = useManager();
  let [isOpen, setIsOpen] = useState(false);
  let [potterIndex, setPotterIndex] = useState<number | undefined>();
  const createFetcher = useFetcher();
  const potterFetcher = useFetcher<Potter[]>([]);
  const toggleIsOpen = () =>
    createFetcher.loading ? null : setIsOpen((s) => !s);

  const updateData =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
      setData((state) => {
        const newState = {
          ...state,
          [key]: key != "name" ? Number(e.target.value) : e.target.value,
        };

        return newState;
      });
    };

  async function addHostel() {
    if (potterIndex === undefined) return;
    const hostelService = new HostelService();

    await createFetcher.wrapper(() =>
      hostelService.create({
        ...data,
        potterId: potterFetcher.data[potterIndex as number].id,
      })
    );
  }

  useEffect(() => {
    if (createFetcher.error) {
      toast.error(createFetcher.error);
    }
  }, [createFetcher.error]);
  useEffect(() => {
    if (createFetcher.data) {
      toast.success("Hostel created");
      setData({
        name: "",
        noOfRooms: 0,
        personsPerRoom: 0,
      });
      setPotterIndex(undefined);
    }
  }, [createFetcher.data]);
  useEffect(() => {
    if (isOpen) {
      const potter = new PotterService();
      potterFetcher.wrapper(() => potter.findAll({ hasHostel: false }));
    }
    return () => {
      setData({
        name: "",
        noOfRooms: 0,
        personsPerRoom: 0,
      });
      setPotterIndex(undefined);
    };
  }, [isOpen]);
  
  return (
    <>
      <Button label="Add Hostel" onClick={toggleIsOpen} size="sm" />
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
            <Dialog.Panel className="max-w-screen-md w-[80vw] md:w-[50vw] mx-auto p-10 rounded bg-white flex gap-6 flex-col items-center">
              <h1 className="text-2xl">Add a new Hostel</h1>
              <form
                className="w-full flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  !createFetcher.loading && addHostel();
                }}
              >
                <Input
                  label="Name"
                  id="name"
                  type="name"
                  onChange={updateData("name")}
                  value={data.name}
                  placeholder=""
                />
                <Input
                  label="Number of rooms"
                  id="no-of-rooms"
                  placeholder=""
                  type="number"
                  value={data.noOfRooms.toString()}
                  onChange={updateData("noOfRooms")}
                />
                <Input
                  label="Number of persons per room"
                  id="persons-per-room"
                  placeholder=""
                  type="number"
                  value={data.personsPerRoom.toString()}
                  onChange={updateData("personsPerRoom")}
                />

                <div className="">
                  <p className="block text-sm font-medium">
                    Assign a potter to this hostel
                  </p>
                  <table className="w-full mt-1">
                    <thead>
                      <tr>
                        <th className="px-2 py-3 text-left text-sm font-semibold"></th>
                        <th className="px-2 py-3 text-left text-sm font-semibold">
                          Name
                        </th>
                        <th className="px-2 py-3 text-left text-sm font-semibold">
                          Email
                        </th>
                        <th className="px-2 py-3 text-left text-sm font-semibold">
                          Hostel
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {potterFetcher.data.map((potter, index) => (
                        <tr key={potter.userId} className="odd:bg-gray-200 ">
                          <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
                            <input
                              type="checkbox"
                              name="potter"
                              id={potter.userId}
                              className="appearance-none checked:bg-primary-base checked:border-primary-base border-2 border-gray-100 w-4 h-4 rounded-full"
                              checked={index === potterIndex}
                              onChange={(e) => setPotterIndex(index)}
                            />
                          </td>
                          <td className="capitalize border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
                            {potter.displayName}
                          </td>
                          <td className="lowercase border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                            {potter.email}
                          </td>
                          <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                            {potter.hostel ? potter.hostel?.name : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {potterIndex !== undefined && (
                    <p className="text-sm mt-2 italic">
                      The potter assigned to this hostel is{" "}
                      <strong>
                        {potterFetcher.data[potterIndex].displayName}
                      </strong>
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  label="Add New Hostel"
                  block
                  loading={createFetcher.loading}
                  disabled={
                    potterIndex === undefined ||
                    data.noOfRooms == 0 ||
                    data.personsPerRoom == 0 ||
                    !data.name
                  }
                />
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
