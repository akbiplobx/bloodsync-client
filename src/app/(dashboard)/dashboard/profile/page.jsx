"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "@/components/UpdateUserModal";
import { authClient } from "@/lib/auth-client";
import { Card, Chip } from "@heroui/react";
import { MapPin, User, Building2, Droplets } from "lucide-react";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
  }, [user, isPending, router]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const districtName = districts.find(d => d.id === user?.district)?.name || "N/A";
  const upazilaName = upazilas.find(u => u.id === user?.upazila)?.name || "N/A";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <UpdateUserModal />
      </div>

      {/* ৩-কলামের গ্রিড লেআউট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* বাম দিকের বড় কার্ড (Personal & Address) */}
        <Card className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-rose-100 overflow-hidden border-4 border-white shadow-md">
              <img src={user?.image || "/default-avatar.png"} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{user?.name || "Donor"}</h2>
              <div className="flex items-center justify-center md:justify-start gap-1 text-gray-500 mt-1">
                <MapPin size={16} />
                <span>{upazilaName}, {districtName}</span>
              </div>
              <Chip color="success" variant="flat" size="sm" className="mt-2 font-semibold">Active Donor</Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><User className="text-rose-500" size={20} /> Personal Information</h3>
              <div className="space-y-4">
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</p><div className="p-3 bg-gray-50 rounded-xl font-semibold text-gray-700">{user?.name || "N/A"}</div></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email (Fixed)</p><div className="p-3 bg-gray-50 rounded-xl font-semibold text-gray-700">{user?.email || "N/A"}</div></div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><Building2 className="text-rose-500" size={20} /> Address Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">District</p><div className="p-3 bg-gray-50 rounded-xl font-semibold text-gray-700">{districtName}</div></div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Upazila</p><div className="p-3 bg-gray-50 rounded-xl font-semibold text-gray-700">{upazilaName}</div></div>
              </div>
            </div>
          </div>
        </Card>

        {/* ডান দিকের মেডিকেল প্রোফাইল কার্ড */}
        <Card className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 h-fit">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-lg"><Droplets className="text-rose-500" size={20} /></div>
            <h3 className="font-bold text-lg">Medical Profile</h3>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Blood Group</p>
            <div className="p-4 bg-rose-50 rounded-2xl"><p className="text-3xl font-black text-rose-600">{user?.bloodGroup || "N/A"}</p></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-sm mb-1">Eligible to Donate</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Your account is in good standing. You are ready to save lives.</p>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;