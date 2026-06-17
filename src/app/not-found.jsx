"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-2xl w-full text-center">
    
        <div className="relative mb-8">
          
          <h1 className="text-[150px] md:text-[200px] font-black text-red-600/10 leading-none select-none">
            404
          </h1>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-slate-600 text-lg mb-10 max-w-lg mx-auto">
          Sorry, the page you are looking for could not be found. 
          It might have been removed, renamed, or the link is simply incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
           
            <Button 
              size="lg" 
              className="w-full sm:w-auto font-bold text-white text-red-600 hover:bg-[#E09200] px-10 shadow-lg shadow-orange-100 rounded-xl transition-all"
            >
              Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NotFound;