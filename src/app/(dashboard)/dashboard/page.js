"use client";
import React from "react";
import Link from "next/link";
import { FaPlusCircle, FaListAlt, FaHistory, FaHeartbeat } from "react-icons/fa";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync!
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Your decision can save a life. Use the options below to create urgent blood requests, manage your posts, or view your contribution history.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Request Blood */}
        <Link 
          href="/dashboard/create-request"
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-[#ff0000] text-xl font-bold mb-4 group-hover:scale-110 transition-transform duration-200">
              <FaPlusCircle />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              Request Blood
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Post a new request for blood in case of an emergency or upcoming medical need.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#ff0000] mt-4 block group-hover:translate-x-1 transition-transform">
            Create Request &rarr;
          </span>
        </Link>

        {/* Card 2: My Requests */}
        <Link 
          href="/dashboard/my-requests"
          className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 text-xl font-bold mb-4 group-hover:scale-110 transition-transform duration-200">
              <FaListAlt />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              My Requests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track the realtime status and responses of the blood requests you have created.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-4 block group-hover:translate-x-1 transition-transform">
            View Requests &rarr;
          </span>
        </Link>



      </div>
    </div>
  );
}