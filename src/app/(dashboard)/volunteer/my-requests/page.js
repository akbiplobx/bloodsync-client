"use client";
import React, { useEffect, useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function MyDonationsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // ১. Better-Auth থেকে লগইন থাকা ইউজারের ইমেইল নেওয়া
        const session = await authClient.getSession();
        const currentUser = session?.data?.user;
        const userEmail = currentUser?.email || "akbiplob24@gmail.com"; // ব্যাকআপ ইমেইল

        // ২. আমাদের তৈরি করা নতুন টোকেন-লেস এপিআইতে হিট করা
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/my-donations?email=${userEmail}`);
        if (!res.ok) throw new Error("Failed to load requests");
        
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading blood requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // স্ট্যাটাস কাউন্টার ট্র্যাকিং (ইন-প্রোগ্রেস সহ)
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
  const inProgressCount = requests.filter(r => r.status?.toLowerCase() === 'inprogress').length;
  const approvedCount = requests.filter(r => r.status?.toLowerCase() === 'approved' || r.status?.toLowerCase() === 'accepted').length;

  // স্ট্যাটাস অনুযায়ী ব্যাজ ডিজাইন
  const getStatusBadge = (status = 'Pending') => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'approved' || lowerStatus === 'accepted') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
    }
    if (lowerStatus === 'inprogress') {
      return 'bg-amber-50 text-amber-600 border border-amber-200/60';
    }
    return 'bg-blue-50 text-blue-600 border border-blue-200/60';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-white">
      
      {/* Header */}
      <div>
        
        <h1 className="text-3xl font-black tracking-tight">
          My <span className="text-[#ff0000]">Requests</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Track the screening and approval status of all your submitted blood donation applications.
        </p>
      </div>

      {/* Analytics Counter */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs text-center space-y-1">
          <p className="text-2xl md:text-3xl font-black">{totalRequests}</p>
          <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">Total Donations</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs text-center space-y-1">
          <p className="text-2xl md:text-3xl font-black text-amber-500">{inProgressCount}</p>
          <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">In Progress</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs text-center space-y-1">
          <p className="text-2xl md:text-3xl font-black text-emerald-500">{approvedCount}</p>
          <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">Accepted</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 md:p-5">Target Blood Group</th>
                <th className="p-4 md:p-5">Hospital Name</th>
                <th className="p-4 md:p-5">Bags Committed</th>
                <th className="p-4 md:p-5">Donation Date</th>
                <th className="p-4 md:p-5">Status</th>
                <th className="p-4 md:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 dark:text-slate-300 font-medium divide-y divide-slate-100 dark:divide-slate-800/60">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                    You haven't submitted any blood donation applications yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const currentStatus = req.status || 'Pending';
                  const isInProgress = currentStatus.toLowerCase() === 'inprogress';
                  const isApproved = currentStatus.toLowerCase() === 'approved' || currentStatus.toLowerCase() === 'accepted';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 md:p-5 font-bold text-[#ff0000] dark:text-[#ff0000]">
                        {req.bloodGroup}
                      </td>
                      <td className="p-4 md:p-5 text-slate-800 dark:text-slate-200 max-w-[220px] truncate">
                        {req.hospitalName}
                      </td>
                      <td className="p-4 md:p-5 text-slate-500 dark:text-slate-400">
                        {req.bagsCount || "1"} Bag
                      </td>
                      <td className="p-4 md:p-5 text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                        {req.donationDate}
                      </td>
                      <td className="p-4 md:p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusBadge(currentStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isApproved ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <button className="inline-flex items-center gap-1.5 py-1.5 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer">
                          <Eye size={13} /> View Post
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}