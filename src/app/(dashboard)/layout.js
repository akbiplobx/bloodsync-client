"use client";
import React from "react";
import Link from "next/link";
// react-icons থেকে পিওর জাভাস্ক্রিপ্ট আইকন ইমপোর্ট
import { FaPlusCircle, FaListAlt, FaHistory, FaHome } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar Section */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-100 p-5 space-y-6 border-r border-slate-800">
        
        {/* Brand/Logo Area */}
        <div className="text-2xl font-black text-center border-b border-slate-800 pb-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 tracking-tighter">
            Blood<span className="text-rose-500">Sync</span>
          </div>
          <span className="block text-xs font-semibold text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded-full mt-1">
            User Dashboard
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-300">
          
          {/* 1. Request Blood */}
          <Link 
            href="/dashboard/create-request" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaPlusCircle className="text-rose-500 text-lg" /> Request Blood
          </Link>
          
          {/* 2. My Donation Requests */}
          <Link 
            href="/dashboard/my-requests" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaListAlt className="text-rose-500 text-lg" /> My Requests
          </Link>
          
          {/* 3. My Donations */}
          <Link 
            href="/dashboard/my-donations" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <FaHistory className="text-rose-500 text-lg" /> My Donations
          </Link>
          
          {/* Decorative Divider */}
          <div className="border-t border-slate-800 my-4 pt-4"></div>
          
          {/* 4. Back to Home */}
          <Link 
            href="/" 
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white text-slate-400"
          >
            <FaHome className="text-lg" /> Back to Home
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </div>
      
    </div>
  );
}