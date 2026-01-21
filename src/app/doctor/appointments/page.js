"use client";
import BASE_URL from '@/app/config';
import AppointmentTable from '@/components/AppointmentTable'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/DoctorSidebar'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DoctorAppointmentTable from '@/components/DoctorAppointmentTable';
import { TailSpin } from 'react-loader-spinner';

function page() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const docId = currentUser.profile._id;
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');

  const getAllApp = async() => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/appointment/doctor`, {id: docId});
      setAppointments(res.data.appointments);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

   if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
  }

  return (
     <div>
        <DoctorAppointmentTable appointments={appointments} />
     </div>
  )
}

export default page