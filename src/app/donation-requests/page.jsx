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

  // Fetch emergency blood requests from the database based on search and filters
  const fetchRequestsFromDatabase = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // সার্চ টার্ম থাকলে অ্যাড হবে
      if (searchTerm && searchTerm.trim() !== "") {
        queryParams.append("search", searchTerm.trim());
      }
      
      // 💡 "All Groups" না হলে কেবল নির্দিষ্ট গ্রুপ ব্যাকএন্ডে পাঠানো হবে
      if (selectedBloodGroup && selectedBloodGroup !== "All Groups" && selectedBloodGroup.trim() !== "") {
        queryParams.append("bloodGroup", selectedBloodGroup);
      }
      
      // "all" না হলে নির্দিষ্ট আরজেন্সি পাঠানো হবে
      if (urgencyLevel && urgencyLevel !== "all" && urgencyLevel.trim() !== "") {
        queryParams.append("urgency", urgencyLevel);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-requests?${queryParams.toString()}`);
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

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
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-6">
          <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Emergency Dashboard
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-3">
            Search <span className="text-rose-600">Blood Requests</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-400 text-sm mt-2 font-medium">
            {requests.length} active emergency blood requests looking for donors
          </p>
        </div>

        {/* Filter & Search Bar Box Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm mb-12 transition-colors duration-300">
          
          {/* Search Input Filter */}
          <div className="flex flex-col justify-end">
            <label className="block font-black text-xs text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Search by hospital or area
            </label>
            <input
              type="text"
              placeholder="Type location or hospital name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all text-sm outline-none"
            />
          </div>

          {/* Filter by Blood Group option drop down */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Filter by Blood Group
            </label>
            <div className="relative">
              <select 
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all cursor-pointer appearance-none text-sm"
              >
                <option value="All Groups" className="bg-white dark:bg-slate-900">All Groups</option>
                <option value="A+" className="bg-white dark:bg-slate-900">A+</option>
                <option value="A-" className="bg-white dark:bg-slate-900">A-</option>
                <option value="B+" className="bg-white dark:bg-slate-900">B+</option>
                <option value="B-" className="bg-white dark:bg-slate-900">B-</option>
                <option value="AB+" className="bg-white dark:bg-slate-900">AB+</option>
                <option value="AB-" className="bg-white dark:bg-slate-900">AB-</option>
                <option value="O+" className="bg-white dark:bg-slate-900">O+</option>
                <option value="O-" className="bg-white dark:bg-slate-900">O-</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Sort Options filtering by Urgency Status */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Filter by Urgency
            </label>
            <div className="relative">
              <select 
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all cursor-pointer appearance-none text-sm"
              >
                <option value="all" className="bg-white dark:bg-slate-900">All Levels</option>
                <option value="critical" className="bg-white dark:bg-slate-900">Critical (Immediate)</option>
                <option value="normal" className="bg-white dark:bg-slate-900">Normal (Scheduled)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Grid System / Loading Spinner Layout */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner label="Scanning database for active cases..." className="text-rose-600" size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    {/* Centered Large Emblem for Blood Group Identity */}
                    <div className="bg-gradient-to-br from-rose-50 to-red-100 dark:from-slate-950 dark:to-rose-950/20 h-44 relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50">
                      <div className="text-center">
                        <span className="block text-5xl font-black text-rose-600 dark:text-rose-500">
                          {req.bloodGroup}
                        </span>
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                          {req.bagsCount || "1"} {parseInt(req.bagsCount) > 1 ? "Bags" : "Bag"} Required
                        </span>
                      </div>
                      <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white ${isManaged ? 'bg-emerald-500/90' : isCritical ? 'bg-rose-600 animate-pulse' : 'bg-amber-500/90'}`}>
                        {isManaged ? 'Donor Found' : isCritical ? 'Critical' : 'Pending'}
                      </span>
                    </div>

                    {/* Information Content Segment */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-rose-600 uppercase tracking-wider bg-rose-500/10 px-3 py-1 rounded-full">
                          {req.relation || "Patient Case"}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">
                          Need: {req.donationDate || "Immediate"}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">
                        {req.patientName} ({req.patientAge ? `${req.patientAge} Yrs` : "Age N/A"})
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 font-medium truncate">
                        <strong className="text-slate-800 dark:text-slate-400">📍 Hospital:</strong> {req.hospitalName}
                      </p>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 line-clamp-2">
                        {req.reason || "Emergency request for blood transfusion. Genuine donors are requested to contact directly."}
                      </p>
                      
                      {/* Operational Primary CTA Grid */}
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/donation-details/${requestId}`} className="flex-1">
                          <button className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer">
                            View Details
                          </button>
                        </Link>
                        
                        <button 
                          disabled={isManaged} 
                          onClick={() => router.push(`/donation-details/${requestId}`)} 
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-white cursor-pointer ${
                            isManaged 
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none' 
                              : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20'
                          }`}
                        >
                          {isManaged ? 'Fulfilled' : 'Donate Now'}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium italic">
                  No emergency blood requests matched your filtered options.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBloodRequests;