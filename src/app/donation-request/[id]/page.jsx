"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Heart, Info, Send, User, Award, Activity } from 'lucide-react';
import { toast } from "react-toastify"; 
import { authClient } from '@/lib/auth-client';

export default function BloodRequestDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Hardcoded current user configuration block for dashboard identity mapping
  const currentUser = {
    name: "A K Biplob",
    email: "akbiplob24@gmail.com"
  };

  // -------------------------------------------------------------------------
  // 🩸 Fetch Specific Blood Request Details on Component Mount Lifecycle
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchRequestDetails = async () => {
      setLoading(true);
      try {
        const tokenObj = await authClient.token(); 
        const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj; 

        console.log("Strict Token String (Fetch):", tokenData); 

        const headers = {};
        if (tokenData) {
          headers.authorization = `Bearer ${tokenData}`;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-request/${id}`, { headers });
        
        if (!res.ok) {
          throw new Error(`Blood request not found. Status: ${res.status}`);
        }
        
        const data = await res.json();
        setRequest(data);
      } catch (err) {
        console.error("Error fetching blood request details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  // -------------------------------------------------------------------------
  // 💌 Handle Blood Donation Form Submission Request Pipeline
  // -------------------------------------------------------------------------
  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const donationPayload = {
      requestId: id, 
      bloodGroup: request?.bloodGroup || "N/A",
      hospitalName: request?.hospitalName || "Hospital",
      donorName: currentUser.name,
      donorEmail: currentUser.email,
      donationDate: formData.get('donationDate'),
      bagsDonated: formData.get('bagsDonated') || "1",
      message: formData.get('message')
    };

    try {
      const tokenObj = await authClient.token(); 
      const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj; 

      console.log("Strict Token String (Submit):", tokenData);

      const headers = {
        'Content-Type': 'application/json'
      };
      if (tokenData) {
        headers.authorization = `Bearer ${tokenData}`; 
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donation-requests`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(donationPayload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Your application to donate blood has been submitted successfully! 🩸`);
        router.push('/dashboard/my-donations'); 
      } else {
        toast.error(data.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting blood donation application:", error);
      toast.error("Something went wrong connecting to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-[#030712]">
        <Spinner label="Loading critical case matrix info..." className="text-[#ff0000]" size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-[#030712] px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/40 text-[#ff0000] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Request Not Found!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">The blood request might have been managed, fulfilled, or deleted by the author.</p>
          <button onClick={() => router.push('/all-requests')} className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer">
            Back to Active Cases
          </button>
        </motion.div>
      </div>
    );
  }

  const isManaged = request.status?.toLowerCase() === 'managed' || request.status?.toLowerCase() === 'fulfilled';
  const isCritical = request.urgency?.toLowerCase() === 'critical';

  return (
    <main className="py-12 min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button Operations */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#ff0000] dark:hover:text-[#ff0000] mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Go Back
        </button>

        {/* Main Interface Content Split Grid Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 🩸 Left Core Column: Patient & Transfusion Case Parameters */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-rose-500 to-red-600 dark:from-red-950/40 dark:to-rose-950/30 p-10 rounded-3xl text-center border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden min-h-[260px] flex flex-col justify-center items-center"
            >
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-rose-100 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-xs">
                  Required Blood Group
                </span>
                <h1 className="text-7xl font-black text-white drop-shadow-md select-none">
                  {request.bloodGroup}
                </h1>
                <p className="text-white/90 font-bold text-sm tracking-tight pt-1">
                  Target Requirement Count: {request.bagsCount || "1"} Bags
                </p>
              </div>

              <span className={`absolute top-6 right-6 text-xs font-black px-4 py-1.5 rounded-full text-white tracking-wider uppercase shadow-md ${isManaged ? 'bg-emerald-500' : isCritical ? 'bg-black/40 border border-white/30 animate-pulse' : 'bg-amber-500'}`}>
                {isManaged ? 'Fulfilled' : isCritical ? 'Critical Case' : 'Pending'}
              </span>
            </motion.div>

            {/* Transfusion Header Core Titles Block */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Patient: {request.patientName}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-bold text-[#ff0000] bg-rose-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <User size={12} /> Age: {request.patientAge || "N/A"} Yrs
                  </span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <Award size={12} /> Relation: {request.relation || "Patient"}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${isCritical ? 'text-red-600 bg-red-500/10' : 'text-amber-600 bg-amber-500/10'}`}>
                    <Activity size={12} /> Urgency: {request.urgency || "Normal"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wide">Target Deadline</span>
                <span className="text-base font-black text-[#ff0000] block mt-0.5">
                  {request.donationDate || "Immediate"}
                </span>
              </div>
            </div>

            {/* Quick Analytics Metadata Cards Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Blood Required</span>
                <span className="text-sm font-black mt-1 block text-[#ff0000]">{request.bloodGroup || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Quantity</span>
                <span className="text-sm font-black mt-1 block">{request.bagsCount || "1"} Bags</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Patient Age</span>
                <span className="text-sm font-black mt-1 block">{request.patientAge ? `${request.patientAge} Yrs` : "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Contact Verified</span>
                <span className="text-sm font-black mt-1 block text-emerald-500">Yes</span>
              </div>
            </div>

            {/* Extended Textual Placement Properties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <MapPin className="text-[#ff0000] flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Hospital & Location</span>
                  <span className="text-sm font-black block truncate">{request.hospitalName || "Not specified"}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <Calendar className="text-emerald-500 flex-shrink-0" size={20} />
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Scheduled Date</span>
                  <span className="text-sm font-black block">{request.donationDate || "Emergency Transfusion"}</span>
                </div>
              </div>
            </div>

            {/* Clinical Case Contextual Notes Section */}
            <div className="space-y-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80">
              <h3 className="text-base font-black">Medical Case Context / Reason</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {request.reason || "No specific detailed description available. Emergency blood replacement required for immediate operational needs. Verified donors are requested to submit commitments instantly."}
              </p>
            </div>
          </div>

          {/* 📋 Right Secondary Column: Blood Application / Commitment Form */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md space-y-5 sticky top-6"
            >
              <div>
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Heart size={18} className="text-[#ff0000] fill-rose-600" /> Apply to Donate Blood
                </h2>
                <p className="text-xs text-slate-400 mt-1">Submit your interest to support this case file.</p>
              </div>

              <form onSubmit={handleDonateSubmit} className="space-y-4">
                {/* Blood Group Target Identity Matrix (Disabled/Readonly Layout) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Required Group</label>
                  <input 
                    type="text" 
                    value={`${request.bloodGroup} (${request.bagsCount || 1} Bags Required)`}
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-[#ff0000] dark:text-rose-400 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Donor Full Identity Verification */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Donor Name</label>
                  <input 
                    type="text" 
                    value={currentUser.name} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Donor Registered Email Channel */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Donor Email</label>
                  <input 
                    type="email" 
                    value={currentUser.email} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Quantities Committed input tracker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold">Bags You Wish to Donate</label>
                  <input 
                    type="number" 
                    name="bagsDonated"
                    min="1"
                    max="10"
                    defaultValue="1"
                    required 
                    disabled={isManaged}
                    className="w-full bg-transparent dark:bg-slate-800/30 font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Preferred Donation Arrival Date Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold">Preferred Arrival Date</label>
                  <input 
                    type="date" 
                    name="donationDate" 
                    required 
                    disabled={isManaged}
                    className="w-full bg-transparent dark:bg-slate-800/30 font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-sm focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Context Notes to Patient Attendant */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold">Message / Special Notes to Attendant</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    required
                    disabled={isManaged}
                    placeholder="Provide details about your last donation date or contact number..."
                    className="w-full bg-transparent dark:bg-slate-800/30 font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:border-rose-500 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Core Transaction Submission Button Assembly */}
                <button 
                  type="submit"
                  disabled={isManaged || submitting} 
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 text-white shadow-md cursor-pointer ${
                    isManaged 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-[#ff0000] hover:bg-[#cc0000] active:scale-[0.99]'
                  }`}
                >
                  {submitting ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Send size={15} />
                      {isManaged ? 'Case Fulfilled' : `Confirm Donation`}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}