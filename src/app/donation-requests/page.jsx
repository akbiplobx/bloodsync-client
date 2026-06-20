"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { Spinner } from "@heroui/react"; 
import { motion } from "framer-motion"; 

const AllBloodRequests = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All Groups");
  const [urgencyLevel, setUrgencyLevel] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRequestsFromDatabase = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm && searchTerm.trim() !== "") queryParams.append("search", searchTerm.trim());
      if (selectedBloodGroup && selectedBloodGroup !== "All Groups" && selectedBloodGroup.trim() !== "") queryParams.append("bloodGroup", selectedBloodGroup);
      if (urgencyLevel && urgencyLevel !== "all" && urgencyLevel.trim() !== "") queryParams.append("urgency", urgencyLevel);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-requests?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Database fetching error:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const delayDebounce = setTimeout(() => {
      fetchRequestsFromDatabase();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedBloodGroup, urgencyLevel, mounted]);

  if (!mounted) return null;

  return (
    <section suppressHydrationWarning className="py-16 min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-[95rem]">
        
        <div className="mb-6">
          <span className="text-xs font-bold text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Emergency Dashboard
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-3">
            Search <span className="text-orange-600">Blood Requests</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-400 text-sm mt-2 font-medium">
            {requests.length} active emergency blood requests looking for donors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm mb-12 transition-colors duration-300">
          <div className="flex flex-col justify-end">
            <label className="block font-black text-xs text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Search by hospital or area</label>
            <input
              type="text"
              placeholder="Type location or hospital name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-orange-500 transition-all text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Filter by Blood Group</label>
            <select 
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none text-sm"
            >
              <option value="All Groups">All Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Filter by Urgency</label>
            <select 
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value)}
              className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none text-sm"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical (Immediate)</option>
              <option value="normal">Normal (Scheduled)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner label="Scanning database for active cases..." className="text-orange-600" size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requests.length > 0 ? (
              requests.map((req) => {
                const requestId = req._id || req.id;
                const isManaged = (req.status || '').toLowerCase() === 'managed';
                const isCritical = (req.urgency || '').toLowerCase() === 'critical';
                
                return (
                  <motion.div 
                    key={requestId} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    whileHover={{ y: -8 }} 
                    transition={{ duration: 0.4 }}
                    onClick={() => router.push(`/blood-request/${requestId}`)}
                    className="rounded-3xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 flex flex-col hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-950 dark:to-orange-950/20 h-44 relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50">
                      <div className="text-center">
                        <span className="block text-5xl font-black text-orange-600 dark:text-orange-500">
                          {req.bloodGroup}
                        </span>
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                          {req.bagsCount || "1"} {parseInt(req.bagsCount) > 1 ? "Bags" : "Bag"} Required
                        </span>
                      </div>
                      <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white ${isManaged ? 'bg-emerald-500/90' : isCritical ? 'bg-orange-600 animate-pulse' : 'bg-amber-500/90'}`}>
                        {isManaged ? 'Donor Found' : isCritical ? 'Critical' : 'Pending'}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-orange-600 uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full">
                          {req.relation || "Patient Case"}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">
                          Need: {req.donationDate || "Immediate"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{req.patientName}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 font-medium truncate">
                        <strong className="text-slate-800 dark:text-slate-400">📍 Hospital:</strong> {req.hospitalName}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/donation-details/${requestId}`} className="flex-1">
                          <button className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer">
                            View
                          </button>
                        </Link>
                        <button 
                          disabled={isManaged} 
                          onClick={() => router.push(`/donation-details/${requestId}`)} 
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-white cursor-pointer ${isManaged ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20'}`}
                        >
                          {isManaged ? 'Fulfilled' : 'Donate'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium italic">No requests found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBloodRequests;