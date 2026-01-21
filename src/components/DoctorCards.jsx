"use client";
import { useRouter } from "next/navigation";
import { FaStethoscope, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function DoctorCards({doctors}) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Doctors</h2>
        <button onClick={() => router.push('/admin/add-doctor')} className="bg-blue-600 text-white p-2 rounded-xl px-4 cursor-pointer">Add Doctor +</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative mx-auto w-24 h-24">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="rounded-full w-24 h-24 object-cover mx-auto border-4 border-blue-100"
              />
              <span className="absolute -bottom-2 right-2 bg-green-400 w-3 h-3 rounded-full border-2 border-white"></span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {doctor.user.name}
            </h3>
            <p className="text-blue-500 text-sm font-medium flex justify-center items-center gap-2 mt-1">
              <FaStethoscope /> {doctor.specialty}
            </p>

            <div className="mt-4 text-gray-500 text-sm space-y-1">
              <p>🏥 JHC CLINIC</p>
              <p>🩺 Experience: {doctor.experience} Years</p>
            </div>

            <div className="flex justify-center gap-4 mt-5">
              <a
                href={`mailto:${doctor.email}`}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                title="Email"
              >
                <FaEnvelope size={15} />
              </a>
              <a
                href={`tel:${doctor.phone}`}
                className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
                title="Call"
              >
                <FaPhoneAlt size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
