"use client";

import Navbar from "@/app/components/Navbar";
import { Camera, IndianRupee, MapPin, Check, Type } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function CreateListing() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. FORM STATE
  const [formData, setFormData] = useState({
    title: "",
    rent: "",
    deposit: "",
    location: "",
    category: "",
    description: ""
  });

  const [images, setImages] = useState<File[]>([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const TAGS = ["AC", "Cooler", "No Brokerage", "Wifi", "Cook", "Maid", "Geyser", "Metro Near", "No Restrictions"];

  // 2. HANDLE INPUT CHANGES
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 4. IMAGE UPLOAD TO CLOUDINARY
  const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "listing_images");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dwg5nsiio/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Image upload error:", err);
    toast.error("Failed to upload image");
    throw err; // IMPORTANT: stop form submission
  }
};


  // 3. SUBMIT TO API
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Upload images
    const imageUrls = await Promise.all(
      images.map((file) => handleImageUpload(file))
    );

    const payload = {
      title: formData.title,
      category: formData.category,
      description: `${formData.description}`,
      address: formData.location,
      Preference: formData.category,
      price: Number(formData.rent),
      deposit: Number(formData.deposit) || 0,
      images: imageUrls,
      tag_ac: selectedTags.includes("AC"),
      tag_cooler: selectedTags.includes("Cooler"),
      tag_noBrokerage: selectedTags.includes("No Brokerage"),
      tag_wifi: selectedTags.includes("Wifi"),
      tag_cook: selectedTags.includes("Cook"),
      tag_maid: selectedTags.includes("Maid"),
      tag_geyser: selectedTags.includes("Geyser"),
      tag_metroNear: selectedTags.includes("Metro Near"),
      tag_noRestrictions: selectedTags.includes("No Restrictions"),
    };

    console.log("Submitting payload:", payload);
    
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to create listing");
      return;
    }

    toast.success("🎉 Listing published successfully!");
    router.push("/feed");

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while creating listing");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-[#E6ECEE] pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto p-4">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="font-black text-4xl mb-2 uppercase tracking-tighter">Post a Room</h1>
          <p className="font-mono text-sm text-gray-500 bg-white border border-black inline-block px-2 py-1 rotate-1">
            Free for students. No brokers allowed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECTION 1: THE BASICS */}
          <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 left-6 bg-blue-600 text-white font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
              Step 1: The Basics
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">

              {/* TITLE (New Field) */}
              <div className="md:col-span-2">
                <label className="font-mono text-xs font-bold block mb-2">LISTING TITLE</label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Spacious Room in Sector 22"
                    required
                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* RENT */}
              <div>
                <label className="font-mono text-xs font-bold block mb-2">EXPECTED RENT (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g. 6500"
                    required
                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* DEPOSIT */}
              <div>
                <label className="font-mono text-xs font-bold block mb-2">DEPOSIT / SECURITY (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g. 6500"
                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="md:col-span-2">
                <label className="font-mono text-xs font-bold block mb-2">EXACT LOCATION</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Area...</option>
                    <option value="Sector 22 - Pocket 4">Sector 22 - Pocket 4</option>
                    <option value="Sector 22 - Pocket 2">Sector 22 - Pocket 2</option>
                    <option value="Sector 24">Sector 24</option>
                    <option value="Sector 25">Sector 25</option>
                    <option value="Begampur">Begampur</option>
                  </select>
                </div>
              </div>

              {/* GENDER PREFERENCE */}
              <div className="md:col-span-2">
                <label className="font-mono text-xs font-bold block mb-2">WHO ARE YOU LOOKING FOR?</label>
                <div className="grid grid-cols-3 gap-4">
                  {["BOYS", "GIRLS", "ANYONE"].map((g) => (
                    <label key={g} className="cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={g}
                        checked={formData.category === g}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="text-center py-3 border-2 border-black font-black text-sm hover:bg-gray-100 peer-checked:bg-black peer-checked:text-white transition-all">
                        {g}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PHOTOS */}
          <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 left-6 bg-[#FF914D] text-white font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
              Step 2: The Evidence
            </div>

            <div className="mt-4 border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files).slice(0, 3); // max 3 images
                    setImages(files); // save in state
                  }
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
              />

              {/* Upload Icon */}
              <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Camera size={32} />
              </div>

              <h3 className="font-black text-lg uppercase">Upload Photos</h3>
              <p className="font-mono text-xs text-gray-500">Max 3 images</p>

              {/* Preview Selected Images */}
              {images.length > 0 && (
                <div className="mt-4 flex gap-3 justify-center flex-wrap">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      className="w-40 h-40 object-cover border-2 border-black"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>


          {/* SECTION 3: THE VIBE */}
          <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 left-6 bg-[#FFDE59] text-black font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
              Step 3: The Vibe
            </div>

            <div className="mt-4">
              <label className="font-mono text-xs font-bold block mb-4">SELECT ALL THAT APPLY</label>
              <div className="flex flex-wrap gap-3">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 border-2 font-mono text-xs font-bold transition-all flex items-center gap-2
                      ${selectedTags.includes(tag)
                        ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                      }`}
                  >
                    {selectedTags.includes(tag) && <Check size={14} />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="font-mono text-xs font-bold block mb-2">DESCRIPTION / RULES</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                placeholder="e.g. We are 3rd year CSE students. We study late at night. No smoking inside..."
                className="w-full bg-gray-50 border-2 border-black p-4 font-mono text-sm focus:bg-yellow-50 focus:outline-none transition-colors"
              ></textarea>
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 pb-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white font-black text-2xl py-5 border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,145,77,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF914D] hover:text-black transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "PUBLISHING..." : "PUBLISH LISTING"}
            </button>
            <p className="text-center font-mono text-xs text-gray-400 mt-4">
              Your listing will auto-expire in 30 days.
            </p>
          </div>

        </form>
      </div>
    </main>
  );
}