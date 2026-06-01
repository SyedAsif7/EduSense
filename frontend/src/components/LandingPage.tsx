import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  BrainCircuit, 
  LineChart, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  MessageCircle,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Users className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">EduSense</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#tech" className="hover:text-indigo-600 transition-colors">Technology</a>
          </div>

          <button 
            onClick={onLoginClick}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
          >
            Portal Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100">
              AI-Powered Student Success System
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-10 leading-[1.1]">
              Predicting <span className="text-indigo-600">Success</span>,<br />
              Preventing Failure.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              An enterprise-grade educational analytics platform integrating Biometric Attendance, 
              Predictive ML Risk Scoring, and Explainable AI for actionable academic insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all hover:scale-105 flex items-center justify-center group"
              >
                Launch Dashboard
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all text-center">
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 relative"
          >
            <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full -z-10 opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Dashboard Preview" 
              className="rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 w-full object-cover h-[500px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Built for Institutional Excellence</h2>
            <p className="text-slate-500 font-bold text-lg">Four core pillars driving the next generation of education.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShieldCheck size={32} />}
              title="Biometric Attendance"
              description="Real-time facial recognition with 128-D biometric signatures for contactless, accurate tracking."
              color="indigo"
            />
            <FeatureCard 
              icon={<BrainCircuit size={32} />}
              title="Predictive Analytics"
              description="XGBoost & Random Forest ensemble models predicting student risk with 90%+ accuracy."
              color="purple"
            />
            <FeatureCard 
              icon={<BarChart3 size={32} />}
              title="Explainable AI"
              description="SHAP integration providing the 'Why' behind every risk flag for actionable interventions."
              color="amber"
            />
            <FeatureCard 
              icon={<MessageCircle size={32} />}
              title="Automated Alerts"
              description="Multi-channel notifications via SMS, WhatsApp, and Email for instant parent-teacher sync."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black leading-tight mb-8">Data-Driven Success for Every Student</h2>
            <p className="text-slate-400 text-xl leading-relaxed mb-12">
              EduSense empowers the Computer Science department at SSIEMS with real-time 
              intelligence, ensuring no student falls through the cracks.
            </p>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="text-5xl font-black text-indigo-400 mb-2">216</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Students</p>
              </div>
              <div>
                <p className="text-5xl font-black text-indigo-400 mb-2">95%</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Data Accuracy</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10">
              <div className="space-y-6">
                {[
                  "Automated Face Recognition Ingress",
                  "20+ Behavioral Feature Processing",
                  "Real-time SHAP Factor Calculation",
                  "Automated Multi-Channel Alerting"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <CheckCircle2 className="text-indigo-400" size={24} />
                    <span className="text-lg font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
          <h2 className="text-5xl md:text-6xl font-black mb-10 tracking-tight">Ready to transform your department?</h2>
          <button 
            onClick={onLoginClick}
            className="bg-white text-indigo-600 px-12 py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
          >
            Access Portal Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-10">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Users className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">EduSense</span>
          </div>
          <p className="text-slate-400 font-bold text-sm">
            Developed for SSIEMS Computer Science & Engineering Department.
          </p>
          <div className="flex space-x-8 text-sm font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: any) => {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className={`${colors[color]} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
