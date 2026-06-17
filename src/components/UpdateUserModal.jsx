"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function UpdateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (session?.user && isOpen) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session, isOpen]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      
      
      const { data, error } = await authClient.updateUser({
        name: name,
        image: image, 
      });

      if (error) {
        toast.error(error.message || "Failed to update profile!");
      } else {
        toast.success("Profile updated successfully!");
        setIsOpen(false);
        
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 text-red-600 hover:bg-[#E09200] text-white font-bold py-2 px-4 rounded-xl text-sm transition shadow-md shadow-orange-100"
      >
        Edit Profile
      </button>
      
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          
          
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
         
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-800">Update Profile</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 pl-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your new name"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA600]/20 focus:border-[#FFA600] transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 pl-1">Profile Image URL</label>
                <input
                  type="text"
                  placeholder="Paste image URL (e.g., ImgBB link)"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA600]/20 focus:border-[#FFA600] transition"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

           
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 text-sm font-bold text-white text-red-600 hover:bg-[#E09200] rounded-xl transition flex items-center gap-2"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}