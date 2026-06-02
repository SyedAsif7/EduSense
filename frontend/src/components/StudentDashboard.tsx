import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Cell, PieChart, Pie, Legend } from 'recharts';
import { 
  Bell, 
  BookOpen, 
  Target, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Brain,
  ShieldAlert,
  Flame,
  Star,
  GraduationCap
} from 'lucide-react';
import { studentService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = ({ rollNo }: { rollNo: string }) => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock subject data for "Weak/Strong" analysis
  const subjects = [
    { name: 'Database Management', score: 14.5, attendance: 82, total: 20, status: 'Strong', color: 'indigo' },
    { name: 'Machine Learning', score: 18.2, attendance: 95, total: 20, status: 'Exempt', color: 'purple' },
    { name: 'Theory of Computation', score: 8.5, attendance: 64, total: 20, status: 'Weak', color: 'red' },
    { name: 'Software Engineering', score: 12.0, attendance: 78, total: 20, status: 'Average', color: 'amber' },
    { name: 'Computer Networks', score: 15.8, attendance: 88, total: 20, status: 'Strong', color: 'emerald' },
  ];

  useEffect(() => {
    fetchReport();
  }, [rollNo]);

  const fetchReport = async () => {
    try {
      const res = await studentService.getReport(rollNo);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-white/40 uppercase tracking-[0.3em] text-xs">Syncing Academic Intelligence...</p>
    </div>
  );

  const radarData = [
    { subject: 'Attendance', A: report?.attendance_pct || 0, fullMark: 100 },
    { subject: 'CA Score', A: (report?.avg_ca_score / 20) * 100 || 0, fullMark: 100 },
    { subject: 'Lab Prep', A: report?.lab_completion_rate || 0, fullMark: 100 },
    { subject: 'Assignments', A: (report?.assignment_submission_rate / 5) * 100 || 0, fullMark: 100 },
    { subject: 'Engagement', A: 85, fullMark: 100 },
  ];

  const comparisonData = [
    { name: 'Attendance', You: report?.attendance_pct, Class: report?.class_averages?.attendance_pct },
    { name: 'CA Avg', You: report?.avg_ca_score, Class: report?.class_averages?.avg_ca_score },
    { name: 'Lab Score', You: report?.lab_completion_rate, Class: report?.class_averages?.lab_completion_rate },
  ];

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in duration-700 pb-20">
      {/* ─── Premium Header ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white/[0.04] backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/15 p-3 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <GraduationCap className="text-indigo-400 w-7 h-7" />
            </div>
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Student Command Center</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{report?.name || report?.roll_number}</span>
            </h1>
            <p className="text-white/40 font-bold text-xl tracking-tight max-w-2xl leading-relaxed">
              Your personalized academic performance matrix and AI-driven growth trajectory.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <div className="bg-white/5 px-8 py-6 rounded-[2.5rem] border border-white/10 text-center shadow-xl backdrop-blur-md">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Overall CGPA</p>
            <p className="text-4xl font-black text-white tracking-tighter">8.42</p>
          </div>
          <div className="bg-indigo-500/10 px-8 py-6 rounded-[2.5rem] border border-indigo-500/20 text-center shadow-xl backdrop-blur-md">
            <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] mb-2">Class Rank</p>
            <p className="text-4xl font-black text-indigo-400 tracking-tighter">#12</p>
          </div>
        </div>
        <Brain size={300} className="absolute right-[-60px] bottom-[-80px] text-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      {/* ─── KPI Quick Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <SummaryCard icon={<Activity className="text-emerald-400" />} label="Attendance" value={`${report?.attendance_pct?.toFixed(1)}%`} trend="+1.2%" positive sub="75% Threshold" />
        <SummaryCard icon={<Target className="text-blue-400" />} label="Avg CA Score" value={report?.avg_ca_score?.toFixed(1)} trend="+0.4" positive sub="Class Avg: 12.4" />
        <SummaryCard icon={<Flame className="text-orange-400" />} label="Active Streak" value="14 Days" trend="+2" positive sub="Daily Engagement" />
        <SummaryCard icon={<ShieldAlert className={report?.attendance_pct < 75 ? "text-red-400" : "text-indigo-400"} />} label="AI Risk Level" value={report?.attendance_pct < 75 ? "Medium" : "Low"} trend="Stable" positive sub="Predictive Status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── Subject Performance Grid ─── */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Subject Performance</h3>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] mt-1">Detailed Academic Breakdown</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">View All Subjects</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {subjects.map((subj, idx) => (
                <SubjectCard key={idx} subject={subj} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Sidebar: Analytics & AI ─── */}
        <div className="space-y-12">
          {/* Skill Radar */}
          <div className="bg-white/[0.04] backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/[0.08] shadow-2xl group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-white tracking-tighter">Skill Proficiency</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">Radar Analysis</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/20">
                <Brain className="text-indigo-400 w-5 h-5" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700}} />
                  <Radar name="Performance" dataKey="A" stroke="#818cf8" strokeWidth={3} fill="#818cf8" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tighter uppercase tracking-[0.1em]">AI Interventions</h3>
                <span className="bg-amber-500/15 text-amber-400 p-3 rounded-2xl border border-amber-500/20">
                  <Zap size={20} />
                </span>
              </div>
              
              <div className="space-y-8">
                <TipItem 
                  title="Critical Subject"
                  desc="Your performance in Theory of Computation is 32% below class average. Immediate focus required."
                  color="border-red-500"
                  icon={<ShieldAlert size={14} className="text-red-400" />}
                />
                <TipItem 
                  title="Growth Momentum"
                  desc="Positive trend in Database Management! You've climbed 4 positions in class rank."
                  color="border-emerald-500"
                  icon={<TrendingUp size={14} className="text-emerald-400" />}
                />
              </div>

              <button className="w-full mt-6 py-5 bg-white text-slate-950 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all">
                Request Mentor Session
              </button>
            </div>
            <Flame size={200} className="absolute right-[-40px] bottom-[-40px] text-white/[0.02] rotate-12" />
          </div>
        </div>
      </div>

      {/* ─── Comparison Analysis ─── */}
      <div className="bg-white/[0.04] backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/[0.08] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Benchmark Analysis</h3>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] mt-1">Comparison with Class Average</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Class Avg</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700}} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                contentStyle={{borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', padding: '15px', fontWeight: 'bold'}} 
              />
              <Bar dataKey="You" fill="#818cf8" radius={[12, 12, 0, 0]} barSize={40} />
              <Bar dataKey="Class" fill="rgba(255,255,255,0.08)" radius={[12, 12, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ─── Helper Components ─── */

const SubjectCard = ({ subject }: { subject: any }) => {
  const isWeak = subject.status === 'Weak';
  const isStrong = subject.status === 'Strong' || subject.status === 'Exempt';
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-[3rem] border border-white/[0.08] hover:border-white/20 transition-all shadow-xl group flex flex-col h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-4 rounded-[1.5rem] bg-${subject.color}-500/10 border border-${subject.color}-500/20 shadow-lg`}>
          <BookOpen className={`text-${subject.color}-400 w-6 h-6`} />
        </div>
        <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border shadow-lg ${
          isWeak ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
          isStrong ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isWeak ? 'bg-red-400 animate-pulse' : isStrong ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {subject.status}
        </div>
      </div>

      <div className="flex-1 mb-8 relative z-10">
        <h4 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors mb-2">{subject.name}</h4>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Semester VI Core</p>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Score</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tracking-tighter">{subject.score}</span>
            <span className="text-[10px] text-white/20">/{subject.total}</span>
          </div>
        </div>
        <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Att.</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-black tracking-tighter ${subject.attendance < 75 ? 'text-red-400' : 'text-white'}`}>{subject.attendance}%</span>
          </div>
        </div>
      </div>
      
      {isWeak && (
        <div className="absolute top-0 right-0 p-1">
          <div className="bg-red-500/20 backdrop-blur-md px-3 py-1 rounded-bl-2xl border-l border-b border-red-500/30">
            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Focus Needed</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const SummaryCard = ({ icon, label, value, trend, positive, sub }: any) => (
  <div className="bg-white/[0.04] backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all group shadow-xl">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-lg">
      {icon}
    </div>
    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">{label}</p>
    <div className="flex items-baseline gap-4 mb-2">
      <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      {trend && (
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg ${
          positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
    {sub && <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>}
  </div>
);

const TipItem = ({ title, desc, color, icon }: any) => (
  <div className={`border-l-4 ${color} pl-8 space-y-3 group/tip`}>
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/tip:border-white/20 transition-colors">
        {icon}
      </div>
      <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">{title}</h4>
    </div>
    <p className="text-sm text-white/50 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default StudentDashboard;
