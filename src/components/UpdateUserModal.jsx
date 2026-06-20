"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Camera } from "lucide-react"; 
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function UpdateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user && isOpen) {
      setName(session.user.name || "");
      setDistrict(session.user.district || "");
      setUpazila(session.user.upazila || "");
      setBloodGroup(session.user.bloodGroup || "");
      setPreviewUrl(session.user.image || "");
    }
  }, [session, isOpen]);

  const filteredUpazilas = upazilas.filter((u) => u.district_id === district);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let finalImageUrl = session?.user?.image || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
          method: "POST", 
          body: formData
        });
        const data = await res.json();
        if (data.success) finalImageUrl = data.data.url;
      }
      
      const { error } = await authClient.updateUser({
        name,
        image: finalImageUrl,
        district,
        upazila,
        bloodGroup
      });

      if (error) throw new Error(error.message);
      
      toast.success("Profile updated successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
        Edit Profile
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg text-center">Update Profile</h3>
            
            {/* কাস্টম ইমেজ আপলোড ডিজাইন */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <img 
                  src={previewUrl || "/default-avatar.png"} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-rose-100 group-hover:opacity-70 transition-all" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <p className="text-xs text-gray-400">Click avatar to change photo</p>
            </div>

            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Name" />

            <select value={district} onChange={(e) => { setDistrict(e.target.value); setUpazila(""); }} className="w-full border p-2 rounded-lg">
              <option value="">Select District</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <select value={upazila} onChange={(e) => setUpazila(e.target.value)} className="w-full border p-2 rounded-lg" disabled={!district}>
              <option value="">Select Upazila</option>
              {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full border p-2 rounded-lg">
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>

            <button onClick={handleUpdate} disabled={loading} className="w-full bg-rose-600 text-white py-2 rounded-lg font-bold hover:bg-rose-700 transition-colors">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}