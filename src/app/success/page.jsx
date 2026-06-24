"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // যদি session_id না থাকে, তবে ইউজারকে ড্যাশবোর্ডে বা অন্য পেজে পাঠিয়ে দিন
    if (!sessionId) {
      router.replace("/funding"); // অথবা যে পেজে পাঠাতে চান
    }
  }, [sessionId, router]);

  // যদি session_id না থাকে, তবে কিছুই দেখাবে না (রিডাইরেক্ট হওয়ার অপেক্ষায়)
  if (!sessionId) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your contribution.</p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}