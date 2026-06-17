"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="py-12 lg:py-20 transition-colors duration-300 bg-slate-50/50 dark:bg-slate-900/20">
      
      <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 max-w-7xl">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-slate-100 leading-tight"
          >
            Smarter Connection <br /> 
            To Save A <span className="text-rose-600 relative inline-block">
              Precious Life
              <span className="absolute bottom-1 left-0 w-full h-2 bg-rose-100 dark:bg-rose-950/50 -z-10 rounded"></span>
            </span> Here!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            BloodSync bridges the gap between blood donors and those in critical need. Join our advanced MERN-powered platform to request blood or become a lifesaver today.
          </motion.p>

          {/* Buttons as per requirement docs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
          >
            {/* Button 1: Join as a donor */}
            <Link href="/register">
              <button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-rose-200 dark:shadow-none transition-all duration-300 transform hover:-translate-y-1">
                Join as a donor <i className="fa-solid fa-user-plus ml-2"></i>
              </button>
            </Link>
            
            {/* Button 2: Search Donors */}
            <Link href="/search">
              <button className="w-full sm:w-auto border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 px-8 py-4 rounded-full font-bold transition-all duration-300">
                Search Donors <i className="fa-solid fa-magnifying-glass ml-2 text-rose-600"></i>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Image Section */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          
          {/* Main Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0] 
            }}
            transition={{ 
              opacity: { duration: 1 },
              scale: { duration: 1 },
              y: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            className="relative z-10 group"
          >
            {/* Blood Donation Concept Image */}
            <img 
              src="/profile.jpg"  
              alt="BloodSync Donation Feature" 
              className="w-72 md:w-80 lg:w-[450px] h-[350px] rounded-[40px] shadow-2xl border-4 border-white dark:border-slate-800 object-cover group-hover:border-rose-100 dark:group-hover:border-rose-950 transition-colors duration-300"
            />
            
            {/* Floating Status Card */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl dark:shadow-black/40 flex items-center gap-3 border border-slate-50 dark:border-slate-700 select-none"
            >
              <div className="bg-rose-100 dark:bg-rose-950/60 p-2 rounded-xl text-rose-600">
                <i className="fa-solid fa-droplet text-xl animate-pulse"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">1,200+ Bags</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Synced & Donated</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Decorative Background Blobs */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-rose-100 dark:bg-rose-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:opacity-30"></div>
          <div className="absolute -bottom-10 left-10 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:opacity-20"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;