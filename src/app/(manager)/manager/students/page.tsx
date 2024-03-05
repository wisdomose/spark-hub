"use client";
import ManagerDashboard from "@/components/UI/ManagerDashboard";
import useFetcher from "@/hooks/useFetcher";
import { useEffect, useState } from "react";
import StudentService from "@/services/Student";
import { Student } from "@/types";
import { toast } from "react-toastify";
import useManager from "@/store/manager/useManager";
import Spinner from "@/components/Spinner";
import StudentsTable from "@/components/UI/StudentsTable";

export default function StudentsPage() {
  const fetcher = useFetcher<Student[]>([]);
  const { loading } = useManager();
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
    <ManagerDashboard active="students">
      <main>
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
    </ManagerDashboard>
  );
}
