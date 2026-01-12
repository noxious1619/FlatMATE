"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, School } from "lucide-react";
import PriceSlider from "@/app/(protected)/components/PriceSlider";

export default function FeedSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ----- State for Filter Sections -----
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        category: true,
        price: true,
        college: true,
        sharing: true,
        furnished: true,
        gender: true,
        amenities: true
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // ----- Helper to update params -----
    const updateParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/feed?${params.toString()}`);
    };

    const toggleAmenity = (key: string) => {
        const current = searchParams.get(key) === "true";
        updateParam(key, current ? null : "true");
    };

    // ----- College State (Local Debounce) -----
    const [college, setCollege] = useState(searchParams.get("college") || "");
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (college) params.set("college", college); else params.delete("college");
            router.push(`/feed?${params.toString()}`);
        }, 500);
        return () => clearTimeout(handler);
    }, [college]);

    // Slider Params
    const minP = Number(searchParams.get("minPrice") || "0");
    const maxP = Number(searchParams.get("maxPrice") || "50000");

    return (
        <div className="w-full bg-gray-100 border-2 border-black p-4 shadow-retro">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heavy text-xl uppercase">Filters</h2>
                <button
                    onClick={() => router.push("/feed")}
                    className="text-xs font-mono underline text-red-600 hover:bg-black hover:text-white px-2 py-1 transition-colors"
                >
                    Reset All
                </button>
            </div>

            {/* 1. CATEGORY */}
            <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
                <div className="flex flex-col gap-2">
                    {["PG", "FLAT", "ROOM", "HOSTEL"].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                            <input
                                type="radio"
                                name="category"
                                checked={searchParams.get("category") === type}
                                onChange={() => updateParam("category", type)}
                                className="accent-black"
                            />
                            {type}
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                        <input
                            type="radio"
                            name="category"
                            checked={!searchParams.get("category")}
                            onChange={() => updateParam("category", null)}
                            className="accent-black"
                        />
                        Any
                    </label>
                </div>
            </FilterSection>

            {/* 2. PRICE RANGE (SLIDER) */}
            <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection("price")}>
                <div className="px-2 pt-2 pb-6">
                    <PriceSlider
                        min={0}
                        max={50000}
                        initialMin={minP}
                        initialMax={maxP}
                        onChange={(min, max) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("minPrice", String(min));
                            params.set("maxPrice", String(max));
                            router.push(`/feed?${params.toString()}`);
                        }}
                    />
                </div>
            </FilterSection>

            {/* 3. COLLEGE */}
            <FilterSection title="College" isOpen={openSections.college} onToggle={() => toggleSection("college")}>
                <div className="relative">
                    <School size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search College Name..."
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 border-2 border-black font-mono text-sm focus:bg-yellow-50 outline-none"
                    />
                </div>
            </FilterSection>

            {/* 4. SHARING */}
            <FilterSection title="Sharing Type" isOpen={openSections.sharing} onToggle={() => toggleSection("sharing")}>
                <div className="flex flex-col gap-2">
                    {["SINGLE", "DOUBLE", "TRIPLE"].map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                            <input
                                type="radio"
                                name="sharing"
                                checked={searchParams.get("sharing") === s}
                                onChange={() => updateParam("sharing", s)}
                                className="accent-black"
                            />
                            {s} Occupancy
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                        <input
                            type="radio"
                            name="sharing"
                            checked={!searchParams.get("sharing")}
                            onChange={() => updateParam("sharing", null)}
                            className="accent-black"
                        />
                        Any
                    </label>
                </div>
            </FilterSection>

            {/* 4. FURNISHED STATUS */}
            <FilterSection title="Furnished Status" isOpen={openSections.furnished} onToggle={() => toggleSection("furnished")}>
                <div className="flex flex-col gap-2">
                    {[{ v: "FURNISHED", l: "Furnished" }, { v: "SEMI_FURNISHED", l: "Semi-Furnished" }, { v: "UNFURNISHED", l: "Unfurnished" }].map(f => (
                        <label key={f.v} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                            <input
                                type="radio"
                                name="furnished"
                                checked={searchParams.get("furnished") === f.v}
                                onChange={() => updateParam("furnished", f.v)}
                                className="accent-black"
                            />
                            {f.l}
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                        <input
                            type="radio"
                            name="furnished"
                            checked={!searchParams.get("furnished")}
                            onChange={() => updateParam("furnished", null)}
                            className="accent-black"
                        />
                        Any
                    </label>
                </div>
            </FilterSection>

            {/* 5. GENDER */}
            <FilterSection title="Preferred Tenants" isOpen={openSections.gender} onToggle={() => toggleSection("gender")}>
                <div className="flex flex-col gap-2">
                    {[{ v: "MALE", l: "Boys" }, { v: "FEMALE", l: "Girls" }].map(g => (
                        <label key={g.v} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                            <input
                                type="radio"
                                name="gender"
                                checked={searchParams.get("gender") === g.v}
                                onChange={() => updateParam("gender", g.v)}
                                className="accent-black"
                            />
                            {g.l}
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                        <input
                            type="radio"
                            name="gender"
                            checked={!searchParams.get("gender")}
                            onChange={() => updateParam("gender", null)}
                            className="accent-black"
                        />
                        Any
                    </label>
                </div>
            </FilterSection>

            {/* 6. AMENITIES */}
            <FilterSection title="Amenities & Rules" isOpen={openSections.amenities} onToggle={() => toggleSection("amenities")}>
                <div className="flex flex-col gap-2">
                    {[
                        { k: "ac", l: "AC" },
                        { k: "cooler", l: "Cooler" },
                        { k: "wifi", l: "Wifi" },
                        { k: "cook", l: "Cook" },
                        { k: "maid", l: "Maid" },
                        { k: "geyser", l: "Geyser" },
                        { k: "noBroker", l: "No Brokerage" },
                        { k: "metroNear", l: "Near Metro" },
                        { k: "noRules", l: "No Restrictions" },
                    ].map(a => (
                        <label key={a.k} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                            <input
                                type="checkbox"
                                checked={searchParams.get(a.k) === "true"}
                                onChange={() => toggleAmenity(a.k)}
                                className="accent-black"
                            />
                            {a.l}
                        </label>
                    ))}
                </div>
            </FilterSection>

        </div>
    );
}

function FilterSection({ title, isOpen, onToggle, children }: any) {
    return (
        <div className="border-b-2 border-gray-200 py-4 last:border-0">
            <button onClick={onToggle} className="flex justify-between items-center w-full mb-2">
                <span className="font-bold text-sm uppercase">{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && <div className="mt-2 pl-1 animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    )
}
