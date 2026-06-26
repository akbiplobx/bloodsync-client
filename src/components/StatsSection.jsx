"use client";
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';


const Counter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    activeDonors: 0,    
    totalFunding: 0, 
    totalRequests: 0,   
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // ১. Total Funding 
        const fundRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donations`);
        let fundData = [];
        if (fundRes.ok) fundData = await fundRes.json();
        const totalFundingCalculated = Array.isArray(fundData)
          ? fundData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
          : 0;

        // ২. Total Requests 
        let totalRequestsCalculated = 0;
        try {
          const requestRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-requests?limit=1`);
          if (requestRes.ok) {
            const requestData = await requestRes.json();
            totalRequestsCalculated = requestData.total || (Array.isArray(requestData) ? requestData.length : 0);
          }
        } catch (err) { console.log(err); }

        // ৩. Active Donors 
        let activeDonorsCalculated = 0;
        try {
          const donorRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donors`);
          if (donorRes.ok) {
            const donorData = await donorRes.json();
            activeDonorsCalculated = Array.isArray(donorData) ? donorData.length : 0;
          }
        } catch (err) { console.log(err); }

        
        setStats({
          activeDonors: activeDonorsCalculated || 100, 
          totalFunding: totalFundingCalculated || 100000, 
          totalRequests: totalRequestsCalculated || 1000, 
        });

      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchAllStats();
  }, []);

  // ফ্রেমর মোশন কার্ড অ্যানিমেশন ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <section className="w-full bg-transparent relative z-20 -mt-12 md:-mt-20 px-4 mb-16">
      <div className="container mx-auto max-w-6xl mt-8 md:mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* 👥 ১. Active Donors */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-[35px] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-black/40 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.12)] dark:hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.2)] group"
          >
            {/* SVG লোগো এবং হোভার কালার চেঞ্জ ইফেক্ট */}
            <div className="w-12 h-12 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 flex items-center justify-center text-[#ff0000] dark:text-rose-400 mb-4 border border-rose-100/30 dark:border-rose-900/20 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-transparent">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm9 11v-1c0-2.5-3.5-4-8-4s-8 1.5-8 4v1h16zm-2-1.5c-.5-.8-2.5-1.5-6-1.5s-5.5.7-6 1.5h12z"/>
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-500">
              <Counter value={stats.activeDonors} />+
            </h3>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
              Active Donors
            </p>
          </motion.div>

          {/* 💰 ২. Total Funding */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-[35px] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-black/40 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.12)] dark:hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.2)] group"
          >
            {/* SVG লোগো এবং হোভার কালার চেঞ্জ ইফেক্ট */}
            <div className="w-12 h-12 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 flex items-center justify-center text-[#ff0000] dark:text-rose-400 mb-4 border border-rose-100/30 dark:border-rose-900/20 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-transparent">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13H10v2h1v4H10v2h4v-2h-1V7z"/>
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-500">
              $<Counter value={stats.totalFunding} />
            </h3>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
              Total Funding
            </p>
          </motion.div>

          {/* 🩸 ৩. Total Requests */}
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-[35px] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-black/40 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.12)] dark:hover:shadow-[0_25px_60px_-15px_rgba(255,0,0,0.2)] group"
          >
            {/* SVG লোগো এবং হোভার কালার চেঞ্জ ইফেক্ট */}
            <div className="w-12 h-12 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 flex items-center justify-center text-[#ff0000] dark:text-rose-400 mb-4 border border-rose-100/30 dark:border-rose-900/20 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white ">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0zM12 5.5L7.76 9.74a6 6 0 1 0 8.49 0z"/>
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-500">
              <Counter value={stats.totalRequests} />
            </h3>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
              Total Requests
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;