"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Chip } from "@heroui/react";
import { MapPin, User, Building2, Droplets } from "lucide-react";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";
import Link from "next/link";

export default function DonorDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDonorDetails = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/users/${id}`);
        
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching donor details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDetails();
  }, [id]);

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">Loading Donor Profile...</p>
        </div>
      </div>
    );
  }

  // ইউজার না পাওয়া গেলে বা কোনো এরর হলে 404 এ রিডাইরেক্ট বা মেসেজ দেখাবে
  if (error || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Donor Not Found</h2>
        <p className="text-gray-500 mb-6">The donor profile you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-5 py-2.5 bg-[#ff0000] text-white font-bold rounded-xl shadow-md hover:bg-rose-700 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  // আইডি ধরে ডিস্ট্রিক্ট ও উপজেলা ম্যাচ করা
  const districtName = districts.find((d) => String(d.id) === String(user?.district))?.name || "N/A";
  const upazilaName = upazilas.find((u) => String(u.id) === String(user?.upazila))?.name || "N/A";

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8">
      {/* টপ বার */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Donor <span className="text-[#ff0000]">Information</span>
        </h1>
        <Link 
          href="/" 
          className="text-sm font-bold text-slate-600 hover:text-[#ff0000] bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* প্রোফাইল মেইন কার্ড */}
        <Card className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-rose-100 overflow-hidden border-4 border-white shadow-md">
              <img 
                src={user?.image || "/default-avatar.png"} 
                className="w-full h-full object-cover" 
                alt={user?.name || "Donor"}
                onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800">{user?.name || "Donor"}</h2>
              <div className="flex items-center justify-center md:justify-start gap-1 text-gray-500 mt-1">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-sm font-medium">{upazilaName}, {districtName}</span>
              </div>
              <Chip color="success" variant="flat" size="sm" className="mt-3 font-semibold">
                Active Donor
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <User className="text-[#ff0000]" size={20} /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Full Name</p>
                  <div className="p-3 bg-slate-50 rounded-xl font-semibold text-slate-700">{user?.name || "N/A"}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Email Address</p>
                  <div className="p-3 bg-slate-50 rounded-xl font-semibold text-slate-700">{user?.email || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <Building2 className="text-[#ff0000]" size={20} /> Address Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">District</p>
                  <div className="p-3 bg-slate-50 rounded-xl font-semibold text-slate-700">{districtName}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Upazila</p>
                  <div className="p-3 bg-slate-50 rounded-xl font-semibold text-slate-700">{upazilaName}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Medical Card */}
        <Card className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 h-fit">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-xl">
              <Droplets className="text-[#ff0000]" size={20} />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Medical Profile</h3>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Blood Group</p>
            <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-100/50 text-center">
              <p className="text-4xl font-black text-[#ff0000]">{user?.bloodGroup || "N/A"}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
            <h4 className="font-bold text-sm text-slate-800 mb-1">Blood Sync Status</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This donor profile is securely synced. All information displayed here is fetched directly from our verified database.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}