"use client";

import React, { useEffect, useState } from "react";
import { Spinner, Button, Chip } from "@heroui/react";

export default function FundingHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donations`)
      .then((res) => res.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const totalAmount = donations.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><Spinner color="danger" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
       
        <h1 className="text-2xl font-bold text-gray-800">Funding History</h1>

       
        <div className="text-center">
                   <h2 className="text-2xl font-bold text-green-600">Total Collected: ${totalAmount.toFixed(2)}</h2>
        </div>

       
        <Button className="bg-red-600 hover:bg-red-700 text-white">Give Fund</Button>
      </div>

      {/* টেবিল সেকশন */}
      <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Donor</th>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Transaction ID</th>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Date</th>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Amount</th>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Status</th>
              <th className="p-4 border-b text-gray-600 uppercase text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b font-medium">{item.funderName}</td>
                  <td className="p-4 border-b text-gray-600">{item.transactionId || "N/A"}</td>
                  <td className="p-4 border-b text-gray-600">{new Date(item.fundingDate).toLocaleDateString()}</td>
                  <td className="p-4 border-b font-bold text-green-600">+${item.amount}</td>
                  <td className="p-4 border-b">
                    <Chip color="success" size="sm" variant="flat">SUCCESS</Chip>
                  </td>
                  <td className="p-4 border-b">
                    <Button size="sm" variant="light" isIconOnly>💰</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No funding records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}