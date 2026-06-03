import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  GraduationCap, 
  Users, 
  Linkedin,
  Globe,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Layout,
  Bell,
  ArrowRight
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const teamMembers = [
    {
      name: "Syed Asif Syed Gaffar",
      role: "Lead Developer",
      linkedin: "https://www.linkedin.com/in/the-syed-asif",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      name: "Arpita Mukund Jondhale",
      role: "Researcher & Developer",
      linkedin: "https://www.linkedin.com/in/arpita-jondhale-87816629a",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Gayatri Shriram Bharose",
      role: "Data Analyst",
      linkedin: "https://www.linkedin.com/in/gayatri-bharose-68a059292",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-20 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Header Section ─── */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} />
          Project Overview
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">EduSense</span>
        </h1>
        <p className="max-w-2xl mx-auto text-white/50 text-lg font-medium leading-relaxed">
          Bridging the gap between data and academic success through state-of-the-art AI intelligence.
        </p>
      </motion.div>

      {/* ─── Project Description (Paragraph Format) ─── */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-[3rem] blur-2xl transition-all group-hover:from-indigo-500/10 group-hover:to-purple-500/10" />
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 md:p-16 space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <Info size={28} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Project Details</h2>
          </div>
          
          <div className="text-white/70 text-lg leading-relaxed font-light">
            <p>
              EduSense revolutionizes classroom management by combining real-time biometric facial recognition with advanced machine learning for predictive risk assessment. Using 128-D biometric signatures for automated attendance and transparent SHAP insights for early academic warning, the platform provides role-based smart dashboards and multi-channel auto alerts (SMS, WhatsApp, and Email) to ensure a seamless, data-driven ecosystem for student success and proactive intervention.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Team & Guidance ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Our Team */}
        <motion.div variants={itemVariants} className="bg-white/[0.03] backdrop-blur-md rounded-[3rem] border border-white/10 p-10 md:p-12">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Core Developers</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {teamMembers.map((member, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 10 }}
                className="group flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{member.name}</h4>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mt-1">{member.role}</p>
                  </div>
                </div>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white/5 text-white/20 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                >
                  <Linkedin size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guidance */}
        <motion.div variants={itemVariants} className="bg-white/[0.03] backdrop-blur-md rounded-[3rem] border border-white/10 p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <GraduationCap size={160} />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Academic Guidance</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="group p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap size={40} />
                </div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Project Guide & H.O.D</p>
                <h3 className="text-3xl font-black text-white tracking-tight">Prof. Pawar V.K.</h3>
                <p className="text-indigo-400/60 font-medium text-sm">Department of Computer Science & Engineering</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe size={14} />
              SSIEMS Parbhani
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
