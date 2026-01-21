import { FaTimes } from "react-icons/fa";

export default function PatientsTable({ patients }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">My Patients</h2>

      <table className="w-full text-sm text-gray-600">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3">Name</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Age</th>
            <th className="pb-3">Gender</th>
            <th className="pb-3">Phone</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {patients?.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="flex items-center gap-2">
                <img
                  src={p?.image}
                  alt="patient"
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {p?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {p.patient?.email}
                  </p>
                </div>
              </td>

              <td>{p.email}</td>

              

              <td>{p?.profile?.age || 'N/A'}</td>

              <td>
                <span
                
                >
                  {p?.profile?.gender}
                </span>
              </td>

              <td>
                <span
                  
                >
                  {p.profile?.phone}
                </span>
              </td>

              <td>
                <button className="bg-red-100 text-red-500 p-1.5 rounded-md hover:bg-red-200">
                  <FaTimes size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
