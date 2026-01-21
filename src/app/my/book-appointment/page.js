"use client";

import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "@/app/config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe public key
const stripePromise = loadStripe(
  "pk_test_51SLF6EBmxKczH0AGtJe48NzN4nJPTSWS9ZXvEWjs5UqIGHf6M980NxTWw962SembA3kC4UGtdULbA5tL4EAgh4gB00sEh70pGa"
);

// ✅ Stripe Payment Form Component
const StripeForm = ({ docFee, doctorId, currentUser, date, time, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create payment intent
      const res = await axios.post(`${BASE_URL}/api/checkout/create-payment-intent`, {
        amount: docFee * 100, // Stripe expects cents
      });

      const clientSecret = res.data.clientSecret;
      console.log('im okay', clientSecret);
      // 2️⃣ Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3️⃣ Create appointment with paymentStatus = "paid"
        await axios.post(`${BASE_URL}/api/appointment/create`, {
          patient: currentUser._id,
          doctor: doctorId,
          date,
          time,
          fee: docFee,
          paymentStatus: "paid",
          paymentMethod: "stripe",
        });
  
        toast.success("✅ Payment successful & Appointment booked!");
        onSuccess(); // reset form in parent
      }
    } catch (err) {
      console.error(err);
      setError("Payment or booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="border border-gray-300 rounded-md p-3 bg-white">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-black text-white w-full py-3 rounded hover:bg-gray-800"
      >
        {loading ? "Processing..." : `Pay $${docFee}`}
      </button>
    </form>
  );
};

// ✅ Main Appointment Booking Page
export default function Page() {
  const { currentUser } = useSelector((state) => state.user);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [docFee, setDocFee] = useState(0);
  const [form, setForm] = useState({ date: "", time: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Fetch doctors and doctor fee dynamically
  useEffect(() => {
    (async function fetch() {
      try {
        const res = await axios.get(`${BASE_URL}/api/doctor/`);
        setDoctors(res.data.doctors || []);

        if (doctor) {
          const response = await axios.get(`${BASE_URL}/api/doctor/${doctor}`);
          setDocFee(response.data.doctor?.fee || 0);
        }
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    })();
  }, [doctor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ date: "", time: "" });
    setDoctor("");
    setDocFee(0);
  };

  // Cash payment flow
  const handleCashSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time || !doctor) {
      return toast.error("Please fill all fields");
    }

    try {
      await axios.post(`${BASE_URL}/api/appointment/create`, {
        patient: currentUser._id,
        doctor,
        date: form.date,
        time: form.time,
        fee: docFee,
        paymentStatus: "pending",
        paymentMethod: "cash",
      });

      toast.success("Appointment booked! Payment pending (Cash on Delivery)");
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Booking failed. Try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

      {/* Patient Info */}
      <div className="bg-gray-100 p-3 rounded mb-4">
        <p><b>Patient:</b> {currentUser?.name}</p>
        <p><b>Age:</b> {currentUser?.profile?.age || "N/A"}</p>
        <p><b>Blood Group:</b> {currentUser?.profile?.bloodGroup || "N/A"}</p>
      </div>

      {/* Select Doctor */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Doctor</label>
        <select
          required
          className="w-full border p-2 rounded"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.user.name}</option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="card">Card (Stripe)</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>

      {/* Payment / Stripe */}
      {paymentMethod === "card" && doctor && docFee > 0 && form.date && form.time ? (
        <Elements stripe={stripePromise}>
          <StripeForm
            docFee={docFee}
            doctorId={doctor}
            currentUser={currentUser}
            date={form.date}
            time={form.time}
            onSuccess={resetForm}
          />
        </Elements>
      ) : paymentMethod === "cash" ? (
        <button
          onClick={handleCashSubmit}
          className="bg-red-500 text-white w-full py-3 rounded hover:bg-red-600 mb-4"
        >
          Book Appointment (Cash)
        </button>
      ) : null}

      {/* Optional: show doctor fee */}
      {doctor && docFee > 0 && (
        <p className="text-gray-700 mt-2">
          <b>Doctor Fee:</b> ${docFee}
        </p>
      )}
    </div>
  );
}
