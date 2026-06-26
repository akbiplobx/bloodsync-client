"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you for reaching out! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 110 } }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-4 pb-12 px-4 relative overflow-hidden transition-colors duration-300">
      {/* 🩸 ব্যাকগ্রাউন্ড গ্লো (No Blue - Absolute Red Accents) */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-red-600/[0.06] dark:bg-red-600/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-red-500/[0.06] dark:bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* ✍️ সেকশন হেডার */}
        <div className="text-center mb-12">
                   <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-neutral-800 dark:text-neutral-100 tracking-tight "
          >
            Let's Start a <span className="text-[#ff0000] relative inline-block">Conversation<span className="absolute left-0 bottom-1 w-full h-[4px] bg-red-500/20 rounded"></span></span>
          </motion.h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto text-xs md:text-sm">
            Have questions about donating blood or funding? Reach out to the BloodSync team instantly.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* ℹ️ বাম পাশ: কন্টাক্ট ইনফরমেশন */}
          <div className="lg:col-span-5 space-y-4">
            {/* কার্ড ১: ইমেইল */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="bg-white dark:bg-neutral-900 p-4 rounded-[24px] border border-red-100/40 dark:border-neutral-800/40 shadow-[0_10px_30px_-15px_rgba(255,0,0,0.04)] flex items-center gap-4 group transition-all duration-300 hover:border-red-500 hover:shadow-[0_15px_35px_-10px_rgba(255,0,0,0.1)]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800/60 flex items-center justify-center text-[#ff0000] shrink-0 border border-red-100/30 group-hover:bg-[#ff0000] group-hover:text-white transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Email Us</h4>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200 break-all">support@bloodsync.com</p>
              </div>
            </motion.div>

            {/* কার্ড ২: জরুরি ফোন নম্বর */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="bg-white dark:bg-neutral-900 p-4 rounded-[24px] border border-red-100/40 dark:border-neutral-800/40 shadow-[0_10px_30px_-15px_rgba(255,0,0,0.04)] flex items-center gap-4 group transition-all duration-300 hover:border-red-500 hover:shadow-[0_15px_35px_-10px_rgba(255,0,0,0.1)]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800/60 flex items-center justify-center text-[#ff0000] shrink-0 border border-red-100/30 group-hover:bg-[#ff0000] group-hover:text-white transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C9.1 6.42 8.9 5.23 8.9 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.62c0-.55-.45-1-1-1z"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Emergency Hotline</h4>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">+880 1234-567890</p>
              </div>
            </motion.div>

            {/* কার্ড ৩: ঠিকানা */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="bg-white dark:bg-neutral-900 p-4 rounded-[24px] border border-red-100/40 dark:border-neutral-800/40 shadow-[0_10px_30px_-15px_rgba(255,0,0,0.04)] flex items-center gap-4 group transition-all duration-300 hover:border-red-500 hover:shadow-[0_15px_35px_-10px_rgba(255,0,0,0.1)]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800/60 flex items-center justify-center text-[#ff0000] shrink-0 border border-red-100/30 group-hover:bg-[#ff0000] group-hover:text-white transition-all duration-300 shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Our Location</h4>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">Chittagong, Bangladesh</p>
              </div>
            </motion.div>
          </div>

          {/* ✉️ ডান পাশ: রিডিজাইনড ইনপুট কালার ফর্ম */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 bg-white dark:bg-[#121212] rounded-[28px] p-6 md:p-8 border border-neutral-200/80 dark:border-neutral-800/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff0000]" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="A K Biplob" 
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] px-4 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#ff0000] focus:ring-4 focus:ring-red-500/10 transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="akbiplob24@gmail.com" 
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] px-4 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#ff0000] focus:ring-4 focus:ring-red-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider ml-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?" 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[14px] px-4 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#ff0000] focus:ring-4 focus:ring-red-500/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider ml-1">Message</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message..." 
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[16px] px-4 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#ff0000] focus:ring-4 focus:ring-red-500/10 transition-all duration-200 resize-none"
                ></textarea>
              </div>

              {/* 🚀 রেড বাটন */}
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-[14px] shadow-lg shadow-red-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default ContactPage;