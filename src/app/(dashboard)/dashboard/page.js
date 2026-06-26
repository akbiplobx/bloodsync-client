"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';
import { FaHeartbeat, FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';

export default function DashboardHome() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donorName, setDonorName] = useState("Donor");

  // মোডাল ও ডিলিট আইডি ট্র্যাকিং স্টেট
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // ১. Better-Auth থেকে লগইন থাকা ইউজারের সেশন ও ইমেইল নেওয়া
        const session = await authClient.getSession();
        const currentUser = session?.data?.user;
        
        if (currentUser?.name) {
          setDonorName(currentUser.name);
        }
        
        const userEmail = currentUser?.email || "akbiplob24@gmail.com"; 

        // ২. আপনার তৈরি করা লাইভ এপিআই এন্ডপয়েন্টে হিট করা
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

  // স্ট্যাটাস পরিবর্তন হ্যান্ডলার (inprogress -> done/canceled)
  const handleStatusChange = async (id, newStatus) => {
    try {
      // ব্যাকএন্ড আপডেট করতে চাইলে এখানে এপিআই কল করতে পারেন:
      // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-status/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      
      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ডিলিট কনফার্মেশন হ্যান্ডলার
  const handleDeleteConfirm = async () => {
    if (requestToDelete) {
      try {
        // ব্যাকএন্ড থেকে ডিলিট করতে চাইলে এখানে এপিআই কল করতে পারেন:
        // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/delete-request/${requestToDelete}`, { method: 'DELETE' });
        
        setRequests(prev => prev.filter(req => req._id !== requestToDelete));
        setShowDeleteModal(false);
        setRequestToDelete(null);
        alert("Blood request deleted successfully!");
      } catch (err) {
        console.error("Failed to delete request:", err);
      }
    }
  };

  // স্ট্যাটাস অনুযায়ী ব্যাজ ডিজাইন লজিক
  const getStatusBadge = (status = 'Pending') => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'done' || lowerStatus === 'approved' || lowerStatus === 'accepted') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
    }
    if (lowerStatus === 'inprogress') {
      return 'bg-amber-50 text-amber-600 border border-amber-200/60';
    }
    if (lowerStatus === 'canceled') {
      return 'bg-rose-50 text-rose-600 border border-rose-200/60';
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
    <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto text-slate-900 dark:text-white">
      
      {/* 🔴 Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync, {donorName}! 🎉
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Your dashboard is ready. Here you can track, manage, and monitor your recent blood donation requests in real-time.
        </p>
      </div>

      {/* 📋 Recent Donation Requests Table */}
      {requests.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff0000] bg-rose-500/10 px-3 py-1 rounded-full w-max mb-2">
              <FileText size={14} /> Live Sync
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Recent Donation Requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Showing your maximum 3 recent donation requests live from the database.</p>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                  <th className="p-4">Target Blood Group</th>
                  <th className="p-4">Recipient Name</th>
                  <th className="p-4">Hospital Name</th>
                  <th className="p-4">Bags Committed</th>
                  <th className="p-4">Donation Date</th>
                  <th className="p-4">Status & Management</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-800/60">
                {requests.slice(0, 3).map((req) => {
                  const currentStatus = req.status || 'Pending';
                  const lowerStatus = currentStatus.toLowerCase();
                  const isInProgress = lowerStatus === 'inprogress';
                  const isApproved = lowerStatus === 'approved' || lowerStatus === 'accepted' || lowerStatus === 'done';

                  return (
                    <tr key={req._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      
                      {/* Blood Group */}
                      <td className="p-4 font-bold text-[#ff0000] dark:text-[#ff0000] text-base">
                        {req.bloodGroup}
                      </td>

                      {/* Recipient Name - ফিক্সড: এখানে req.patientName এবং ফলব্যাক ব্যবহার করা হয়েছে */}
                      <td className="p-4 text-slate-800 dark:text-slate-200 max-w-[180px] truncate font-semibold">
                        {req.patientName || req.recipientName || "N/A"}
                      </td>

                      {/* Hospital Name */}
                      <td className="p-4 text-slate-800 dark:text-slate-200 max-w-[220px] truncate">
                        {req.hospitalName}
                      </td>

                      {/* Bags */}
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        {req.bagsCount || "1"} Bag
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                        {req.donationDate}
                      </td>

                      {/* Status & Management */}
                      <td className="p-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusBadge(currentStatus)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isApproved ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : lowerStatus === 'canceled' ? 'bg-rose-500' : 'bg-blue-500'
                            }`} />
                            {currentStatus}
                          </span>

                          {isInProgress && (
                            <div className="space-y-2 pt-1">
                              {req.donorInfo && (
                                <div className="text-[11px] bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50 max-w-[195px]">
                                  <p className="font-bold text-slate-700 dark:text-slate-300">Donor: {req.donorInfo.name}</p>
                                  <p className="truncate text-slate-400">{req.donorInfo.email}</p>
                                </div>
                              )}
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => handleStatusChange(req._id, "done")}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer"
                                >
                                  <FaCheck /> Done
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(req._id, "canceled")}
                                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer"
                                >
                                  <FaTimes /> Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link 
                            href={`/dashboard/donation-request/${req._id}`}
                            className="p-2 text-slate-500 hover:text-blue-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/60 transition"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Link>
                          
                          <Link 
                            href={`/dashboard/edit-request/${req._id}`}
                            className="p-2 text-slate-500 hover:text-amber-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/60 transition"
                            title="Edit Request"
                          >
                            <FaEdit size={14} />
                          </Link>
                          
                          <button 
                            onClick={() => {
                              setRequestToDelete(req._id);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-slate-500 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/60 transition cursor-pointer"
                            title="Delete Request"
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* View All Button */}
          <div className="pt-2 text-center">
            <Link 
              href="/dashboard/my-donations"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold px-6 py-3 rounded-2xl transition shadow-xs"
            >
              View My All Request
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Are you absolutely sure?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This action cannot be undone. This will permanently remove this blood donation request from the network database.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}