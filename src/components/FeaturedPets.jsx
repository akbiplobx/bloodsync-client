"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { Spinner } from "@heroui/react"; 
import { motion } from "framer-motion"; 

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 70, 
      damping: 14 
    }
  }
};

export default function FeaturedPets() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
    setLoading(true);
    
   
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/pets`)
      .then((res) => res.json())
      .then((data) => {
       
        setPets(data.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading database data for featured pets:", err);
        setLoading(false);
      });
  }, []);

  
  const getImagePath = (imagePath, index) => {
    if (!imagePath) return `/images/p${index + 1}.png`; // ফলব্যাক লোকাল ইমেজ
    if (imagePath.startsWith('http')) return imagePath; 
    const fileName = imagePath.split('/').pop(); 
    return `/images/${fileName}`; 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner label="Loading featured pets..." className="text-red-600" size="lg" />
      </div>
    );
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section className="py-16 overflow-hidden bg-transparent transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">
            Meet Our <span className="text-red-600">Featured Pets</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Lovable friends waiting for a new home!</p>
        </div>

        {/* Pets Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pets.map((pet, index) => {
           
            const petId = pet._id || pet.id;

            return (
              <motion.div 
                key={petId}
                variants={cardVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.01,
                  boxShadow: "0px 20px 30px rgba(255, 166, 0, 0.12)", 
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/pet/${petId}`)} // কার্ডে ক্লিক করলেও সেফলি ডায়নামিক পেজে যাবে
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700/60 flex flex-col hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Pet Image */}
                <div className="bg-orange-50 dark:bg-slate-900 h-52 relative overflow-hidden group">
                  <motion.img 
                    src={getImagePath(pet.imageUrl || pet.image, index)} 
                    alt={pet.petName || pet.title || pet.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }} 
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onError={(e) => { 
                      e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500"; 
                    }}
                  />
                </div>

                {/* Pet Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
                      {pet.breed || pet.species || pet.category || "Pet"}
                    </span>
                    <span className="text-amber-500 font-bold text-sm">
                      BDT {pet.adoptionFee || "Free"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {pet.petName || pet.title || pet.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">
                    {pet.location || "Healthy"}
                  </p>
                  
                  {/* View Details Button */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/pet/${petId}`} className="block w-full">
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full text-red-600 hover:bg-[#E09200] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-orange-100 dark:shadow-none"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}