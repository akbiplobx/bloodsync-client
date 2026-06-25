"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { authClient } from '@/lib/auth-client';
import { Calendar, Hospital, Send } from 'lucide-react';
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
     
      const session = await authClient.getSession();
      const currentUser = session?.data?.user;

      if (!currentUser?.email) {
        toast.error("Please login first to donate blood!");
        setSubmitting(false);
        return;
      }

      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/public/donate/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorEmail: currentUser.email, 
          donorName: currentUser.name || "Anonymous Donor",
          donorMessage: donorMessage || ""
        })
      });

      const result = await res.json();
      
      if (result.success) {
        toast.success("Donation confirmed! Status is now In Progress. 🎉");
        router.push('/dashboard/my-donations'); 
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center flex justify-center"><Spinner label="Loading..." /></div>;
  if (!request) return <div className="p-10 text-center">No Request Found</div>;

  return (
    <main className="py-6 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-lg">👤</div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{request.patientName}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recipient</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 px-3 py-1 rounded-lg text-center">
              <p className="text-lg font-black text-red-600">{request.bloodGroup}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Hospital className="text-green-600 shrink-0" size={16}/>
              <div>
                <p className="font-semibold text-slate-800">{request.hospitalName || "Hospital"}</p>
                <p className="text-slate-500">{request.location}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2 font-medium text-slate-600">
              <Calendar size={14} className="text-red-500"/> 
              <div>
                <span className="text-[10px] block text-slate-400">DONATION DATE</span>
                <span>{request.donationDate || "N/A"}</span>
              </div>
            </div>
          </div>

          {request.description && (
            <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100/50 text-xs">
              <p className="italic text-slate-600">"{request.description}"</p>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleDonate} className="space-y-2.5 pt-1">
            <textarea 
              name="message" 
              placeholder="Write a quick message to recipient..." 
              className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-red-400 outline-none resize-none" 
              rows="2"
            ></textarea>
            
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Processing..." : <><Send size={14}/> Donate Now</>}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}