import { Potter } from "@/types";

export default function PotterTable({ potters }: { potters: Potter[] }) {
  return (
    <table className="w-full mt-5">
      <thead>
        <tr>
          <th className="px-2 py-3 text-left text-sm font-semibold"></th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Email</th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Hostel</th>
        </tr>
      </thead>
      <tbody>
        {potters.map((potter, index) => (
          <tr key={potter.userId} className="odd:bg-gray-200 ">
            <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
              {index + 1}
            </td>
            <td className="capitalize border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
              {potter.displayName}
            </td>
            <td className="lowercase border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
              {potter.email}
            </td>
            <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#212529]">
              {potter.hostel ? potter?.hostel?.name : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
