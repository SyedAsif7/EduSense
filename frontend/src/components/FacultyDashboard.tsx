import React, { useState, useEffect } from 'react';
import { studentService, alertService, authService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Users, 
  Search, 
  Filter, 
  AlertCircle, 
  MessageSquare,
  Mail,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  Target,
  Activity,
  Award,
  Calendar,
  ShieldCheck,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FacultyDashboardProps {
  view?: 'dashboard' | 'risk';
  externalSearch?: string;
  onSearchChange?: (val: string) => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ 
  view = 'dashboard', 
  externalSearch = '',
  onSearchChange
}) => {
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Synchronize local search with external search
  useEffect(() => {
    if (externalSearch !== undefined && externalSearch !== searchTerm) {
      setSearchTerm(externalSearch);
    }
  }, [externalSearch]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Mock data for trends
  const attendanceTrend = [
    { name: 'Week 1', attendance: 82 },
    { name: 'Week 2', attendance: 85 },
    { name: 'Week 3', attendance: 80 },
    { name: 'Week 4', attendance: 88 },
    { name: 'Week 5', attendance: 84 },
    { name: 'Week 6', attendance: 90 },
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: heatmap.filter(s => s.risk === 'Low').length, color: '#10b981' },
    { name: 'Medium Risk', value: heatmap.filter(s => s.risk === 'Medium').length, color: '#f59e0b' },
    { name: 'High Risk', value: heatmap.filter(s => s.risk === 'High').length, color: '#ef4444' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [heatmapRes, userRes] = await Promise.all([
        studentService.getRiskHeatmap(),
        authService.getMe()
      ]);
      setHeatmap(heatmapRes.data);
      setUser(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = heatmap.filter(student => {
    const rollNo = (student.roll_no || '').toLowerCase();
    const name = (student.name || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = rollNo.includes(search) || name.includes(search);
    const matchesFilter = filter === 'All' || student.risk === filter;
    
    return matchesSearch && matchesFilter;
  });

  const sendAlert = async (roll_no: string, type: string) => {
    try {
      await alertService.sendAlert({ roll_no, type });
      alert(`${type} alert sent to student ${roll_no}`);
    } catch (err) {
      alert('Failed to send alert');
    }
  };

  const openDetails = async (roll_no: string) => {
    try {
      const res = await studentService.getReport(roll_no);
      setSelectedStudent(res.data);
    } catch (err) {
      alert('Failed to fetch details');
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20">
      {view === 'dashboard' ? (
        <DashboardView 
          user={user} 
          heatmap={heatmap} 
          attendanceTrend={attendanceTrend} 
          riskDistribution={riskDistribution} 
        />
      ) : (
        <RiskAnalysisView 
          user={user}
          heatmap={heatmap}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          filteredData={filteredData}
          sendAlert={sendAlert}
          openDetails={openDetails}
        />
      )}

      {/* Details Modal (shared by both views) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900/95 backdrop-blur-2xl w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
            >
              <div className="p-8 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/30">
                      {selectedStudent.roll_number.slice(-2)}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-white tracking-tight">{selectedStudent.roll_number}</h2>
                      <p className="text-lg font-medium text-white/40">Department of Computer Engineering</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl transition-colors border border-white/10"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center uppercase tracking-widest text-xs">
                        <Info size={18} className="mr-2 text-indigo-400" />
                        ML Risk Factors (SHAP Analysis)
                      </h3>
                      <div className="space-y-4">
                        {selectedStudent.top_factors?.map((f: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                            <span className="font-bold text-white/80">{f.factor}</span>
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-tighter ${
                              f.impact === 'Positive' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}>
                              {f.impact} Impact
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <SummaryCard label="Attendance %" value={`${selectedStudent.attendance_pct.toFixed(1)}%`} sub="Threshold: 75%" />
                      <SummaryCard label="Avg CA Score" value={selectedStudent.avg_ca_score.toFixed(1)} sub="Class Avg: 12.4" />
                      <SummaryCard label="Absence Streak" value={selectedStudent.absent_streak} sub="Consecutive days" />
                      <SummaryCard label="Trend Slope" value={selectedStudent.ca_trend_slope.toFixed(2)} sub="Performance trajectory" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4">Intervention Plan</h3>
                        <p className="text-indigo-200 font-medium leading-relaxed mb-8">
                          AI recommends immediate mentor counseling due to declining CA scores and high absence streak.
                        </p>
                        <button className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-50 transition-colors">
                          Schedule Session
                        </button>
                      </div>
                      <AlertCircle size={150} className="absolute right-[-40px] bottom-[-40px] text-white/5 -rotate-12" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Dashboard View ─── */
const DashboardView = ({ user, heatmap, attendanceTrend, riskDistribution }: any) => {
  const highRiskCount = heatmap.filter((s: any) => s.risk === 'High').length;
  
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/[0.04] backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/[0.08] shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500/15 p-3 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <Award className="text-indigo-400 w-7 h-7" />
            </div>
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Faculty Command Center</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
            {user?.class_name || 'Class'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dashboard</span>
          </h1>
          <p className="text-white/40 font-bold text-xl tracking-tight max-w-2xl leading-relaxed">
            Real-time academic performance summary and AI-driven risk distribution for the current semester.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/5 px-8 py-6 rounded-[2.5rem] border border-white/10 text-center shadow-xl">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Total Students</p>
            <p className="text-4xl font-black text-white tracking-tighter">{heatmap.length}</p>
          </div>
          <div className="bg-red-500/10 px-8 py-6 rounded-[2.5rem] border border-red-500/20 text-center shadow-xl">
            <p className="text-[10px] font-black text-red-400/50 uppercase tracking-[0.2em] mb-2">At Risk</p>
            <p className="text-4xl font-black text-red-400 tracking-tighter">{highRiskCount}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <SummaryCard icon={<Activity className="text-emerald-400" />} label="Avg Attendance" value="84.2%" trend="+2.1%" positive />
        <SummaryCard icon={<Target className="text-blue-400" />} label="Avg Score" value="13.8" trend="+0.5" positive />
        <SummaryCard icon={<Users className="text-purple-400" />} label="Participation" value="92%" trend="-1%" positive={false} />
        <SummaryCard icon={<Calendar className="text-amber-400" />} label="Working Days" value="42" sub="Current Semester" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter">Attendance Analytics</h3>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">Weekly progression trend</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/15 px-4 py-2 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <TrendingUp size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Increasing</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '15px', fontWeight: 'bold'}} 
                  itemStyle={{color: '#818cf8'}}
                />
                <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3.5rem] p-10 md:p-12 border border-white/5 flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Risk Pulse</h3>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-relaxed">Model classification for {user?.class_name || 'Class'}</p>
          </div>
          <div className="h-56 flex items-center justify-center my-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={8} dataKey="value">
                  {riskDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', background: '#1e293b', color: '#fff', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {riskDistribution.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group/risk">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-lg" style={{ background: r.color }} />
                  <span className="text-sm font-bold text-white/60 group-hover/risk:text-white transition-colors">{r.name}</span>
                </div>
                <span className="text-lg font-black text-white tracking-tighter">{r.value} <span className="text-[10px] text-white/20">STU</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Risk Analysis View ─── */
const RiskAnalysisView = ({ 
  user, heatmap, isLoading, searchTerm, setSearchTerm, filter, setFilter, filteredData, sendAlert, openDetails 
}: any) => {
  const highRisk = filteredData.filter((s: any) => s.risk === 'High');
  const mediumRisk = filteredData.filter((s: any) => s.risk === 'Medium');
  const lowRisk = filteredData.filter((s: any) => s.risk === 'Low');

  const RiskSection = ({ title, students, color, icon }: any) => {
    const colorClasses: any = {
      red: 'bg-red-500/10 border-red-500/20 text-red-400',
      amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    };
    const iconColorClasses: any = {
      red: 'text-red-400',
      amber: 'text-amber-400',
      emerald: 'text-emerald-400',
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-5 px-4">
          <div className={`p-3 rounded-2xl border shadow-xl ${colorClasses[color]}`}>
            {React.cloneElement(icon, { size: 24, className: iconColorClasses[color] })}
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter">{title}</h3>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] mt-1">{students.length} Students Identified</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          <AnimatePresence mode='popLayout'>
            {students.map((student: any) => (
              <StudentCard 
                key={student.roll_no} 
                student={student} 
                user={user}
                onAlert={(type: string) => sendAlert(student.roll_no, type)} 
                onViewDetails={() => openDetails(student.roll_no)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white/[0.04] backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/[0.08] shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-500/15 p-3 rounded-2xl border border-red-500/20 shadow-lg shadow-red-500/10">
              <AlertCircle className="text-red-400 w-7 h-7" />
            </div>
            <span className="text-[11px] font-black text-red-400 uppercase tracking-[0.4em]">Risk Intelligence Heatmap</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">Risk Matrix</span>
          </h1>
          <p className="text-white/40 font-bold text-xl tracking-tight max-w-2xl leading-relaxed">
            AI-powered identification and automated intervention workflow for students requiring academic support.
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/10 flex overflow-x-auto no-scrollbar shadow-xl">
          {['All', 'High', 'Med', 'Low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === 'Med' ? 'Medium' : f)}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                (filter === f || (filter === 'Medium' && f === 'Med')) ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/40' : 'text-white/30 hover:bg-white/5 hover:text-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-white/5 rounded-[3rem] animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="space-y-24">
          {(filter === 'All' || filter === 'High') && highRisk.length > 0 && (
            <RiskSection title="Critical Attention" students={highRisk} color="red" icon={<AlertCircle />} />
          )}
          
          {(filter === 'All' || filter === 'Medium') && mediumRisk.length > 0 && (
            <RiskSection title="Risk Monitoring" students={mediumRisk} color="amber" icon={<Activity />} />
          )}
          
          {(filter === 'All' || filter === 'Low') && lowRisk.length > 0 && (
            <RiskSection title="High Achievers" students={lowRisk} color="emerald" icon={<Award />} />
          )}

          {filteredData.length === 0 && (
            <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border border-dashed border-white/10">
              <div className="bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="text-white/20" size={32} />
              </div>
              <p className="text-white/30 font-black uppercase tracking-[0.3em] text-sm">No students found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StudentCard = ({ student, user, onAlert, onViewDetails }: any) => {
  const isHighRisk = student.risk === 'High';
  const isMediumRisk = student.risk === 'Medium';
  
  const riskGradient = isHighRisk ? 'from-red-500 to-red-400' : isMediumRisk ? 'from-amber-500 to-amber-400' : 'from-emerald-500 to-emerald-400';
  const riskBg = isHighRisk ? 'bg-red-500/10' : isMediumRisk ? 'bg-amber-500/10' : 'bg-emerald-500/10';
  const riskText = isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400';
  const riskBorder = isHighRisk ? 'border-red-500/20' : isMediumRisk ? 'border-amber-500/20' : 'border-emerald-500/20';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white/[0.04] backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] transition-all duration-500 group flex flex-col h-full shadow-2xl shadow-black/20"
    >
      {/* Card Header: Top Bar with ID and Risk Badge */}
      <div className="flex justify-between items-center mb-6">
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xl transition-all duration-700 group-hover:rotate-6 group-hover:scale-110 ${
          isHighRisk ? 'bg-red-500/20 text-red-400 shadow-red-500/20' : isMediumRisk ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/20' : 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20'
        }`}>
          {student.roll_no.slice(-2)}
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 border ${riskBg} ${riskText} ${riskBorder}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isHighRisk ? 'bg-red-400' : isMediumRisk ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          {student.risk}
        </div>
      </div>

      {/* Identity Section */}
      <div className="mb-8 space-y-1 overflow-hidden">
        <h3 className="font-black text-white text-xl tracking-tight truncate leading-tight" title={student.name || student.roll_no}>
          {student.name || 'Unknown Student'}
        </h3>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] truncate">
          {student.roll_no} &middot; {user?.class_name || 'T.E.'}
        </p>
      </div>

      {/* Confidence Section */}
      <div className="flex-1 space-y-8">
        <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-white/20" />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">AI Confidence</span>
            </div>
            <span className={`text-xs font-black tracking-tighter ${riskText}`}>
              {(student.prob * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${student.prob * 100}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${riskGradient}`}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricBox 
            label="Attendance" 
            value={`${student.attendance_pct || 0}%`} 
            up={(student.attendance_pct || 0) >= 75} 
            icon={<Activity size={12} />}
          />
          <MetricBox 
            label="Avg. Score" 
            value={student.avg_ca_score || '0.0'} 
            up={(student.ca_trend_slope || 0) >= 0} 
            icon={<Target size={12} />}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-4 gap-2.5">
        <MiniAlertBtn icon={<Smartphone size={16}/>} onClick={() => onAlert('SMS')} label="SMS" />
        <MiniAlertBtn icon={<MessageSquare size={16}/>} onClick={() => onAlert('WhatsApp')} label="WA" />
        <MiniAlertBtn icon={<Mail size={16}/>} onClick={() => onAlert('Email')} label="Mail" />
        <button 
          onClick={onViewDetails}
          className="bg-white text-slate-950 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 group/btn"
        >
          <Info size={18} className="group-hover/btn:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const SummaryCard = ({ icon, label, value, trend, positive, sub }: any) => (
  <div className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all group shadow-xl">
    {icon && (
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-lg">
        {React.cloneElement(icon, { size: 24 })}
      </div>
    )}
    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{label}</p>
    <div className="flex items-baseline gap-3 mb-1">
      <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black shadow-lg ${
          positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      )}
    </div>
    {sub && <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>}
  </div>
);

const MetricBox = ({ label, value, up, icon }: any) => (
  <div className="bg-white/[0.03] rounded-[1.5rem] p-5 border border-white/5 hover:bg-white/[0.05] transition-colors group/metric">
    <div className="flex items-center gap-2 mb-2">
      <div className="text-white/20 group-hover/metric:text-white/40 transition-colors">
        {icon}
      </div>
      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em]">{label}</p>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-lg font-black text-white tracking-tighter">{value}</span>
      <div className={`p-1.5 rounded-lg ${up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      </div>
    </div>
  </div>
);

const MiniAlertBtn = ({ icon, onClick, label }: any) => (
  <button 
    onClick={onClick}
    title={label}
    className="p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
  >
    {icon}
  </button>
);

export default FacultyDashboard;
