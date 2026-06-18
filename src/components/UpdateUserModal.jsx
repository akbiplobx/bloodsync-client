"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function UpdateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // For manual URL inputs
  const [imageFile, setImageFile] = useState(null); // For local file uploads
  const [previewUrl, setPreviewUrl] = useState(""); // For live avatar preview
  const [loading, setLoading] = useState(false);

  // Sync user details when modal opens
  useEffect(() => {
    if (session?.user && isOpen) {
      setName(session.user.name || "");
      setImageUrl(session.user.image || "");
      setPreviewUrl(session.user.image || "");
      setImageFile(null);
    }
  }, [session, isOpen]);

  // 1. Handler for local device file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear manual URL input when a file is chosen
      setPreviewUrl(URL.createObjectURL(file)); // Generate local preview URL
    }
  };

  // 2. Handler for manual URL inputs or paste actions
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null); // Cancel file selection when manual URL is provided
    setPreviewUrl(url); // Set live preview from the pasted URL
  };

  // Main profile update handler
  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      let finalImageUrl = imageUrl || session?.user?.image || "";

      // 🛠️ If user selected a file, upload it to ImgBB first
      if (imageFile) {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
        if (!apiKey) {
          toast.error("ImgBB API key is missing in your .env file!");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        // Safe fetch with detailed response validation to prevent infinite loading
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok from ImgBB");
        }

        const imgbbData = await response.json();
        
        if (imgbbData && imgbbData.success) {
          finalImageUrl = imgbbData.data.url;
        } else {
          toast.error("ImgBB upload failed or rejected!");
          setLoading(false);
          return;
        }
      }
      
      // 💾 Update user profile in database via Better-Auth
      const { data, error } = await authClient.updateUser({
        name: name,
        image: finalImageUrl, 
      });

      if (error) {
        toast.error(error.message || "Failed to update profile!");
      } else {
        toast.success("Profile updated successfully! 🎉");
        setIsOpen(false);
        // Delay reload slightly to let the user see the success toast
        setTimeout(() => {
          window.location.reload(); 
        }, 500);
      }
    } catch (err) {
      console.error("Error details:", err);
      toast.error("Process timed out or something went wrong!");
    } finally {
      setLoading(false); // Ensure the loading state turns off even if an error crashes the execution
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-md"
      >
        Edit Profile
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Update Profile</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-4">
              
              {/* Live Image Preview */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <img 
                  src={previewUrl || "/default-avatar.png"} 
                  alt="Avatar Preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-rose-500 p-0.5"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }} // Handle broken URLs gracefully
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Live Preview</p>
              </div>

              {/* Option 1: ImgBB File uploader */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1">Option 1: Upload from Device (ImgBB)</label>
                <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-transparent text-sm">
                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                    {imageFile ? imageFile.name : "No file chosen"}
                  </span>
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition">
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Visual Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">OR</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              {/* Option 2: Manual URL input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1">Option 2: Paste Manual Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/your-image.png"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-slate-800 dark:text-slate-200"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your new name"
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-slate-800 dark:text-slate-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6 border-t dark:border-slate-800 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-2 disabled:opacity-70"
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