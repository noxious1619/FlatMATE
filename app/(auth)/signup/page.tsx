"use client";

import Link from "next/link";
import { ArrowLeft, Zap, User, Hash, Mail, Phone, GraduationCap, ChevronDown, Lock } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";

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
  // STATE
  const [collegeQuery, setCollegeQuery] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const [user, setUser] = React.useState({
    fullName: "",
    college: "",
    email: "",
    phone: "",
    password: "",
  });

  const onSignup = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user.fullName || !user.email || !user.password) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/auth/register", {
        ...user,
        college: collegeQuery || user.college,
      });

      if (response.status === 201) {
        // Redirect to verification pending page with email param
        router.push(`/verification-pending?email=${encodeURIComponent(user.email)}`);

        // // Auto login or redirect
        // const result = await signIn("credentials", {
        //   redirect: false,
        //   email: user.email,
        //   password: user.password,
        // });

        // if (result?.error) {
        //   router.push("/login");
        // } else {
        //   router.push("/feed");
        // }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // LOGIC: Filter colleges based on what user types
  const filteredColleges = DELHI_COLLEGES.filter((college) =>
    college.toLowerCase().includes(collegeQuery.toLowerCase())
  );

  const handleSelectCollege = (college: string) => {
    setCollegeQuery(college);
    setIsDropdownOpen(false);
    setUser({ ...user, college: college });
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND DECORATION */}
      <div className="absolute top-7 -right-10 rotate-12 bg-black text-white py-2 px-30 font-mono text-sm font-bold z-0 pointer-events-none opacity-40">
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
      <div className="w-full max-w-md bg-white border-2 border-black p-8 relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFDE59] border-2 border-black flex items-center justify-center mx-auto mb-4 
                rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transform transition-transform duration-500 hover:rotate-180">
            <Zap size={24} fill="black" />
          </div>
          <h1 className="font-black text-3xl mb-2 uppercase tracking-tighter">Fresh Meat?</h1>
          <p className="font-mono text-xs text-gray-600">
            Join the exclusive network for <br />
            <span className="bg-[#FF914D] px-1 border border-black text-black font-bold inline-block" style={{ transform: "rotate(-2deg)" }}>Delhi's Flat Mates</span>
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-xs font-mono mb-4">
            {error}
          </div>
        )}

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
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
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
              placeholder="Search Your College"
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
                      onMouseDown={() => handleSelectCollege(college)}
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

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
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
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-white border-2 border-black py-2.5 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={onSignup}
            disabled={loading}
            className="w-full mt-6 bg-black text-white border-2 border-black py-3 font-mono font-bold text-lg hover:bg-[#FFDE59] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-gray-300"></div>
            <span className="shrink mx-4 text-gray-400 font-mono text-xs">OR</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/feed" })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black py-3 px-4 font-mono font-bold text-sm hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-retro hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            SIGN UP WITH GOOGLE
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

        {/* FOOTER NOTE */}
        <p className="text-center font-mono text-xs text-gray-400 mt-8">
          By joining, you agree to our <span className="bg-brand-yellow px-1 border border-black text-black inline-block underline" style={{ transform: "rotate( 2deg)" }}>No Creep Policy</span>.
        </p>
      </div>
    </main>
  );
}