"use client";
import BASE_URL from "@/app/config";
import AppointmentTable from "@/components/AppointmentTable";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";


export default function page() {
  const [appointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAll = useCallback(async() => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/appointment/`);
      setAllAppointments(res.data.appointments);
      setLoading(false);
    } catch (error) {
      toast.success(error.response.data.message);
    }
  }, []);


  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
  }

  return (
    <div className=" min-h-screen">
            <AppointmentTable appointments={appointments}/>
    </div>
  );
}
