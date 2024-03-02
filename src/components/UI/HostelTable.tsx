import { Hostel } from "@/types";

export default function HostelTable({ hostels }: { hostels: Hostel[] }) {
  return (
    <table className="w-full mt-5">
      <thead>
        <tr>
          <th className="px-2 py-3 text-left text-sm font-semibold"></th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-2 py-3 text-left text-sm font-semibold">
            No of rooms
          </th>
          <th className="px-2 py-3 text-left text-sm font-semibold">
            Persons per room
          </th>
          <th className="px-2 py-3 text-left text-sm font-semibold">Potter</th>
        </tr>
      </thead>
      <tbody>
        {hostels.map((hostel, index) => (
          <tr key={hostel.id} className="odd:bg-gray-200 ">
            <td className="border-t border-t-[#DEE2E6] px-2 py-3 text-left text-sm text-[#333333]">
              {index + 1}
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
    </table>
  );
}
