import { Student } from "@/types";

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
            Matric No
          </th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Email</th>
          {omit.includes("hostel") ? null : (
            <th className="px-2 py-3 text-left text-sm font-semibold">
              Hostel
            </th>
          )}
          <th className="px-2 py-3 text-left text-sm font-semibold">Room No</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <tr key={student.userId} className="odd:bg-gray-200 ">
            <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
              {index + 1}
            </td>
            <td className="capitalize border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
              {student.displayName}
            </td>
            <td
              className={`border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]`}
            >
              {student.matricNo}
            </td>
            <td className="lowercase border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
              {student.email}
            </td>
            {omit.includes("hostel") ? null : (
              <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
                {student.hostel ? student.hostel.name : "-"}
              </td>
            )}
            <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
              {student.room ? student.room : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
