import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaHeartbeat, FaUsers, FaDollarSign, FaHandHoldingHeart } from "react-icons/fa";
import clientPromise from "@/lib/mongodb"; 

export default async function VolunteerDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ১. অথেন্টিকেশন ও রোল চেক
  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "volunteer") {
    redirect("/dashboard");
  }

  const volunteerName = session.user?.name || "Volunteer";

  // 🔌 MongoDB কানেকশন ও ডাটাবেজ সিলেক্ট
  const client = await clientPromise;
  const db = client.db("bloodsync");

  // 📊 রিয়েল-টাইম ডাটা ফেচিং (Admin Dashboard-এর মতোই রিয়েল ডাটা আসবে)
  const [totalDonors, totalRequests, fundingData] = await Promise.all([
    // আপনার ব্যাকএন্ড অনুযায়ী কালেকশনের নাম 'user'
    db.collection("user").countDocuments({}), 

    // আপনার ব্যাকএন্ড অনুযায়ী ব্লাড রিকোয়েস্টের কালেকশন হলো 'blood-data'
    db.collection("blood-data").countDocuments({}),

    // আপনার ব্যাকএন্ড অনুযায়ী কালেকশন হলো 'donations'
    db.collection("donations").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } } 
        }
      }
    ]).toArray()
  ]);

  // ফান্ডিং এর মোট অ্যামাউন্ট ক্যালকুলেট করা
  const totalFundingAmount = fundingData[0]?.total || 0;

  return (
    <div className="w-full p-4 space-y-6">
      {/* 🔴 Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <FaHeartbeat className="text-3xl animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to BloodSync, {volunteerName}! 🎉
          </h1>
        </div>
        <p className="text-rose-100 max-w-xl text-sm md:text-base font-medium">
          Thank you for your incredible support. Use the sidebar options to create urgent blood donation requests and track your submitted applications.
        </p>
      </div>

      {/* 📊 ৩টি ডায়নামিক স্ট্যাটস কার্ড (Admin-এর মতো দেখতে) */}
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

      {/* ℹ️ Quick Insights & System Status (Volunteer-specific instructions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-lg mb-1">Create Blood Request</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Is there an immediate need for blood? Post an urgent request to notify our donor network instantly.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-slate-700 dark:text-zinc-300 text-lg mb-1">Track Applications</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Go to "My Requests" to easily monitor the screening, progress, and approval status of all your submitted blood requests.</p>
        </div>
      </div>
    </div>
  );
}