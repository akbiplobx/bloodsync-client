"use client";

import React, { useEffect, useState } from "react";
import { 
  Spinner, 
  Button, 
  Chip, 
  Modal, 
  Input 
} from "@heroui/react";

export default function FundingHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donations`)
      .then((res) => res.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading donations:", err);
        setLoading(false);
      });
  }, []);

  const totalAmount = donations.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // 💳 পেমেন্ট হ্যান্ডলার ফাংশন (যা ব্যাকএন্ডের Stripe সেশন তৈরি করবে)
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert("Please enter a valid amount!");

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          funderName: "Biplob", // আপনার ডাইনামিক ইউজারের নাম এখানে দিতে পারেন
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Stripe পেমেন্ট পেজে রিডাইরেক্ট করবে
      } else {
        alert("Failed to create checkout session");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner color="danger" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 md:mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Funding History</h1>
        <h2 className="text-lg md:text-2xl font-bold text-green-600">Total: ${totalAmount.toFixed(2)}</h2>

        {/* Modal implementation */}
        <Modal>
          <Button className="bg-red-600 text-white hover:bg-red-700">Give Fund</Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Make a Contribution</Modal.Heading>
                </Modal.Header>
                <form onSubmit={handlePayment}>
                  <Modal.Body>
                    <p className="mb-4 text-gray-600">Enter the amount you wish to donate:</p>
                    <Input 
  type="number" 
  placeholder="0.00" 
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  required

  label="Amount ($)"
/>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 text-white"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm & Pay"}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-100">
              <th className="p-4">Funder Name</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Funding Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b font-medium text-gray-800">{item.funderName || "Anonymous"}</td>
                  <td className="p-4 border-b text-gray-600">{item.transactionId || "N/A"}</td>
                  <td className="p-4 border-b text-gray-600">
                    {item.fundingDate ? new Date(item.fundingDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4 border-b font-bold text-green-600">+${item.amount}</td>
                  <td className="p-4 border-b"><Chip color="success" size="sm" variant="flat">SUCCESS</Chip></td>
                  <td className="p-4 border-b"><Button size="sm" variant="light" isIconOnly>💰</Button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}