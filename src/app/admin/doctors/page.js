"use client";
import DoctorCards from "@/components/DoctorCards";
import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../config";
import { TailSpin } from "react-loader-spinner";

export default function page() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchDoctors = async() => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/api/doctor/`);
    setDoctors(res.data.doctors);
    setLoading(false);
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
            <DoctorCards doctors={doctors}/>
    </div>
  );
}
