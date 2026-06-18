"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "@/components/UpdateUserModal";
import { authClient } from "@/lib/auth-client";
import { Avatar, Card } from "@heroui/react";

const ProfilePage = () => {
  const router = useRouter();
  const userData = authClient.useSession();
  const user = userData.data?.user;
  const isLoading = userData.isPending; // সেশন লোড হচ্ছে কিনা চেক করার জন্য

  // ক্লায়েন্ট সাইড রিডাইরেকশন হ্যান্ডেল করার জন্য useEffect
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login"); // আপনার লগইন রাউটটি /signin হলে এখানে '/signin' দিন
    }
  }, [user, isLoading, router]);

  // সেশন চেক করার সময় ব্ল্যাঙ্ক বা কোনো লোডার দেখানো ভালো
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-bold tracking-wider animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <Card className="max-w-md w-full mx-auto flex flex-col items-center gap-4 p-8 border border-slate-800 bg-slate-900 shadow-2xl rounded-3xl">
        
        {/* ✅ HeroUI এর সঠিক Avatar ব্যবহার পদ্ধতি */}
        <Avatar
  src={user?.image || "/default-avatar.png"}
  name={user?.name}
  
  className="w-24 h-24 text-xl font-black border-4 border-rose-500 p-0.5 object-cover rounded-full"
  color="danger"
/>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-slate-100">{user?.name}</h2>
          <p className="text-sm font-medium text-slate-400">{user?.email}</p>
        </div>

        <div className="w-full pt-2 border-t border-slate-800 flex justify-center">
          <UpdateUserModal />
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;