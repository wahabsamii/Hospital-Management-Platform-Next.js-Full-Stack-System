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
import PatientsTable from '@/components/PatientsTable';
import { TailSpin } from 'react-loader-spinner';

function page() {
  const { currentUser } = useSelector((state) => state.user);
  const docId = currentUser.profile._id;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const getAllApp = async() => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/doctor/mypatients`, {id: docId});
      setPatients(res.data.patients);
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
        <PatientsTable patients={patients}/>
    </div>
  )
}

export default page