"use client";

import Navbar from "@/app/components/Navbar";
import { Camera, IndianRupee, MapPin, Check, Type, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchAddress } from "@/app/helper/searchAddress";
import dynamic from "next/dynamic";

const LocationMap = dynamic(
    () => import("@/app/(protected)/components/locationMap"),
    { ssr: false }
);

function EditListingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Location & College State
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [colleges, setColleges] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/colleges")
            .then(res => res.json())
            .then(setColleges)
            .catch(err => console.error("Failed to load colleges", err));
    }, []);

    // 1. FORM STATE
    const [formData, setFormData] = useState({
        title: "",
        rent: "",
        deposit: "",
        description: "",
        collegeId: "",
        location: {
            latitude: 28.6139,
            longitude: 77.2090,
            displayAddress: ""
        }
    });

    const [images, setImages] = useState<(string | File)[]>([]); // Mix of URLs and Files
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const TAGS = ["AC", "Cooler", "No Brokerage", "WifiIncluded", "CookAvailable", "MaidAvailable", "Geyser", "MetroNear", "NoRestrictions"];
    // Note: Backend expects camelCase tags like tag_wifi, using mapping.
    // The 'create' page had specific strings. I need to be careful with mapping.
    // Backend tags: tag_ac, tag_cooler, tag_noBrokerage, tag_wifi, tag_cook, tag_maid, tag_geyser, tag_metroNear, tag_noRestrictions

    const TAG_MAPPING: Record<string, string> = {
        "AC": "tag_ac",
        "Cooler": "tag_cooler",
        "No Brokerage": "tag_noBrokerage",
        "Wifi": "tag_wifi",
        "Cook": "tag_cook",
        "Maid": "tag_maid",
        "Geyser": "tag_geyser",
        "Metro Near": "tag_metroNear",
        "No Restrictions": "tag_noRestrictions"
    };

    const REVERSE_TAG_MAPPING = Object.entries(TAG_MAPPING).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {} as Record<string, string>);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchListing = async () => {
            try {
                const res = await fetch(`/api/listings/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title,
                        rent: String(data.price),
                        deposit: String(data.deposit || ""),
                        description: data.description,
                        collegeId: data.collegeId || "",
                        location: data.location ? {
                            latitude: data.location.latitude,
                            longitude: data.location.longitude,
                            displayAddress: data.location.displayAddress
                        } : {
                            latitude: 28.6139,
                            longitude: 77.2090,
                            displayAddress: ""
                        }
                    });

                    // Set images (existing URLs)
                    setImages(data.images || []);

                    // Set tags
                    const tagsRaw = [];
                    if (data.tag_ac) tagsRaw.push("tag_ac");
                    if (data.tag_cooler) tagsRaw.push("tag_cooler");
                    if (data.tag_noBrokerage) tagsRaw.push("tag_noBrokerage");
                    if (data.tag_wifi) tagsRaw.push("tag_wifi");
                    if (data.tag_cook) tagsRaw.push("tag_cook");
                    if (data.tag_maid) tagsRaw.push("tag_maid");
                    if (data.tag_geyser) tagsRaw.push("tag_geyser");
                    if (data.tag_metroNear) tagsRaw.push("tag_metroNear");
                    if (data.tag_noRestrictions) tagsRaw.push("tag_noRestrictions");

                    // Map back to UI strings
                    const uiTags = tagsRaw.map(t => REVERSE_TAG_MAPPING[t]).filter(Boolean);
                    setSelectedTags(uiTags);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchListing();
    }, [id]);


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

        const res = await fetch("https://api.cloudinary.com/v1_1/dwg5nsiio/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.secure_url;
    };

    // 3. SUBMIT TO API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Process images: separate URLs from Files
            const existingUrls = images.filter(img => typeof img === 'string') as string[];
            const newFiles = images.filter(img => typeof img !== 'string') as File[];

            const newImageUrls = await Promise.all(newFiles.map(file => handleImageUpload(file)));
            const finalImages = [...existingUrls, ...newImageUrls];

            const payload = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.rent),
                deposit: Number(formData.deposit) || 0,
                // description: formData.description, // Removed duplicate
                collegeId: formData.collegeId || null,
                location: formData.location, // Nested update handled by API
                images: finalImages,

                // Map frontend tags to backend
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

            const res = await fetch(`/api/listings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/profile");
                router.refresh();
            } else {
                const error = await res.json();
                alert("Error: " + error.error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    if (!id) return <div className="p-10 text-center font-heavy">INVALID LISTING ID</div>;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Link href="/profile" className="inline-flex items-center gap-2 font-mono font-bold mb-6 hover:underline">
                <ArrowLeft size={20} /> BACK TO PROFILE
            </Link>

            {/* HEADER */}
            <div className="text-center mb-10">
                <h1 className="font-black text-4xl mb-2 uppercase tracking-tighter">Edit Listing</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* SECTION 1: THE BASICS */}
                <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                    <div className="absolute -top-4 left-6 bg-blue-600 text-white font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
                        The Basics
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-4">

                        <div className="md:col-span-2">
                            <label className="font-mono text-xs font-bold block mb-2">LISTING TITLE</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-mono text-xs font-bold block mb-2">EXPECTED RENT (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-mono text-xs font-bold block mb-2">DEPOSIT (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="deposit"
                                    value={formData.deposit}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="md:col-span-2">
                            <label className="font-mono text-xs font-bold block mb-2">
                                EXACT LOCATION
                            </label>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search & pin exact location"
                                    value={formData.location.displayAddress}
                                    onChange={(e) => {
                                        setSuggestions([]);
                                        const value = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                displayAddress: value,
                                            },
                                        }));
                                        if (debounceRef.current) clearTimeout(debounceRef.current);
                                        if (value.length < 3) return;
                                        debounceRef.current = setTimeout(async () => {
                                            const res = await searchAddress(value);
                                            if (Array.isArray(res)) setSuggestions(res);
                                        }, 500);
                                    }}
                                    required
                                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono"
                                />

                                {/* AUTOSUGGEST DROPDOWN */}
                                {suggestions.length > 0 && (
                                    <div className="absolute left-0 top-full z-50 w-full bg-white border-2 border-black mt-1 max-h-60 overflow-auto">
                                        {suggestions.map((s) => (
                                            <button
                                                type="button"
                                                key={s.place_id}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        location: {
                                                            latitude: Number(s.lat),
                                                            longitude: Number(s.lon),
                                                            displayAddress: s.display_name,
                                                        },
                                                    }));
                                                    setSuggestions([]);
                                                }}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 font-mono text-xs"
                                            >
                                                {s.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* MAP */}
                            <div className="mt-4">
                                <LocationMap
                                    lat={formData.location.latitude}
                                    lng={formData.location.longitude}
                                    onChange={(lat, lng) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: {
                                                ...prev.location,
                                                latitude: lat,
                                                longitude: lng,
                                            },
                                        }))
                                    }
                                />
                                <p className="font-mono text-xs text-gray-500 mt-2">
                                    Drag pin to adjust
                                </p>
                            </div>
                        </div>

                        {/* COLLEGE */}
                        <div className="md:col-span-2">
                            <label className="font-mono text-xs font-bold block mb-2">
                                NEARBY COLLEGE
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select
                                    value={formData.collegeId}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            collegeId: e.target.value
                                        }))
                                    }
                                    className="w-full bg-gray-50 border-2 border-black pl-10 p-3 font-mono focus:bg-yellow-50 focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select College...</option>
                                    {colleges.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 2: PHOTOS */}
                <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                    <div className="absolute -top-4 left-6 bg-[#FF914D] text-white font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
                        Photos
                    </div>

                    <div className="mt-4 border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">

                        {/* File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                if (e.target.files) {
                                    const files = Array.from(e.target.files);
                                    // Append new files to existing images
                                    setImages(prev => [...prev, ...files].slice(0, 5));
                                }
                            }}
                            className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
                        />

                        <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera size={32} />
                        </div>

                        <h3 className="font-black text-lg uppercase">Add More Photos</h3>
                        <p className="font-mono text-xs text-gray-500">Tap to upload</p>
                    </div>

                    {/* Preview Selected Images */}
                    {images.length > 0 && (
                        <div className="mt-4 flex gap-3 flex-wrap">
                            {images.map((img, idx) => {
                                const src = typeof img === 'string' ? img : URL.createObjectURL(img);
                                return (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={src}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-24 h-24 object-cover border-2 border-black"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 border border-black opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            X
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* SECTION 3: THE VIBE */}
                <section className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                    <div className="absolute -top-4 left-6 bg-[#FFDE59] text-black font-bold px-3 py-1 border-2 border-black uppercase tracking-wider text-xs">
                        The Vibe
                    </div>

                    <div className="mt-4">
                        <label className="font-mono text-xs font-bold block mb-4">SELECT ALL THAT APPLY</label>
                        <div className="flex flex-wrap gap-3">
                            {Object.keys(TAG_MAPPING).map((tag) => (
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
                        <label className="font-mono text-xs font-bold block mb-2">DESCRIPTION</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full bg-gray-50 border-2 border-black p-4 font-mono text-sm focus:bg-yellow-50 focus:outline-none transition-colors"
                        ></textarea>
                    </div>
                </section>

                {/* SUBMIT BUTTON */}
                <div className="pt-4 pb-12">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-black text-white font-black text-2xl py-5 border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,145,77,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF914D] hover:text-black transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save />}
                        {saving ? "SAVING CHANGES..." : "UPDATE LISTING"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default function EditListingPage() {
    return (
        <main className="min-h-screen bg-[#E6ECEE] pb-20">
            <Navbar />
            <Suspense fallback={<div className="p-10 text-center font-heavy">LOADING EDITOR...</div>}>
                <EditListingContent />
            </Suspense>
        </main>
    )
}
