"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { Eye, Edit3, HeartHandshake, Trash2, Plus, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { toast } from "react-toastify"; 
import { authClient } from '@/lib/auth-client'; 

export default function MyRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate authorization headers with valid JWT token
  const getAuthHeaders = async () => {
    const tokenObj = await authClient.token();
    const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (tokenData) {
      headers.authorization = `Bearer ${tokenData}`;
    }
    return headers;
  };

  // Fetch only the blood requests created by the logged-in user
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-requests`, { 
        method: 'GET',
        headers: headers,
        cache: 'no-store' 
      });

      if (!res.ok) throw new Error("Failed to fetch requests");
      
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching blood requests:", err);
      setRequests([]); 
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle analytics counting logic for different statuses
  const totalRequests = requests.length;
  const pendingCount = requests.filter(req => (req.status || '').toLowerCase() === 'pending').length;
  const managedCount = requests.filter(req => (req.status || '').toLowerCase() === 'managed').length;

  // Confirm delete dialog using toast alert notifications
  const confirmDeleteToast = (id, patientName) => {
    toast.info(
      <div className="flex flex-col gap-2 p-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Are you sure you want to delete request for <span className="text-[#ff0000]">"{patientName}"</span>?
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => toast.dismiss()} 
            className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:opacity-80 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              toast.dismiss();
              proceedToDelete(id);
            }} 
            className="px-3 py-1.5 text-xs font-bold bg-rose-500 text-white rounded-xl hover:bg-[#ff0000] transition-all shadow-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  // Connect to backend endpoint to execute the request deletion
  const proceedToDelete = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-request/${id}`, { 
        method: 'DELETE',
        headers: headers
      });
      
      if (res.ok) {
        setRequests(requests.filter(item => (item._id || item.id) !== id));
        toast.success("Blood request deleted successfully! 🗑️");
      } else {
        toast.error("Unauthorized or could not delete from backend.");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Something went wrong connecting to server.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner label="Loading your requests..." className="text-[#ff0000]" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Header section content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff0000] bg-rose-500/10 px-3 py-1 rounded-full w-max mb-2">
            <LayoutDashboard size={14} /> User Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            My Blood <span className="text-[#ff0000]">Requests</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track and manage your posted emergency blood requests in real time.
          </p>
        </div>
        
        <Link href="/dashboard/create-request">
          <button className="flex items-center justify-center gap-2 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all text-sm w-full sm:w-auto cursor-pointer">
            <Plus size={18} /> Create Request
          </button>
        </Link>
      </div>

      {/* Analytics count showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center space-y-1">
          <p className="text-3xl font-black text-[#ff0000]">{totalRequests}</p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Requests</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center space-y-1">
          <p className="text-3xl font-black text-amber-500">{pendingCount}</p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Still Looking (Pending)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center space-y-1">
          <p className="text-3xl font-black text-emerald-500">{managedCount}</p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Donor Found (Managed)</p>
        </div>
      </div>

      {/* Grid view containing requests or dynamic placeholder fallback */}
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80">
          <p className="text-slate-400 font-medium">No blood requests found. Create a new one if needed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const requestId = request._id || request.id;
            const currentStatus = (request.status || 'Pending').toLowerCase();
            const isManaged = currentStatus === 'managed';

            return (
              <motion.div
                key={requestId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300"
              >
                {/* Visual blood group emblem container layout */}
                <div className="h-40 bg-gradient-to-br from-rose-50 to-red-100 dark:from-slate-950 dark:to-rose-950/20 relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50">
                  <div className="text-center">
                    <span className="block text-4xl font-black text-[#ff0000] dark:text-rose-500 drop-shadow-sm">
                      {request.bloodGroup || "N/A"}
                    </span>
                    <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      {request.bagsCount || "0"} {parseInt(request.bagsCount) > 1 ? "Bags" : "Bag"} Required
                    </span>
                  </div>
                  <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm ${isManaged ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {request.status || 'Pending'}
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight truncate mb-1">
                      {request.patientName || "Unknown Patient"}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                      📍 {request.hospitalName || "Hospital Name N/A"}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                      Deadline: {request.donationDate || "Emergency"}
                    </p>
                  </div>

                  {/* Operational UI target actions setup */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => router.push(`/blood-request/${requestId}`)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      
                      <button 
                        onClick={() => router.push(`/dashboard/edit-request/${requestId}`)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        <Edit3 size={14} /> Edit Request
                      </button>
                    </div>

                    <div className="grid grid-cols-1">
                      <button 
                        onClick={() => confirmDeleteToast(requestId, request.patientName || "this request")}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 border border-rose-500/20 rounded-xl text-xs font-bold bg-rose-500/5 hover:bg-rose-500/10 text-[#ff0000] transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} /> Delete Emergency Request
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}