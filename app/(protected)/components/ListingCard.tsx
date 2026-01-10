import { MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";

// Define what a listing looks like
interface ListingProps {
  id: string;
  title: string;
  rent: string;
  location: string;
  category: "BOYS" | "GIRLS" | "Any";
  tags: string[];
  imageUrl: string;
}

export default function ListingCard({ rent, location, category, tags, imageUrl, id, title }: ListingProps) {
  return (
    <Link href={`/listing/${id}`}>  {/* Wrap everything in Link */}
    <div className="retro-card group cursor-pointer relative flex flex-col h-full">
      
      {/* 1. IMAGE AREA */}
      <div className="h-48 bg-gray-200 border-b-2 border-black relative overflow-hidden">
        {/* Placeholder for real image */}
        <img 
            src={imageUrl} 
            alt="Room" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* GENDER BADGE */}
        <div className={`absolute top-2 left-2 px-2 py-1 border-2 border-black font-mono text-xs font-bold
            ${category === 'BOYS' ? 'bg-blue-200' : category === 'GIRLS' ? 'bg-pink-200' : 'bg-gray-100'}
        `}>
            {category === 'BOYS' ? 'BOYS' : category === 'GIRLS' ? 'GIRLS' : 'ANY'}
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-heavy text-xl leading-none mb-1 flex items-center gap-1">
                    <IndianRupee size={18} strokeWidth={3} /> {rent}
                </h3>
                <p className="font-heavy fw-200 text-xs text-black-100 flex items-center gap-1 mt-1">
                    {/* <MapPin size={12}/>  */}
                    {title}
                </p>
                <p className="font-mono text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12}/> 
                    {location}
                </p>
            </div>
        </div>

        {/* Vibe Tags (The Pill Badges) */}
        {/* <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-[10px] font-mono font-bold border border-black bg-brand-bg rounded-full">
                    {tag}
                </span>
            ))}
        </div> */}

        {/* Action Button (Pushed to bottom) */}
        <div className="mt-auto">
            <button className="w-full bg-black text-white font-heavy text-sm py-2 hover:bg-brand-orange hover:text-black hover:border-black border-2 border-transparent transition-colors">
                VIEW DETAILS
            </button>
        </div>
      </div>
    </div>
    </Link>
  );
}