"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Input, Button, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';

const EditBloodRequest = () => {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    bagsCount: 1,
    hospitalName: '',
    location: '',
    donationDate: '',
    contactNumber: '',
    description: '',
    status: 'Pending'
  });

  // Fetch individual request data
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-request/${id}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setFormData({
          patientName: data.patientName || '',
          bloodGroup: data.bloodGroup || '',
          bagsCount: data.bagsCount || 1,
          hospitalName: data.hospitalName || '',
          location: data.location || '',
          donationDate: data.donationDate || '',
          contactNumber: data.contactNumber || '',
          description: data.description || '',
          status: data.status || 'Pending'
        });
      } catch (error) {
        console.error("Error loading request:", error);
        Swal.fire("Error", "Could not load blood request details", "error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRequestDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blood-request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", "Blood request updated successfully!", "success");
        router.push('/dashboard/my-requests');
      } else {
        throw new Error(data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading Request Details..." color="danger" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 shadow-lg border border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-black text-rose-600 mb-6">Edit Blood Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all cursor-pointer"
                >
                  <option value="">Select Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Bags Required</label>
                <input
                  type="number"
                  name="bagsCount"
                  min="1"
                  value={formData.bagsCount}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Donation Date</label>
                <input
                  type="text"
                  name="donationDate"
                  placeholder="e.g., Immediate or 25th June"
                  value={formData.donationDate}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] px-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Case Description / Reason</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-rose-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submission and Save Action Trigger */}
            <Button
              type="submit"
              isLoading={updating}
              className="w-full h-[46px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-500/20"
            >
              Update Request Details
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditBloodRequest;