"use client";
import BASE_URL from "@/app/config";
import PatientTable from "@/components/PatientTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";


export default function page() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPatients = async() => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/patient/`);
      setPatients(res.data.patients);
      setLoading(false)
    } catch (error) {
      toast.error(error.response.error.message || "feilds to get users");
    }
  }

  const removePatientFromList = (id) => {
  setPatients(prev =>
    prev.filter(patient => patient._id !== id)
  );
};


  useEffect(() => {
    fetchPatients();
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
     <PatientTable allPatients={patients} onDeletePatient={removePatientFromList}/>
    </div>
  );
}
