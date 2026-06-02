import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  AlertTriangle, 
  GraduationCap, 
  Calendar, 
  Download, 
  Filter, 
  UserCheck, 
  Settings, 
  Briefcase,
  BookOpen,
  ArrowUpRight,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  Search,
  BarChart3,
  Activity,
  Target,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hodService, studentService } from '../services/api';

/* ─── Props ─── */
interface HODDashboardProps {
  view?: 'dashboard' | 'trends';
}

/* ─── Mock trend data ─── */
const MONTHLY_ATTENDANCE_TREND = [
  { month: 'Jun', FE: 82, SE: 78, TE: 80, BE: 75 },
  { month: 'Jul', FE: 85, SE: 80, TE: 82, BE: 77 },
  { month: 'Aug', FE: 83, SE: 79, TE: 78, BE: 74 },
  { month: 'Sep', FE: 87, SE: 82, TE: 84, BE: 79 },
  { month: 'Oct', FE: 89, SE: 85, TE: 83, BE: 81 },
  { month: 'Nov', FE: 86, SE: 83, TE: 86, BE: 80 },
  { month: 'Dec', FE: 84, SE: 81, TE: 82, BE: 78 },
  { month: 'Jan', FE: 88, SE: 84, TE: 85, BE: 82 },
  { month: 'Feb', FE: 90, SE: 86, TE: 87, BE: 84 },
  { month: 'Mar', FE: 91, SE: 87, TE: 88, BE: 85 },
];

const SEMESTER_PERFORMANCE = [
  { sem: 'Sem 1', avg_score: 68, pass_rate: 82, distinction: 15 },
  { sem: 'Sem 2', avg_score: 71, pass_rate: 85, distinction: 18 },
  { sem: 'Sem 3', avg_score: 65, pass_rate: 78, distinction: 12 },
  { sem: 'Sem 4', avg_score: 73, pass_rate: 87, distinction: 20 },
  { sem: 'Sem 5', avg_score: 70, pass_rate: 84, distinction: 17 },
  { sem: 'Sem 6', avg_score: 76, pass_rate: 89, distinction: 22 },
  { sem: 'Sem 7', avg_score: 78, pass_rate: 91, distinction: 25 },
  { sem: 'Sem 8', avg_score: 80, pass_rate: 93, distinction: 28 },
];

const BATCH_COMPARISON = [
  { batch: 'FE (2025)', students: 120, avg_attendance: 87, avg_score: 72, at_risk: 15 },
  { batch: 'SE (2024)', students: 110, avg_attendance: 83, avg_score: 70, at_risk: 22 },
  { batch: 'TE (2023)', students: 95, avg_attendance: 84, avg_score: 74, at_risk: 18 },
  { batch: 'BE (2022)', students: 85, avg_attendance: 81, avg_score: 78, at_risk: 12 },
];

const RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 68, color: '#10b981' },
  { name: 'Medium Risk', value: 22, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const SUBJECT_TRENDS = [
  { subject: 'DSA', sem1: 65, sem2: 70, sem3: 75 },
  { subject: 'DBMS', sem1: 72, sem2: 76, sem3: 80 },
  { subject: 'OS', sem1: 68, sem2: 72, sem3: 74 },
  { subject: 'CN', sem1: 60, sem2: 68, sem3: 73 },
  { subject: 'ML', sem1: 75, sem2: 78, sem3: 82 },
  { subject: 'Web Tech', sem1: 80, sem2: 83, sem3: 86 },
];

/* ─── Main Component ─── */
const HODDashboard: React.FC<HODDashboardProps> = ({ view = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState<any>(null);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, facultyRes, studentRes] = await Promise.all([
        hodService.getDeptStats(),
        hodService.getFaculties(),
        studentService.getRiskHeatmap()
      ]);
      setStats(statsRes.data);
      setFaculties(facultyRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-white/40 uppercase tracking-widest text-sm">Loading Department Intelligence...</p>
    </div>
  );

  /* ─── Trends View ─── */
  if (view === 'trends') {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-20">
        {/* Trends Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500/15 p-2.5 rounded-2xl border border-emerald-500/20">
                <BarChart3 className="text-emerald-400 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em]">Department Trends</span>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">Trend Analysis</h1>
            <p className="text-white/50 font-medium text-lg">Computer Science & Engineering • Academic Trends 2022-26</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center group">
              <Download size={18} className="mr-2 group-hover:translate-y-1 transition-transform" />
              Export Trends
            </button>
          </div>
        </div>

        {/* Trend KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrendKPI icon={<Activity className="text-emerald-400" />} label="Attendance Trend" value="85.2%" change="+3.4%" positive direction="up" sub="vs last semester" color="emerald" />
          <TrendKPI icon={<Target className="text-blue-400" />} label="Pass Rate Trend" value="89.5%" change="+5.1%" positive direction="up" sub="vs last semester" color="blue" />
          <TrendKPI icon={<AlertTriangle className="text-amber-400" />} label="At Risk Trend" value="67" change="-12%" positive direction="down" sub="vs last semester" color="amber" />
          <TrendKPI icon={<GraduationCap className="text-purple-400" />} label="Distinction Rate" value="24%" change="+6%" positive direction="up" sub="vs last semester" color="purple" />
        </div>

        {/* Row 1: Monthly Attendance + Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Monthly Attendance Trends</h3>
                <p className="text-white/40 font-medium text-sm mt-1">Batch-wise attendance over the past 10 months</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <TrendingUp size={14} />
                <span className="text-xs font-bold">+3.4%</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_ATTENDANCE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[70, 95]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)' }} contentStyle={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }} />
                  <Line type="monotone" dataKey="FE" stroke="#818cf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="SE" stroke="#a78bfa" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="TE" stroke="#34d399" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="BE" stroke="#fbbf24" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution Pie */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-xl font-bold mb-2">Risk Distribution</h3>
              <p className="text-white/40 text-sm font-medium mb-6">Current department-wide risk status</p>
            </div>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RISK_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {RISK_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {RISK_DISTRIBUTION.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                    <span className="text-sm font-medium text-white/60">{r.name}</span>
                  </div>
                  <span className="text-lg font-bold">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Semester Performance */}
        <div className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Semester Performance Progression</h3>
              <p className="text-white/40 font-medium text-sm mt-1">Average scores, pass rates, and distinction rates across semesters</p>
            </div>
            <div className="flex items-center gap-1 text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-xl border border-blue-500/20">
              <TrendingUp size={14} />
              <span className="text-xs font-bold">Improving</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SEMESTER_PERFORMANCE}>
                <defs>
                  <linearGradient id="gradPass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDistinction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)' }} contentStyle={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }} />
                <Area type="monotone" dataKey="pass_rate" stroke="#818cf8" strokeWidth={2.5} fill="url(#gradPass)" name="Pass Rate %" />
                <Area type="monotone" dataKey="avg_score" stroke="#a78bfa" strokeWidth={2.5} fill="url(#gradDistinction)" name="Avg Score" />
                <Area type="monotone" dataKey="distinction" stroke="#34d399" strokeWidth={2.5} fill="url(#gradDistinction)" name="Distinction %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Batch Comparison + Subject Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Batch Comparison */}
          <div className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Batch Comparison</h3>
                <p className="text-white/40 font-medium text-sm mt-1">Attendance & performance by batch</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BATCH_COMPARISON} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} />
                  <YAxis type="category" dataKey="batch" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }} width={90} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }} />
                  <Bar dataKey="avg_attendance" fill="#818cf8" radius={[0, 6, 6, 0]} barSize={16} name="Avg Attendance" />
                  <Bar dataKey="avg_score" fill="#34d399" radius={[0, 6, 6, 0]} barSize={16} name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Trends */}
          <div className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Subject-wise Trends</h3>
                <p className="text-white/40 font-medium text-sm mt-1">Score progression across semesters</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SUBJECT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} />
                  <YAxis domain={[55, 95]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }} />
                  <Line type="monotone" dataKey="sem1" stroke="rgba(255,255,255,0.3)" strokeWidth={2} dot={{ r: 3 }} name="Sem 1" />
                  <Line type="monotone" dataKey="sem2" stroke="#818cf8" strokeWidth={2} dot={{ r: 3 }} name="Sem 2" />
                  <Line type="monotone" dataKey="sem3" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} name="Sem 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insight Banner */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-[3rem] p-10 text-white relative overflow-hidden border border-white/10">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">AI Trend Insight</span>
              </div>
              <h3 className="text-2xl font-bold leading-tight max-w-xl">Attendance and performance show consistent upward trends across all batches over the last 3 semesters.</h3>
              <p className="text-white/50 font-medium text-sm">SE batch shows the most improvement (+8.2% attendance). CN subject needs attention in FE batch.</p>
            </div>
            <button className="bg-white/10 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center gap-2 whitespace-nowrap">
              View Full Report
              <ArrowUpRight size={16} />
            </button>
          </div>
          <BarChart3 size={200} className="absolute right-[-40px] bottom-[-60px] text-white/[0.03] rotate-12" />
        </div>
      </div>
    );
  }

  /* ─── Default Dashboard View ─── */
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/15 p-2.5 rounded-2xl border border-indigo-500/20">
              <ShieldCheck className="text-indigo-400 w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em]">HOD Control Center</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Departmental Intelligence</h1>
          <p className="text-white/50 font-medium text-lg">Computer Science & Engineering • Academic Year 2025-26</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center group">
            <Download size={18} className="mr-2 group-hover:translate-y-1 transition-transform" />
            Full Audit Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white/5 backdrop-blur-sm p-2 rounded-[2rem] border border-white/10 w-fit mx-auto lg:mx-0">
        <TabButton id="analytics" label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<TrendingUp size={18}/>} />
        <TabButton id="faculties" label="Faculties" active={activeTab === 'faculties'} onClick={() => setActiveTab('faculties')} icon={<Briefcase size={18}/>} />
        <TabButton id="students" label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18}/>} />
        <TabButton id="management" label="Management" active={activeTab === 'management'} onClick={() => setActiveTab('management')} icon={<Settings size={18}/>} />
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analytics' && <AnalyticsView stats={stats} />}
          {activeTab === 'faculties' && <FacultyListView faculties={faculties} />}
          {activeTab === 'students' && <StudentListView students={students} />}
          {activeTab === 'management' && <ManagementView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── Trend KPI Card ─── */
const TrendKPI = ({ icon, label, value, change, positive, direction, sub, color }: any) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  };
  const changeColor = positive
    ? 'text-emerald-400 bg-emerald-500/15'
    : 'text-red-400 bg-red-500/15';

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white/[0.04] backdrop-blur-md p-8 rounded-[2rem] border border-white/[0.08] hover:border-white/15 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-end gap-3 mb-2">
        <h4 className="text-3xl font-bold text-white tracking-tight">{value}</h4>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${changeColor}`}>
          {direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="text-[11px] font-bold">{change}</span>
        </div>
      </div>
      <p className="text-xs font-medium text-white/40">{sub}</p>
    </motion.div>
  );
};

/* ─── Tab Button ─── */
const TabButton = ({ id, label, active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-8 py-3.5 rounded-[1.5rem] text-sm font-bold uppercase tracking-widest transition-all ${
      active ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white/70'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* ─── Analytics View ─── */
const AnalyticsView = ({ stats }: any) => {
  if (!stats) return <div className="p-10 text-center font-medium text-white/40">Unable to load analytics data.</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Users className="text-indigo-400" />} label="Total Enrollment" value={stats.total_students} trend="+8.4% growth" color="indigo" />
        <StatCard icon={<AlertTriangle className="text-amber-400" />} label="At Risk Pipeline" value={stats.at_risk_count} trend="-12% improvement" color="amber" />
        <StatCard icon={<UserCheck className="text-emerald-400" />} label="Avg. Attendance" value={`${stats.avg_attendance}%`} trend="+2.5% vs prev sem" color="green" />
        <StatCard icon={<GraduationCap className="text-purple-400" />} label="Dept. Success" value={`${stats.avg_success_rate}%`} trend="+1.2% target hit" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08]">
          <h3 className="text-2xl font-bold text-white tracking-tight mb-10">Batch Performance Matrix</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.batch_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff'}} />
                <Bar dataKey="students" fill="#818cf8" radius={[8, 8, 0, 0]} name="Total Students" />
                <Bar dataKey="risk" fill="#fbbf24" radius={[8, 8, 0, 0]} name="At Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl shadow-indigo-500/15">
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-bold leading-tight">AI Strategy Insight</h3>
            <p className="text-indigo-200 text-lg font-medium leading-relaxed">
              Predictive analysis indicates a 22% decrease in failure rates for the BE batch if 4th-week interventions are prioritized.
            </p>
            <button className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/25 transition-all flex items-center shadow-xl">
              Apply Recommendations
              <ArrowUpRight size={18} className="ml-2" />
            </button>
          </div>
          <BookOpen size={200} className="absolute right-[-60px] bottom-[-60px] text-white/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
};

/* ─── Faculty List View ─── */
const FacultyListView = ({ faculties }: any) => (
  <div className="bg-white/[0.04] backdrop-blur-md rounded-[3rem] border border-white/[0.08] overflow-hidden">
    <div className="p-10 border-b border-white/5 flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Faculty Directory</h3>
        <p className="text-white/40 font-medium text-sm">Managing 12 full-time department faculty members</p>
      </div>
      <button className="bg-white/5 text-white/60 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
        Add New Faculty
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Faculty Member</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Code</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Role</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Active Subjects</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {faculties.map((f: any, i: number) => (
            <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
              <td className="px-10 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform border border-indigo-500/20">
                    {f.full_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{f.full_name}</p>
                    <p className="text-xs font-medium text-white/40">{f.username.toLowerCase()}@ssiems.edu</p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className="bg-white/5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/50 border border-white/5">{f.username}</span>
              </td>
              <td className="px-10 py-6">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                  f.role === 'HOD' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                }`}>
                  {f.role}
                </span>
              </td>
              <td className="px-10 py-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(item => (
                    <div key={item} className="w-8 h-8 rounded-full bg-white/5 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white/30">
                      C{item}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white/30">
                    +2
                  </div>
                </div>
              </td>
              <td className="px-10 py-6 text-right">
                <button className="p-2 text-white/20 hover:text-indigo-400 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Student List View ─── */
const StudentListView = ({ students }: any) => (
  <div className="bg-white/[0.04] backdrop-blur-md rounded-[3rem] border border-white/[0.08] overflow-hidden">
    <div className="p-10 border-b border-white/5 flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Department-wide Students</h3>
        <p className="text-white/40 font-medium text-sm">Global monitoring across all academic batches</p>
      </div>
      <div className="flex space-x-2">
        <button className="p-3 bg-white/5 text-white/40 rounded-2xl hover:text-indigo-400 transition-all border border-white/10">
          <Filter size={20} />
        </button>
        <button className="p-3 bg-white/5 text-white/40 rounded-2xl hover:text-indigo-400 transition-all border border-white/10">
          <Search size={20} />
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Student Roll No</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Risk Level</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Confidence</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Batch</th>
            <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {students.slice(0, 10).map((s: any, i: number) => (
            <tr key={i} className="hover:bg-white/[0.03] transition-colors">
              <td className="px-10 py-6 font-bold text-white">{s.roll_no}</td>
              <td className="px-10 py-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                  s.risk === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : s.risk === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {s.risk} Risk
                </span>
              </td>
              <td className="px-10 py-6">
                <div className="flex items-center space-x-3 w-40">
                  <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${s.prob * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white">{(s.prob * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="px-10 py-6 font-medium text-white/50">BE 2026</td>
              <td className="px-10 py-6">
                <div className="flex items-center text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  Active
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-8 bg-white/[0.02] border-t border-white/5 text-center">
      <button className="text-indigo-400 font-bold text-sm uppercase tracking-[0.2em] hover:text-indigo-300">
        Load All 216 Students
      </button>
    </div>
  </div>
);

/* ─── Management View ─── */
const ManagementView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div className="bg-white/[0.04] backdrop-blur-md p-12 rounded-[3rem] border border-white/[0.08] space-y-8">
      <h3 className="text-3xl font-bold text-white tracking-tight">System Configuration</h3>
      <div className="space-y-6">
        <ConfigItem label="Risk Threshold" value="0.65" sub="ML Confidence level for 'High Risk' classification" />
        <ConfigItem label="Attendance Alert" value="75%" sub="Threshold for parent SMS notification" />
        <ConfigItem label="Data Sync Frequency" value="6 Hours" sub="Automated ingestion from marks CSV" />
      </div>
      <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-5 rounded-[2rem] font-bold uppercase tracking-widest text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
        Update Global Settings
      </button>
    </div>
    
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-500/15">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold">Security Audit</h3>
          <p className="text-indigo-200 font-medium leading-relaxed">
            Your department's data integrity is protected. Last audit performed 14 hours ago.
          </p>
          <div className="flex items-center space-x-3 bg-white/15 w-fit px-4 py-2 rounded-xl">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">SQLite Protected</span>
          </div>
        </div>
        <GraduationCap size={200} className="absolute right-[-40px] bottom-[-40px] text-white/5 rotate-12" />
      </div>

      <div className="bg-white/[0.04] backdrop-blur-md p-12 rounded-[3rem] border border-white/[0.08] space-y-6">
        <h3 className="text-xl font-bold text-white">Mentor Assignments</h3>
        <p className="text-white/40 font-medium">Auto-assign mentors to High Risk students based on faculty availability.</p>
        <button className="flex items-center text-indigo-400 font-bold text-xs uppercase tracking-widest group">
          Manage Assignments
          <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

/* ─── Shared Components ─── */
const ConfigItem = ({ label, value, sub }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
    <div>
      <p className="font-bold text-white mb-1">{label}</p>
      <p className="text-xs font-medium text-white/40">{sub}</p>
    </div>
    <span className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-bold text-indigo-400">{value}</span>
  </div>
);

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/[0.04] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/[0.08] hover:border-white/15 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{label}</p>
      <h4 className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</h4>
      <p className="text-xs font-medium text-white/50 tracking-tight">{trend}</p>
    </motion.div>
  );
};

export default HODDashboard;
