"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type FilterKeys =
    | "ac"
    | "cooler"
    | "noBroker"
    | "wifi"
    | "cook"
    | "maid"
    | "geyser"
    | "metroNear"
    | "noRules";

const FILTERS: { key: FilterKeys; label: string }[] = [
    { key: "ac", label: "AC" },
    { key: "cooler", label: "Cooler" },
    { key: "noBroker", label: "No Broker" },
    { key: "wifi", label: "Wifi" },
    { key: "cook", label: "Cook" },
    { key: "maid", label: "Maid" },
    { key: "geyser", label: "Geyser" },
    { key: "metroNear", label: "Near Metro" },
    { key: "noRules", label: "No Rules" },
];

export default function DropdownFilters({ currentParams }: { currentParams: Record<string, string | undefined> }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const buildLink = (key: FilterKeys, toggle: boolean) => {
        const params = { ...currentParams };
        if (toggle) {
            params[key] = "true";
        } else {
            delete params[key];
        }
        return `/feed?${new URLSearchParams(params as Record<string, string>).toString()}`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap"
            >
                Other Facilities
                <ChevronDown size={16} />
            </button>

            {open && (
                <div className="absolute mt-2 w-48 bg-white border-2 border-black p-4 shadow-lg z-50">
                    {FILTERS.map((f) => {
                        const isChecked = currentParams[f.key] === "true";
                        return (
                            <Link key={f.key} href={buildLink(f.key, !isChecked)}>
                                <label className="flex items-center gap-2 cursor-pointer py-1">
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={isChecked}
                                        className="cursor-pointer accent-black" // <-- this makes the tick black
                                    />
                                    {f.label}
                                </label>
                            </Link>
                        );
                    })}

                </div>
            )}
        </div>
    );
}
