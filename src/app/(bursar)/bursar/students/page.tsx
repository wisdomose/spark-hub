"use client";
import BursarDashboard from "@/components/UI/BursarDashboard";
import AddStudent from "./AddStudent";
import useFetcher from "@/hooks/useFetcher";
import { useEffect, useState } from "react";
import StudentService from "@/services/Student";
import { Student } from "@/types";
import { toast } from "react-toastify";
import useBursar from "@/store/bursar/useBursar";
import Spinner from "@/components/Spinner";
import StudentsTable from "@/components/UI/StudentsTable";

export default function StudentsPage() {
  const fetcher = useFetcher<Student[]>([]);
  const { loading } = useBursar();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (loading) return;
    const student = new StudentService();

    fetcher.wrapper(student.findAll);
    const interval = setInterval(() => {
      fetcher.wrapper(student.findAll);
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
      setStudents(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <BursarDashboard active="students">
      <main>
        <AddStudent />

        {fetcher.loading && students.length === 0 ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching students</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            No students have been created
          </div>
        ) : students.length > 0 ? (
          <StudentsTable students={students} />
        ) : null}
      </main>
    </BursarDashboard>
  );
}
