"use client";

import Link from "next/link";
import { ArrowLeft, Zap, User, Hash, Mail, Phone, GraduationCap, ChevronDown } from "lucide-react";
import { useState } from "react";

// 🎓 DATA: COMPREHENSIVE LIST OF DELHI COLLEGES
const DELHI_COLLEGES = [
  // --- TECHNICAL & MAJOR UNIVERSITIES ---
  "Delhi Technological University (DTU)",
  "Netaji Subhas University of Technology (NSUT)",
  "Indraprastha Institute of Information Technology Delhi (IIIT-D)",
  "Indira Gandhi Delhi Technical University for Women (IGDTUW)",
  "Jawaharlal Nehru University (JNU)",
  "Jamia Millia Islamia (JMI)",
  "Indian Institute of Technology Delhi (IIT Delhi)",
  "National Law University, Delhi (NLU)",
  "Dr. B.R. Ambedkar University Delhi (AUD)",
  "Guru Gobind Singh Indraprastha University (USS - Main Campus)",

  // --- GGSIPU (IP UNIVERSITY) AFFILIATED ---
  "Maharaja Agrasen Institute of Technology (MAIT)",
  "Maharaja Surajmal Institute of Technology (MSIT)",
  "University School of Information, Communication and Technology (USICT)",
  "Bhagwan Parshuram Institute of Technology (BPIT)",
  "Bharati Vidyapeeth's College of Engineering (BVCOE)",
  "Vivekananda Institute of Professional Studies (VIPS)",
  "Guru Tegh Bahadur Institute of Technology (GTBIT)",
  "Dr. Akhilesh Das Gupta Institute of Technology & Management (ADGITM)",
  "Jagan Institute of Management Studies (JIMS) - Rohini",
  "Jagan Institute of Management Studies (JIMS) - Vasant Kunj",
  "Trinity Institute of Professional Studies (TIPS)",
  "Maharaja Agrasen Institute of Management Studies (MAIMS)",
  "Delhi Institute of Advanced Studies (DIAS)",
  "Ideal Institute of Management and Technology (IIMT)",
  "Institute of Information Technology & Management (IITM) - Janakpuri",
  "HMR Institute of Technology & Management",
  "Guru Nanak Institute of Management",
  "Tecnia Institute of Advanced Studies",
  "Gitarattan International Business School (GIBS)",
  "Banarsidas Chandiwala Institute of Hotel Management",
  "Delhi Technical Campus (DTC) - Greater Noida",
  "Vardhman Mahavir Medical College (VMMC)",
  
  // --- DELHI UNIVERSITY (DU) - NORTH CAMPUS ---
  "St. Stephen's College",
  "Shri Ram College of Commerce (SRCC)",
  "Hindu College",
  "Hansraj College",
  "Kirori Mal College (KMC)",
  "Miranda House",
  "Ramjas College",
  "Daulat Ram College",
  "Indraprastha College for Women (IP College)",
  "SGTB Khalsa College",
  "Shaheed Sukhdev College of Business Studies (SSCBS)",
  
  // --- DELHI UNIVERSITY (DU) - SOUTH CAMPUS & OTHERS ---
  "Lady Shri Ram College for Women (LSR)",
  "Sri Venkateswara College (Venky)",
  "Jesus and Mary College (JMC)",
  "Gargi College",
  "Kamala Nehru College (KNC)",
  "Delhi College of Arts and Commerce (DCAC)",
  "Atma Ram Sanatan Dharma College (ARSD)",
  "Maitreyi College",
  "Motilal Nehru College",
  "Ram Lal Anand College",
  "Aryabhatta College",
  "College of Vocational Studies (CVS)",
  "Deshbandhu College",
  "Acharya Narendra Dev College (ANDC)",
  "Ramanujan College",
  "P.G.D.A.V. College",
  
  // --- DELHI UNIVERSITY (DU) - OFF CAMPUS ---
  "Deen Dayal Upadhyaya College (DDU)",
  "Keshav Mahavidyalaya",
  "Maharaja Agrasen College (DU)",
  "Shaheed Bhagat Singh College",
  "Shivaji College",
  "Rajdhani College",
  "Lakshmibai College",
  "Satyawati College",
  "Shyam Lal College",
  "Vivekananda College",
  "Kalindi College",
  "Janki Devi Memorial College",
  "Mata Sundri College",
  "Zakir Husain Delhi College",
  "Sri Guru Gobind Singh College of Commerce (SGGSCC)",
  "Sri Guru Nanak Dev Khalsa College",

  // --- MEDICAL & OTHERS ---
  "All India Institute of Medical Sciences (AIIMS)",
  "Maulana Azad Medical College (MAMC)",
  "Lady Hardinge Medical College (LHMC)",
  "University College of Medical Sciences (UCMS)",
  "School of Planning and Architecture (SPA)",
  "National Institute of Fashion Technology (NIFT) - Delhi",
  "Institute of Home Economics",
];

export default function RegisterPage() {
  // STATE: Manage the search and dropdown
  const [collegeQuery, setCollegeQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // LOGIC: Filter colleges based on what user types
  const filteredColleges = DELHI_COLLEGES.filter((college) =>
    college.toLowerCase().includes(collegeQuery.toLowerCase())
  );

  const handleSelectCollege = (college: string) => {
    setCollegeQuery(college);
    setIsDropdownOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-10 -right-10 rotate-12 bg-black text-white py-2 px-20 font-mono text-sm font-bold z-0 pointer-events-none opacity-20">
        DELHI STUDENTS ONLY /// DELHI STUDENTS ONLY
      </div>

      {/* BACK BUTTON */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 font-mono font-bold hover:underline z-10"
      >
        <ArrowLeft size={20} />
        BACK TO HOME
      </Link>

      {/* REGISTRATION CARD */}
      <div className="w-full max-w-md bg-white border-2 border-black p-8 relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFDE59] border-2 border-black flex items-center justify-center mx-auto mb-4 rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap size={24} fill="black" />
          </div>
          <h1 className="font-black text-3xl mb-2 uppercase tracking-tighter">Fresh Meat?</h1>
          <p className="font-mono text-xs text-gray-600">
            Join the exclusive network for <br/>
            <span className="bg-[#FF914D] px-1 border border-black text-black font-bold">Delhi's Flat Mates</span>
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <User size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* 🎓 COLLEGE SELECTOR */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <GraduationCap size={18} />
            </div>
            
            {/* Input Bar */}
            <input 
              type="text" 
              value={collegeQuery}
              onChange={(e) => {
                setCollegeQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              // onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay so click registers
              placeholder="Search Your College (e.g. MAIT)"
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-10 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
            
            <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <div className="absolute w-full bg-white border-2 border-black border-t-0 max-h-48 overflow-y-auto z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                 {filteredColleges.length > 0 ? (
                    filteredColleges.map((college, index) => (
                      <div 
                        key={index}
                        onMouseDown={() => handleSelectCollege(college)} // onMouseDown fires before onBlur
                        className="px-4 py-2 hover:bg-[#FFDE59] cursor-pointer font-mono text-xs border-b border-gray-100 last:border-0"
                      >
                        {college}
                      </div>
                    ))
                 ) : (
                    <div className="p-2 text-xs font-mono text-red-500">College not found.</div>
                 )}
              </div>
            )}
          </div>

          {/* Enrollment Number (Username) */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <Hash size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Enrollment No. (Username)"
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="College Email"
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Phone */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <Phone size={18} />
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number"
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button className="w-full mt-6 bg-black text-white border-2 border-black py-3 font-mono font-bold text-lg hover:bg-[#FFDE59] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none">
            CREATE ACCOUNT
          </button>

        </div>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold underline text-black hover:text-[#FF914D]">
              Sign In here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}