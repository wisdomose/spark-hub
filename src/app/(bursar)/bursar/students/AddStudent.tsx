"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useFetcher from "@/hooks/useFetcher";
import StudentService from "@/services/Student";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddStudent() {
  const [data, setData] = useState({
    matricNo: "",
    email: "",
    displayName: "",
  });
  let [isOpen, setIsOpen] = useState(false);
  const createFetcher = useFetcher();

  const toggleIsOpen = () =>
    createFetcher.loading ? null : setIsOpen((s) => !s);

  const updateData =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
      setData((state) => {
        const newState = {
          ...state,
          [key]: e.target.value,
        };

        return newState;
      });
    };

  async function addStudent() {
    const studentService = new StudentService();
    await createFetcher.wrapper(() => studentService.createOne(data));
  }

  useEffect(() => {
    if (createFetcher.error) {
      toast.error(createFetcher.error);
    }
  }, [createFetcher.error]);
  useEffect(() => {
    if (createFetcher.data) {
      toast.success("Student added");
      setData({
        matricNo: "",
        email: "",
        displayName: "",
      });
    }
  }, [createFetcher.data]);
  useEffect(() => {
    return () =>
    setData({
      matricNo: "",
      email: "",
      displayName: "",
    });
  }, [isOpen]);

  return (
    <>
      <Button label="Add student" onClick={toggleIsOpen} size="sm" />
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
              <h1 className="text-2xl">Add a new student</h1>
              <form
                className="w-full flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  !createFetcher.loading && addStudent();
                }}
              >
                <Input
                  label="Name"
                  id="name"
                  type="text"
                  onChange={updateData("displayName")}
                  value={data.displayName}
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Email"
                  id="email"
                  type="email"
                  onChange={updateData("email")}
                  value={data.email}
                  placeholder="JohnDoe@gmail.com"
                  required
                />

                <Input
                  label="Matric No"
                  subLabel="This will also be used as the password"
                  id="matric-number"
                  placeholder=""
                  value={data.matricNo}
                  onChange={updateData("matricNo")}
                  required
                />

                <Button
                  type="submit"
                  label="Add New Student"
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
