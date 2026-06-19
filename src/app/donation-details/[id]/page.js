"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { authClient } from '@/lib/auth-client';
import { ArrowLeft, Droplet } from 'lucide-react';

export default function DonationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donation-request/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRequest(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!request) return <div className="p-10 text-center">Request Not Found</div>;

  return (
    <main className="py-12 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => router.back()} className="mb-6 font-bold flex items-center gap-2">
            <ArrowLeft size={18}/> Go Back
        </button>
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h1 className="text-3xl font-black">{request.patientName}</h1>
          <p className="text-red-500 font-bold text-xl my-4">Blood Group: {request.bloodGroup}</p>
          <p className="text-slate-600 mb-6">Hospital: {request.hospitalName}</p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const token = await authClient.token();
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                requestId: id,
                patientName: request.patientName,
                donationDate: e.target.donationDate.value,
                donorMessage: e.target.message.value
              })
            });
            if ((await res.json()).success) {
              toast.success("ডোনেশন রিকোয়েস্ট সফল!");
              router.push('/dashboard/my-requests');
            }
          }} className="space-y-4 border-t pt-6">
            <input type="date" name="donationDate" required className="w-full p-3 border rounded-xl" />
            <textarea name="message" placeholder="আপনার মেসেজ..." className="w-full p-3 border rounded-xl" rows="3"></textarea>
            <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-xl font-bold">
              Confirm Donation
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}