"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, DollarSign, Tag, Heart, Info, Send } from 'lucide-react';
import { toast } from "react-toastify"; 
import { authClient } from '@/lib/auth-client';

export default function PetDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = {
    name: "A K Biplob",
    email: "akbiplob24@gmail.com"
  };

  // -----------------------------------
  // 🐾 Fetch Pet Details on Component Load
  // -----------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        const tokenObj = await authClient.token(); 
        const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj; 

        console.log("Strict Token String (Fetch):", tokenData); 

        const headers = {};
        if (tokenData) {
          headers.authorization = `Bearer ${tokenData}`;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/pet/${id}`, { headers });
        
        if (!res.ok) {
          throw new Error(`Pet not found. Status: ${res.status}`);
        }
        
        const data = await res.json();
        setPet(data);
      } catch (err) {
        console.error("Error fetching pet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  // -----------------------------------
  // 💌 Handle Adoption Form Submission
  // -----------------------------------
  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const adoptionPayload = {
      petId: id, 
      petName: pet?.petName || "Pet",
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      pickupDate: formData.get('pickupDate'),
      message: formData.get('message')
    };

    try {
      
      const tokenObj = await authClient.token(); 
      const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj; 

      console.log("Strict Token String (Submit):", tokenData);

      
      const headers = {
        'Content-Type': 'application/json'
      };
      if (tokenData) {
        headers.authorization = `Bearer ${tokenData}`; 
      }

      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/adoption-requests`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(adoptionPayload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Request to adopt ${pet?.petName || 'Pet'} submitted successfully! 🎉`);
        router.push('/dashboard/my-requests'); 
      } else {
        toast.error(data.message || "Submission failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      toast.error("Something went wrong connecting to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) return imagePath;
    const fileName = imagePath.split('/').pop();
    return `/images/${fileName}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-[#030712]">
        <Spinner label="Loading companion details..." className="text-[#FFA600]" size="lg" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-[#030712] px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/40 text-[#FFA600] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-black text-black mb-2">Pet Not Found!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">We couldn't find the pet you are looking for. It might have been adopted already.</p>
          <button onClick={() => router.push('/allpets')} className="w-full bg-[#FFA600] hover:bg-[#E09200] text-white font-bold py-3 rounded-xl transition-all shadow-md">
            Back to All Pets
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="py-12 min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#FFA600] dark:hover:text-[#FFA600] mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Go Back
        </button>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 🐾 Left Column: Pet Information */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm relative"
            >
              <img 
                src={getImagePath(pet.imageUrl || pet.image)} 
                alt={pet.petName} 
                className="w-full h-[350px] md:h-[450px] object-cover"
              />
              <span className={`absolute top-6 right-6 text-xs font-black px-4 py-1.5 rounded-full text-white tracking-wider uppercase shadow-md ${pet.status === 'adopted' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                {pet.status === 'adopted' ? 'Adopted' : 'Available'}
              </span>
            </motion.div>

            {/* Title Block */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{pet.petName}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-bold text-[#FFA600] bg-rose-500/10 px-3 py-1 rounded-full">{pet.species || "Pet"}</span>
                  <span className="text-xs font-bold text-[#FFA600] bg-orange-500/10 px-3 py-1 rounded-full">{pet.breed || "Companion"}</span>
                  <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full">{pet.gender || "Gender N/A"}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Adoption Fee</span>
                <span className="text-2xl font-black text-[#FFA600]">BDT {pet.adoptionFee || "0"}</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Species</span>
                <span className="text-sm font-black mt-1 block">{pet.species || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Breed</span>
                <span className="text-sm font-black mt-1 block truncate">{pet.breed || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Age</span>
                <span className="text-sm font-black mt-1 block">{pet.age || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center shadow-xs">
                <span className="text-xs font-bold text-slate-400 block uppercase">Gender</span>
                <span className="text-sm font-black mt-1 block">{pet.gender || "N/A"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <MapPin className="text-[#FFA600]" size={20} />
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Location</span>
                  <span className="text-sm font-black truncate max-w-[200px] block">{pet.location || "Not specified"}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <Heart className="text-emerald-500" size={20} />
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Health Status</span>
                  <span className="text-sm font-black block">Excellent</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80">
              <h3 className="text-base font-black">About {pet.petName}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {pet.description || "No specific description available. This wonderful pet is looking for a caring and loving home. Contact us for detailed info."}
              </p>
            </div>
          </div>

          {/* 📋 Right Column: Adoption Form */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md space-y-5 sticky top-6"
            >
              <div>
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Heart size={18} className="text-[#FFA600] fill-rose-500" /> Request to Adopt {pet.petName}
                </h2>
              </div>

              <form onSubmit={handleAdoptSubmit} className="space-y-4">
                {/* Pet Name (Disabled/Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Pet Name</label>
                  <input 
                    type="text" 
                    value={pet.petName} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Your Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold">Your Name</label>
                  <input 
                    type="text" 
                    value={currentUser.name} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Your Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Email</label>
                  <input 
                    type="email" 
                    value={currentUser.email} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 outline-none text-sm cursor-not-allowed"
                  />
                </div>

                {/* Preferred Pickup Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold ">Preferred Pickup Date</label>
                  <input 
                    type="date" 
                    name="pickupDate" 
                    required 
                    disabled={pet.status === 'adopted'}
                    className="w-full font-semibold p-3 rounded-xl border border-slate-200 outline-none text-sm focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Message to Owner */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold ">Message to Owner</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    required
                    disabled={pet.status === 'adopted'}
                    placeholder={`Tell the owner why you'd be a great match for ${pet.petName}...`}
                    className="w-full font-semibold p-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={pet.status === 'adopted' || submitting} 
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 text-white shadow-md ${
                    pet.status === 'adopted' 
                      ? 'bg-[#FFA600] ' 
                      : 'bg-[#FFA600] active:scale-[0.98]'
                  }`}
                >
                  {submitting ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Send size={15} />
                      {pet.status === 'adopted' ? 'Already Adopted' : `Adopt ${pet.petName}`}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}