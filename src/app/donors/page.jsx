"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spinner } from "@heroui/react"; 
import { motion } from "framer-motion"; 

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
};

export default function AllDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donors`)
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading all donors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading all heroes..." color="danger" size="lg" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white">
            All <span className="text-red-600">Blood Donors</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
            Total {donors.length} heroes found ready to save lives.
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {donors.map((donor) => (
            <motion.div 
              key={donor._id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center border-2 border-red-100 dark:border-red-900">
                   <span className="text-3xl font-black text-red-600">{donor.bloodGroup}</span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-400 uppercase">Location</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{donor.district}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {donor.name}
              </h3>
              <p className="text-slate-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Available for donation
              </p>
              
              <div className="mt-auto">
                <Link href={`/donor/${donor._id}`}>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-red-200 dark:shadow-none">
                     View Profile
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}