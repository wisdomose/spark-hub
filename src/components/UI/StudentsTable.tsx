"use client";
import useFetcher from "@/hooks/useFetcher";
import StudentService from "@/services/Student";
import { Student } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function StudentsTable({
  students,
  omit = [],
}: {
  students: Student[];
  omit?: string[];
}) {
  return (
    <table className="w-full mt-5">
      <thead>
        <tr>
          <th className="px-2 py-3 text-left text-sm font-semibold"></th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-2 py-3 text-left text-sm font-semibold">
            Track No
          </th>
          {!omit.includes("email") && (
            <th className="px-2 py-3 text-left text-sm font-semibold">Email</th>
          )}
          {omit.includes("hostel") ? null : (
            <th className="px-2 py-3 text-left text-sm font-semibold">
              Hostel
            </th>
          )}
          {!omit.includes("room") && (
            <th className="px-2 py-3 text-left text-sm font-semibold">
              Room No
            </th>
          )}
          {!omit.includes("approved") && (
            <th className="px-2 py-3 text-left text-sm font-semibold">
              Approved
            </th>
          )}
          {!omit.includes("actions") && (
            <th className="px-2 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <Row
            student={student}
            key={student.userId}
            omit={omit}
            index={index}
          />
        ))}
      </tbody>
    </table>
  );
}

function Row({
  student,
  omit = [],
  index,
}: {
  student: Student;
  omit?: string[];
  index: number;
}) {
  const [approved, setApproved] = useState(student.approved);

  function approveHandler() {
    setApproved(true);
  }
  return (
    <tr className="odd:bg-gray-200 ">
      <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
        {index + 1}
      </td>
      <td className="capitalize border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
        {student.displayName}
      </td>
      <td
        className={`border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]`}
      >
        {student.trackNo}
      </td>
      {!omit.includes("email") && (
        <td className="lowercase border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
          {student.email}
        </td>
      )}
      {omit.includes("hostel") ? null : (
        <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
          {student.hostel ? student.hostel.name : "-"}
        </td>
      )}
      {!omit.includes("room") && (
        <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
          {student.room ? student.room : "-"}
        </td>
      )}
      {!omit.includes("approved") && (
        <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
          {approved ? "Yes" : "No"}
        </td>
      )}
      {!omit.includes("actions") && (
        <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
          {!approved && (
            <Approve studentId={student.id} onSuccess={approveHandler} />
          )}
        </td>
      )}
    </tr>
  );
}

function Approve({
  studentId,
  onSuccess,
}: {
  studentId: string;
  onSuccess(): void;
}) {
  const student = new StudentService();
  const approveFetcher = useFetcher<boolean>(null);

  async function approve() {
    await approveFetcher.wrapper(() => student.approve(studentId, true));
  }

  useEffect(() => {
    if (approveFetcher.data) {
      toast.success("Student approved");
      onSuccess();
    }
  }, [approveFetcher.data]);

  useEffect(() => {
    if (approveFetcher.error) toast.error(approveFetcher.error);
  }, [approveFetcher.error]);

  return <button onClick={approve}>Approve</button>;
}
