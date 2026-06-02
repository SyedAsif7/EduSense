import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  MapPin, 
  Phone, 
  Camera, 
  Edit2, 
  Briefcase, 
  GraduationCap, 
  Award,
  BookOpen,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-white/40 uppercase tracking-widest text-sm">Loading Identity...</p>
      </div>
    );
  }

  if (!user) return <div className="text-white p-10">Error loading profile.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ─── Hero Header ─── */}
      <div className="relative group">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-[3rem] blur-3xl group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-500" />
        
        <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-[3rem] border border-white/[0.08] p-10 lg:p-16 flex flex-col lg:flex-row items-center lg:items-start gap-12 overflow-hidden">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl shadow-indigo-500/20 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              <div className="w-full h-full rounded-[2.3rem] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                <span className="text-7xl font-black text-white/90 drop-shadow-2xl">
                  {user.full_name[0]}
                </span>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm">
                  <Camera className="text-white w-10 h-10" />
                </div>
              </div>
            </div>
            {/* Role Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
              {user.role}
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 drop-shadow-sm">
                {user.full_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/50 font-bold uppercase tracking-widest text-sm">
                <span className="flex items-center gap-2">
                  <Fingerprint size={16} className="text-indigo-400" />
                  {user.username}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-indigo-400" />
                  {user.email || `${user.username.toLowerCase()}@ssiems.edu`}
                </span>
              </div>
            </div>

            <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed">
              {user.role === 'STUDENT' 
                ? `Dedicated ${user.class_name || 'CSE'} student at MSPM'S Shri Shivaji Institute of Engineering & Management Studies.`
                : `Distinguished ${user.role === 'HOD' ? 'Head of Department' : 'Faculty Member'} committed to academic excellence and student success.`}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-white/5">
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Information Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white/[0.04] backdrop-blur-md rounded-[3rem] border border-white/[0.08] p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <User className="text-indigo-400" />
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="Full Name" value={user.full_name} icon={<User size={18}/>} />
              <InfoField label="Email Address" value={user.email || `${user.username.toLowerCase()}@ssiems.edu`} icon={<Mail size={18}/>} />
              <InfoField label="Institutional ID" value={user.username} icon={<Fingerprint size={18}/>} />
              <InfoField label="Role / Position" value={user.role} icon={<Shield size={18}/>} />
              <InfoField label="Department" value="Computer Science & Engineering" icon={<Briefcase size={18}/>} />
              <InfoField label="Academic Year" value="2025-26" icon={<Calendar size={18}/>} />
            </div>
          </div>

          {/* Academic / Professional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-[3rem] border border-white/10 p-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Award className="text-indigo-300" />
                </div>
                <h4 className="text-xl font-black text-white tracking-tight">Achievements</h4>
                <p className="text-white/50 font-medium">No recent awards documented. Participate in department hackathons to earn badges.</p>
                <button className="text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Browse badges <ArrowRight size={14} />
                </button>
              </div>
              <Award size={150} className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12" />
            </div>

            <div className="bg-white/[0.04] backdrop-blur-md rounded-[3rem] border border-white/[0.08] p-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <BookOpen className="text-purple-300" />
                </div>
                <h4 className="text-xl font-black text-white tracking-tight">Current Focus</h4>
                <p className="text-white/50 font-medium">
                  {user.role === 'STUDENT' 
                    ? 'Working on Advanced Data Structures and Machine Learning fundamentals.' 
                    : 'Streamlining departmental operations and enhancing student engagement metrics.'}
                </p>
              </div>
              <BookOpen size={150} className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12" />
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Sidebar */}
        <div className="space-y-8">
          {/* Identity Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-start">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Institutional Card</p>
                   <h4 className="text-2xl font-black tracking-tight">EduSense AI</h4>
                 </div>
                 <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                    <GraduationCap className="text-white/60" />
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="w-full h-12 bg-white/5 rounded-xl border border-white/10 flex items-center px-4">
                   <div className="w-8 h-1 bg-white/20 rounded-full" />
                 </div>
                 <div className="flex justify-between items-end">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Valid Until</p>
                     <p className="text-sm font-black">MAY 2026</p>
                   </div>
                   <div className="text-right space-y-1">
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Issued By</p>
                     <p className="text-sm font-black">SSIEMS CSE</p>
                   </div>
                 </div>
               </div>
             </div>
             {/* Abstract Circles */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
          </div>

          {/* Quick Links / Metadata */}
          <div className="bg-white/[0.04] backdrop-blur-md rounded-[3rem] border border-white/[0.08] p-10 space-y-6">
            <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Contact Details</h4>
            <div className="space-y-4">
              <ContactLink icon={<Phone size={18} className="text-indigo-400" />} label="Phone" value="+91 98XXX XXXXX" />
              <ContactLink icon={<MapPin size={18} className="text-indigo-400" />} label="Location" value="Parbhani, Maharashtra" />
            </div>
            <div className="pt-6 border-t border-white/5">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 text-center italic">Account created on Sept 2025</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── Sub-Components ─── */
const InfoField = ({ label, value, icon }: any) => (
  <div className="space-y-3 group/field">
    <div className="flex items-center gap-2 text-white/30 group-hover/field:text-indigo-400 transition-colors duration-300">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold tracking-tight group-hover/field:border-white/10 transition-all">
      {value || 'Not Specified'}
    </div>
  </div>
);

const ContactLink = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 group/link cursor-pointer">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:border-indigo-500/30 transition-all">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white/80 group-hover/link:text-white transition-colors">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
