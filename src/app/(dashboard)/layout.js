"use client";
import React from "react";
import Link from "next/link";
import { FaPlusCircle, FaListAlt, FaHistory, FaHome, FaUser } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  return (
    
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-slate-800 transition-colors duration-300">
      
      
      <div className="w-full md:w-64 bg-slate-900 text-slate-100 p-5 space-y-6">
        
        <div className="text-2xl font-black text-center border-b border-slate-800 pb-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 tracking-tighter">
            Donor<span className="text-[#ff0000]">Profile</span>
          </div>
          <span className="block text-xs font-semibold text-[#ff0000] bg-rose-950/40 px-2.5 py-0.5 rounded-full mt-1">
            User Dashboard
          </span>
        </div>
        
        <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-300">
          
          <Link 
            href="/dashboard/profile" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaUser className="text-[#ff0000] text-lg" /> My Profile
          </Link>

          <Link 
            href="/dashboard/create-request" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaPlusCircle className="text-[#ff0000] text-lg" /> Create Request 
          </Link>
          
          <Link 
            href="/dashboard/my-requests" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaListAlt className="text-[#ff0000] text-lg" /> My Requests
          </Link>
          
                  
          <div className="border-t border-slate-800 my-4 pt-4"></div>
          
          <Link 
            href="/" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white text-slate-400"
          >
            <FaHome className="text-lg" /> Back to Home
          </Link>
        </nav>
      </div>

      
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white text-slate-900">
        {children}
      </div>
      
    </div>
  );
}