"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function SuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing your payment...");

  useEffect(() => {
    // URL থেকে session_id সংগ্রহ করা
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");

    if (sessionId) {
      // ব্যাকএন্ডের এপিআই-তে পাঠানো
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/save-donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("Thank you! Your payment has been recorded.");
          } else {
            setStatus("Payment verification failed.");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("Error saving your payment.");
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[60px] py-20 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">{status}</p>
        
        {/* এই বাটনে ক্লিক করলে ইউজার মেইন ফান্ডিং পেজে যাবে এবং সেখানে তার নাম ও ডেটা দেখতে পাবে */}
        <Button 
          onClick={() => router.push("/funding")} 
          className="bg-red-600 text-white w-full hover:bg-red-700"
        >
          Return to Funding Page
        </Button>
      </div>
    </div>
  );
}