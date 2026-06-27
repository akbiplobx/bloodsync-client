"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { authClient } from '@/lib/auth-client';
import { Calendar, Hospital, Send, X } from 'lucide-react';
import { Spinner } from "@heroui/react"; 

export default function DonationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal এর জন্য State
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [donorMessage, setDonorMessage] = useState("");

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
  } , [id]);

  // বাটনে ক্লিক করলে প্রথমে ইউজার চেক হবে এবং Modal ওপেন হবে
  const handleOpenModal = async (e) => {
    e.preventDefault();
    
    try {
      const session = await authClient.getSession();
      const user = session?.data?.user;

      if (!user?.email) {
        toast.error("Please login first to donate blood!");
        return;
      }

      setCurrentUser(user);
      setIsOpen(true); // Modal ওপেন করা হচ্ছে
    } catch (error) {
      console.error(error);
      toast.error("Authentication error.");
    }
  };

  // Modal এর ভেতর Confirm বাটনে ক্লিক করলে এই ফাংশনটি রান হবে
  const handleConfirmDonate = async () => {
    setSubmitting(true);

    try {
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
        setIsOpen(false); 
        
        if (currentUser?.role === 'volunteer') {
          router.push('/donation-requests'); 
        } else {
          router.push('/dashboard/my-donations');
        }
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
    <main className="py-6 bg-slate-50 min-h-screen flex items-center justify-center relative">
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
          <form onSubmit={handleOpenModal} className="space-y-2.5 pt-1">
            <textarea 
              name="message" 
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              placeholder="Write a quick message to recipient..." 
              className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-red-400 outline-none resize-none" 
              rows="2"
            ></textarea>
            
            <button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Send size={14}/> Donate Now
            </button>
          </form>

        </div>
      </div>

      {/* --- Custom Tailwind Modal --- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Confirm Your Donation</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-500">By confirming, your status will change to <span className="font-bold text-amber-600">In Progress</span>.</p>
              
              <div className="bg-slate-50 p-3 rounded-xl border space-y-2 text-slate-700">
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-slate-400 font-bold">Donor Name</span>
                  <span className="font-semibold">{currentUser?.name || "Anonymous Donor"}</span>
                </div>
                <div className="border-t pt-1.5">
                  <span className="text-[10px] uppercase tracking-wider block text-slate-400 font-bold">Donor Email</span>
                  <span className="font-semibold text-slate-600">{currentUser?.email}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDonate}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}