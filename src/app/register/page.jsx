"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Filtered upazilas based on selected district
  const filteredUpazilas = selectedDistrict
    ? upazilas.filter((u) => u.district_id === selectedDistrict)
    : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Avatar file change handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload avatar to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Image upload failed");
  };

  // Validate fields
  const validate = (fields) => {
    const errs = {};
    if (!fields.name?.trim()) errs.name = "Name is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fields.email))
      errs.email = "Valid email required";
    if (!fields.phone?.trim()) errs.phone = "Phone number is required";
    if (!selectedBloodGroup) errs.bloodGroup = "Select a blood group";
    if (!selectedDistrict) errs.district = "Select a district";
    if (!selectedUpazila) errs.upazila = "Select an upazila";
    if (fields.password.length < 8)
      errs.password = "Minimum 8 characters required";
    else if (!/[A-Z]/.test(fields.password))
      errs.password = "Must contain an uppercase letter";
    else if (!/[0-9]/.test(fields.password))
      errs.password = "Must contain a number";
    if (fields.confirmPassword !== fields.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const formData = new FormData(e.currentTarget);
    const fields = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setIsLoading(true);

      // Avatar upload
      let imageUrl = "";
      if (avatarFile) {
        setUploadingAvatar(true);
        imageUrl = await uploadToImgBB(avatarFile);
        setUploadingAvatar(false);
      }

      const districtObj = districts.find((d) => d.id === selectedDistrict);
      const upazilaObj = upazilas.find((u) => u.id === selectedUpazila);

      const { data, error } = await authClient.signUp.email({
        name: fields.name,
        email: fields.email,
        password: fields.password,
        image: imageUrl,
        // Extra fields 
        phone: fields.phone,
        bloodGroup: selectedBloodGroup,
        district: districtObj?.name || "",
        upazila: upazilaObj?.name || "",
      });

      if (error) {
        setSubmitError(error.message || "Registration failed. Try again.");
        return;
      }

      router.push("/");
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-6 px-4">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="text-2xl font-extrabold text-[#ff0000]">
          Join the Lifesaving Community
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
          Create an account to become a donor and save lives
        </p>
      </div>

      <Card className="mx-auto w-full max-w-2xl py-5 px-6 shadow-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">

        <form onSubmit={onSubmit} className="space-y-3">
        {/* ============== */}
        {/* Avatar Upload Section */}
<div className="flex justify-center mb-6">
  <div className="relative group">
    <div 
      className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer flex items-center justify-center"
      onClick={() => fileInputRef.current.click()}
    >
      {avatarPreview ? (
        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="text-slate-400 text-sm">Upload</span>
      )}
    </div>
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleAvatarChange}
      className="hidden"
      accept="image/*"
    />
    {uploadingAvatar && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white text-xs">
        Uploading...
      </div>
    )}
  </div>
</div>
        {/* ========================= */}



          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-[#ff0000]">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
              {errors.name && <p className="text-xs text-[#ff0000] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-[#ff0000]">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              />
              {errors.email && <p className="text-xs text-[#ff0000] mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Phone + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-[#ff0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📞</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+880 1XXX XXXXXXX"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                />
              </div>
              {errors.phone && <p className="text-xs text-[#ff0000] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                defaultValue=""
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 transition appearance-none"
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 3: District + Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                District <span className="text-[#ff0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📍</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedUpazila("");
                  }}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 transition appearance-none"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.district && <p className="text-xs text-[#ff0000] mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upazila <span className="text-[#ff0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🏘️</span>
                <select
                  value={selectedUpazila}
                  onChange={(e) => setSelectedUpazila(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.upazila && <p className="text-xs text-[#ff0000] mt-1">{errors.upazila}</p>}
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Blood Group <span className="text-[#ff0000]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-3 py-1 rounded-lg border text-sm font-semibold transition-all ${
                    selectedBloodGroup === bg
                      ? "bg-[#ff0000] text-white border-rose-600 shadow-md scale-105"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
            {errors.bloodGroup && (
              <p className="text-xs text-[#ff0000] mt-1">{errors.bloodGroup}</p>
            )}
          </div>

          {/* Row 4: Password + Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password <span className="text-[#ff0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                8+ chars, 1 uppercase & 1 number
              </p>
              {errors.password && <p className="text-xs text-[#ff0000]">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-[#ff0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔁</span>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#ff0000] mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-[#ff0000] dark:text-[#ff0000] text-sm rounded-lg px-4 py-2.5">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold h-10 text-sm rounded-lg transition shadow-md mt-2"
          >
            {!isLoading && "Complete Registration"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-xs text-slate-500 mt-3">
            Already have an account?{" "}
            <Link href="/login" className="text-[#ff0000] font-bold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}