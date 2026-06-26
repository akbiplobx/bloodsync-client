import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaHeartbeat, FaUsers, FaDollarSign, FaHandHoldingHeart } from "react-icons/fa";
import clientPromise from "@/lib/mongodb"; 

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const adminName = session.user?.name || "Admin";

  // 🔌 MongoDB কানেকশন
  const client = await clientPromise;
  const db = client.db("bloodsync"); // আপনার ব্যাকএন্ড অনুযায়ী ডাটাবেজ নাম সেট করা হলো

  // 📊 আপনার index.js-এর আসল কালেকশন নেম অনুযায়ী কুয়েরি রান করা হচ্ছে
  const [totalDonors, totalRequests, fundingData] = await Promise.all([
    // ১. আপনার ব্যাকএন্ড কোড অনুযায়ী কালেকশনের নাম 'user'
    db.collection("user").countDocuments({}), 

    // ২. আপনার ব্যাকএন্ড কোড অনুযায়ী ব্লাড রিকোয়েস্টের কালেকশন হলো 'blood-data'
    db.collection("blood-data").countDocuments({}),

    // ৩. আপনার ব্যাকএন্ড কোড অনুযায়ী কালেকশন হলো 'donations'
    db.collection("donations").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } } // String থাকলে নাম্বার ফরম্যাটে যোগ করবে
        }
      }
    ]).toArray()
  ]);

  // টোটাল ফান্ড ক্যালকুলেশন
  const totalFundingAmount = fundingData[0]?.total || 0;

  return (
    <div className="w-full p-4 space-y-6">
      {/* 🔴 Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync, {adminName}! 🎉
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Your decision can save a life. Use the sidebar options to oversee community roles, statuses, and manage public requests across the platform.
        </p>
      </div>

      {/* 📊 ৩টি সম্পূর্ণ ডায়নামিক স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Donors */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Donors</p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              {totalDonors.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-xl">
            <FaUsers className="text-2xl" />
          </div>
        </div>

        {/* Card 2: Total Funding */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Funding</p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              ${totalFundingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-xl">
            <FaDollarSign className="text-2xl" />
          </div>
        </div>

        {/* Card 3: Total Blood Requests */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Total Blood Requests</p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              {totalRequests.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl">
            <FaHandHoldingHeart className="text-2xl" />
          </div>
        </div>
      </div>

      {/* ℹ️ Quick Insights & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-lg mb-1">Quick Insights</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Select "User Management" from the sidebar to update user profiles, view active accounts, or change security roles.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-lg mb-1">System Status</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">All services are functional. Keep track of recent blood requests through the "Public Requests" portal.</p>
        </div>
      </div>
    </div>
  );
}