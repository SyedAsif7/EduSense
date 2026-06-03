import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  BrainCircuit, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  MessageCircle,
  BarChart3,
  ChevronDown,
  Globe,
  Database,
  Cpu,
  GraduationCap,
  TrendingUp,
  Eye,
  Bell,
  Activity,
  Lock,
  Sparkles,
  ArrowUpRight,
  Play,
  Menu,
  X,
  Linkedin,
  BookOpen,
  Award,
  Info,
  Layout
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
     {
       name: "Syed Asif Syed Gaffar",
       role: "Lead Developer",
       linkedin: "https://www.linkedin.com/in/the-syed-asif"
     },
     {
       name: "Arpita Mukund Jondhale",
       role: "Researcher & Developer",
       linkedin: "https://www.linkedin.com/in/arpita-jondhale-87816629a"
     },
     {
       name: "Gayatri Shriram Bharose",
       role: "Data Analyst",
       linkedin: "https://www.linkedin.com/in/gayatri-bharose-68a059292"
     }
   ];

  return (
    <div className="min-h-screen font-sans text-white overflow-x-hidden relative bg-slate-950">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/background_poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
          onCanPlayThrough={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          <source src="/background_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950" />
      </div>

      {/* Content */}
      <div className="relative z-10">

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-5'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">EduSense</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-1">
              {['Features', 'Technology', 'About'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoginClick}
                className="hidden md:flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full font-medium text-sm hover:bg-white/90 transition-all"
              >
                Get Started
                <ArrowUpRight size={16} />
              </motion.button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 mt-3"
            >
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
                {['Features', 'Technology', 'About'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    {item}
                  </a>
                ))}
                <button onClick={onLoginClick} className="w-full mt-2 bg-white text-slate-900 px-5 py-3 rounded-full font-medium text-sm">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale, willChange: 'transform, opacity' }} 
          className="min-h-screen flex items-center justify-center px-6 relative"
        >
          <div className="max-w-6xl mx-auto text-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-sm mb-10 border border-white/10"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>AI-Powered Academic Intelligence</span>
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight mb-8 leading-[1.05]">
                Where Data Meets
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Student Success
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                Transform attendance tracking, predict academic outcomes, and intervene early with our AI-powered intelligence platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLoginClick}
                  className="group w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  Launch Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <a 
                  href="#features" 
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 text-white/90 hover:text-white px-8 py-4 rounded-full font-medium text-base border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
                >
                  <Play size={16} className="group-hover:scale-110 transition-transform" />
                  See How It Works
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <StatPill value="95%" label="Accuracy" />
              <StatPill value="500+" label="Students" />
              <StatPill value="24/7" label="Monitoring" />
              <StatPill value="< 1s" label="Recognition" />
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-white/50" 
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-20"
            >
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4">
                <Sparkles size={16} />
                <span className="uppercase tracking-widest">Core Capabilities</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Everything you need to transform student outcomes
              </h2>
              <p className="text-lg text-white/65 leading-relaxed">
                A comprehensive suite of tools designed for modern educational institutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Eye size={24} />}
                title="Biometric Attendance"
                description="Facial recognition with 128-D embeddings. No cards, no pins — just walk in and get marked present automatically."
                features={["99.2% recognition accuracy", "Real-time processing", "Anti-spoofing protection"]}
                accentColor="indigo"
                index={0}
              />
              <FeatureCard 
                icon={<BrainCircuit size={24} />}
                title="Predictive Analytics"
                description="Machine learning models that identify at-risk students weeks before traditional methods."
                features={["Ensemble ML models", "Early warning system", "Trend analysis"]}
                accentColor="purple"
                index={1}
              />
              <FeatureCard 
                icon={<BarChart3 size={24} />}
                title="Explainable AI (XAI)"
                description="Understand every prediction with SHAP values. No black boxes — complete transparency."
                features={["SHAP analysis", "Feature importance", "Decision insights"]}
                accentColor="emerald"
                index={2}
              />
              <FeatureCard 
                icon={<Bell size={24} />}
                title="Smart Notifications"
                description="Automated alerts to parents, students, and faculty through SMS, WhatsApp, and email."
                features={["Multi-channel delivery", "Customizable triggers", "Delivery tracking"]}
                accentColor="amber"
                index={3}
              />
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4">
                  <Activity size={16} />
                  <span className="uppercase tracking-widest">Live Dashboard</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
                  Real-time insights at your fingertips
                </h2>
                <p className="text-white/65 text-lg leading-relaxed mb-10">
                  Monitor attendance trends, track risk levels, and make data-driven decisions with our intuitive dashboard.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: <Database size={18} />, text: "PostgreSQL-backed real-time data" },
                    { icon: <Cpu size={18} />, text: "XGBoost + Random Forest ensemble" },
                    { icon: <Globe size={18} />, text: "Accessible from any device" },
                    { icon: <Lock size={18} />, text: "Role-based access control" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-white/80 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Dashboard Preview Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full" />
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-white/30">EduSense Dashboard</span>
                    <div className="w-12" />
                  </div>
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Mini stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      <DashStat icon={<Users size={16} />} value="216" label="Active" color="indigo" />
                      <DashStat icon={<TrendingUp size={16} />} value="78.5%" label="Attendance" color="emerald" />
                      <DashStat icon={<Activity size={16} />} value="34" label="At Risk" color="amber" />
                    </div>
                    {/* Chart placeholder */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-white/50">Weekly Attendance</span>
                        <span className="text-xs text-emerald-400 font-medium">+5.2% ↑</span>
                      </div>
                      <div className="flex items-end gap-2 h-24">
                        {[65, 72, 68, 80, 75, 82, 78].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400/80 rounded-lg"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                          <span key={i} className="text-[10px] text-white/30 flex-1 text-center">{d}</span>
                        ))}
                      </div>
                    </div>
                    {/* Risk indicators */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-center">
                        <span className="text-emerald-400 text-lg font-bold">68%</span>
                        <span className="text-white/40 text-xs ml-1">Low</span>
                      </div>
                      <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-center">
                        <span className="text-amber-400 text-lg font-bold">22%</span>
                        <span className="text-white/40 text-xs ml-1">Med</span>
                      </div>
                      <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                        <span className="text-red-400 text-lg font-bold">10%</span>
                        <span className="text-white/40 text-xs ml-1">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium mb-4">
                <Zap size={16} />
                <span className="uppercase tracking-widest">Workflow</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How EduSense Works</h2>
              <p className="text-white/65 text-lg max-w-2xl mx-auto">From entry to insight in seconds.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Walk In", desc: "Student enters classroom and camera detects face", icon: <Eye size={20} /> },
                { step: "02", title: "Recognize", desc: "128-D embedding matched against enrolled database", icon: <ShieldCheck size={20} /> },
                { step: "03", title: "Analyze", desc: "ML models update risk score in real-time", icon: <BrainCircuit size={20} /> },
                { step: "04", title: "Alert", desc: "Stakeholders notified if intervention needed", icon: <Bell size={20} /> }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative group"
                >
                  {i < 3 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" />
                  )}
                  <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group-hover:bg-white/10">
                    <div className="text-white/20 text-5xl font-bold absolute top-4 right-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                Project Intelligence
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">EduSense</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                A sophisticated blend of biometric security and machine learning designed to elevate academic standards.
              </p>
            </motion.div>

            <div className="space-y-12">
              {/* Project Details Paragraphs */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 md:p-16"
              >
                <div className="text-white/70 text-lg leading-relaxed font-light">
                  <p>
                    EduSense revolutionizes classroom management by combining real-time biometric facial recognition with advanced machine learning for predictive risk assessment. Using 128-D biometric signatures for automated attendance and transparent SHAP insights for early academic warning, the platform provides role-based smart dashboards and multi-channel auto alerts (SMS, WhatsApp, and Email) to ensure a seamless, data-driven ecosystem for student success and proactive intervention.
                  </p>
                </div>
              </motion.div>

              {/* Team & Guidance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] border border-white/10 p-10"
                >
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                    <Users size={24} className="text-purple-400" />
                    Our Team
                  </h3>
                  <div className="space-y-4">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="group flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-white font-bold text-sm">
                            {member.name[0]}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">{member.name}</h4>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{member.role}</p>
                          </div>
                        </div>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-white/30 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                          <Linkedin size={18} />
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Guidance */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] border border-white/10 p-10 flex flex-col justify-center text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                    <GraduationCap size={32} />
                  </div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Project Guide & H.O.D</p>
                  <h3 className="text-2xl font-black text-white mb-2">Prof. Pawar V.K.</h3>
                  <p className="text-white/50 text-sm">Department of Computer Science & Engineering</p>
                  <div className="mt-8 pt-8 border-t border-white/5 text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    SSIEMS Parbhani
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Final CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <div className="relative bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-[3rem] p-12 border border-white/10 overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to Experience the Future?</h3>
                  <p className="text-white/50 mb-10 max-w-lg mx-auto font-light">Join us in transforming educational standards with AI-driven intelligence.</p>
                  <button 
                    onClick={onLoginClick}
                    className="bg-white text-slate-900 px-12 py-4 rounded-full font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                  >
                    Launch Portal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <GraduationCap className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white">EduSense</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 text-sm font-medium">MSPM's SSIEMS CSE Department</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-white/40">
                <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
                <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
                <span>© 2026</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

// --- Sub Components ---

const StatPill = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10">
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    <div className="text-white/55 text-sm mt-0.5 font-medium">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description, features, accentColor, index }: any) => {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-blue-500 shadow-indigo-500/20",
    purple: "from-purple-500 to-pink-500 shadow-purple-500/20",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/20"
  };
  const iconBgMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${iconBgMap[accentColor]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-5">{description}</p>
      <div className="space-y-2">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-white/50" />
            <span className="text-white/65 text-sm">{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const DashStat = ({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) => {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400"
  };
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
      <div className={`${colorMap[color]} mb-1`}>{icon}</div>
      <div className="text-white/80 text-lg font-semibold">{value}</div>
      <div className="text-white/45 text-xs font-medium">{label}</div>
    </div>
  );
};

export default LandingPage;
