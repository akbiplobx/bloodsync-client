"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { authClient } from '@/lib/auth-client';
import { Calendar, Clock, MapPin, Hospital, Send } from 'lucide-react';
import { Spinner } from "@heroui/react"; 

export default function DonationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donation-request/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRequest(data);
      } catch (err) { 
        console.error(err); 
        toast.error("Error loading data");
      } finally { setLoading(false); }
    };
    if (id) fetchData();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const donorMessage = e.target.message.value;

    try {
      const token = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          requestId: id,
          patientName: request.patientName,
          donationDate: new Date().toISOString().split('T')[0],
          donorMessage: donorMessage
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Donation submitted successfully! 🎉");
        router.push('/dashboard/my-donations'); 
      } else {
        toast.error(result.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center flex justify-center"><Spinner label="Loading..." /></div>;
  if (!request) return <div className="p-10 text-center">No Request Found</div>;

  return (
    <main className="py-8 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-xl">👤</div>
              <div>
                <h2 className="text-xl font-black">{request.patientName}</h2>
                <p className="text-xs text-slate-400 font-bold">RECIPIENT • PATIENT</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-center">
              <p className="text-[10px] font-bold text-red-600 uppercase">Blood Group</p>
              <p className="text-xl font-black text-red-600">{request.bloodGroup}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t pt-6">
            <div className="flex items-start gap-3">
              <Hospital className="text-green-600 mt-0.5" size={18}/>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Hospital</p>
                <p className="text-sm font-bold">{request.hospitalName}</p>
                <p className="text-xs text-slate-500">{request.location}</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Calendar size={16}/> {request.date || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Clock size={16}/> {request.time || "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 my-6">
            <p className="text-[10px] font-bold text-amber-700 uppercase mb-0.5">Request Message</p>
            <p className="italic text-sm text-slate-700">"{request.message || "No message available"}"</p>
          </div>
          
          <form onSubmit={handleDonate} className="space-y-3">
            <textarea 
              name="message" 
              placeholder="write a message..." 
              className="w-full p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-red-200 outline-none" 
              rows="3"
            ></textarea>
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Processing..." : <><Send size={16}/> Donate Now</>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}