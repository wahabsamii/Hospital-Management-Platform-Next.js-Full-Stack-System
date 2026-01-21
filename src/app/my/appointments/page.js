"use client";
import BASE_URL from '@/app/config';
import AppointmentTable from '@/components/AppointmentTable'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/UserSidebar'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

function page() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const getAllApp = async() => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/appointment/my`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
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
          <AppointmentTable appointments={appointments}/>
    </div>
  )
}

export default page