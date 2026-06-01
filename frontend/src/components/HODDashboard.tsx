import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from 'recharts';
import { 
  TrendingUp, 
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
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hodService, studentService } from '../services/api';

const HODDashboard = () => {
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
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Loading Department Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">HOD Control Center</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Departmental Intelligence</h1>
          <p className="text-slate-500 font-bold text-lg">Computer Science & Engineering • Academic Year 2025-26</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center group">
            <Download size={18} className="mr-2 group-hover:translate-y-1 transition-transform" />
            Full Audit Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm w-fit mx-auto lg:mx-0">
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

const TabButton = ({ id, label, active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const AnalyticsView = ({ stats }: any) => {
  if (!stats) return <div className="p-10 text-center font-bold text-slate-400">Unable to load analytics data.</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Users className="text-indigo-600" />} label="Total Enrollment" value={stats.total_students} trend="+8.4% growth" color="indigo" />
        <StatCard icon={<AlertTriangle className="text-amber-600" />} label="At Risk Pipeline" value={stats.at_risk_count} trend="-12% improvement" color="amber" />
        <StatCard icon={<UserCheck className="text-green-600" />} label="Avg. Attendance" value={`${stats.avg_attendance}%`} trend="+2.5% vs prev sem" color="green" />
        <StatCard icon={<GraduationCap className="text-purple-600" />} label="Dept. Success" value={`${stats.avg_success_rate}%`} trend="+1.2% target hit" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Batch Performance Matrix</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.batch_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px'}} />
                <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} name="Total Students" />
                <Bar dataKey="risk" fill="#f59e0b" radius={[8, 8, 0, 0]} name="At Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black leading-tight">AI Strategy Insight</h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Predictive analysis indicates a 22% decrease in failure rates for the BE batch if 4th-week interventions are prioritized.
            </p>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center shadow-2xl shadow-indigo-900/40">
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

const FacultyListView = ({ faculties }: any) => (
  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-10 border-b border-slate-50 flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Directory</h3>
        <p className="text-slate-400 font-bold text-sm">Managing 12 full-time department faculty members</p>
      </div>
      <button className="bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
        Add New Faculty
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty Member</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Code</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Subjects</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {faculties.map((f: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-10 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                    {f.full_name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{f.full_name}</p>
                    <p className="text-xs font-bold text-slate-400">{f.username.toLowerCase()}@ssiems.edu</p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-black text-slate-600">{f.username}</span>
              </td>
              <td className="px-10 py-6">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  f.role === 'HOD' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {f.role}
                </span>
              </td>
              <td className="px-10 py-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(item => (
                    <div key={item} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                      C{item}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                    +2
                  </div>
                </div>
              </td>
              <td className="px-10 py-6 text-right">
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
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

const StudentListView = ({ students }: any) => (
  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-10 border-b border-slate-50 flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Department-wide Students</h3>
        <p className="text-slate-400 font-bold text-sm">Global monitoring across all academic batches</p>
      </div>
      <div className="flex space-x-2">
        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all">
          <Filter size={20} />
        </button>
        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all">
          <Search size={20} />
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Roll No</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Level</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Batch</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {students.slice(0, 10).map((s: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-10 py-6 font-black text-slate-900">{s.roll_no}</td>
              <td className="px-10 py-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  s.risk === 'High' ? 'bg-red-100 text-red-600' : s.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                }`}>
                  {s.risk} Risk
                </span>
              </td>
              <td className="px-10 py-6">
                <div className="flex items-center space-x-3 w-40">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${s.prob * 100}%` }} />
                  </div>
                  <span className="text-xs font-black text-slate-900">{(s.prob * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="px-10 py-6 font-bold text-slate-500">BE 2026</td>
              <td className="px-10 py-6">
                <div className="flex items-center text-green-500 text-xs font-black uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Active
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
      <button className="text-indigo-600 font-black text-sm uppercase tracking-[0.2em] hover:text-indigo-700">
        Load All 216 Students
      </button>
    </div>
  </div>
);

const ManagementView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h3>
      <div className="space-y-6">
        <ConfigItem label="Risk Threshold" value="0.65" sub="ML Confidence level for 'High Risk' classification" />
        <ConfigItem label="Attendance Alert" value="75%" sub="Threshold for parent SMS notification" />
        <ConfigItem label="Data Sync Frequency" value="6 Hours" sub="Automated ingestion from marks CSV" />
      </div>
      <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-600 transition-all">
        Update Global Settings
      </button>
    </div>
    
    <div className="space-y-8">
      <div className="bg-indigo-600 p-12 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black">Security Audit</h3>
          <p className="text-indigo-100 font-medium leading-relaxed">
            Your department's data integrity is protected. Last audit performed 14 hours ago.
          </p>
          <div className="flex items-center space-x-3 bg-white/10 w-fit px-4 py-2 rounded-xl">
            <ShieldCheck size={18} />
            <span className="text-xs font-black uppercase tracking-widest">PostgreSQL Protected</span>
          </div>
        </div>
        <GraduationCap size={200} className="absolute right-[-40px] bottom-[-40px] text-white/5 rotate-12" />
      </div>

      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900">Mentor Assignments</h3>
        <p className="text-slate-400 font-medium">Auto-assign mentors to High Risk students based on faculty availability.</p>
        <button className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest group">
          Manage Assignments
          <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

const ConfigItem = ({ label, value, sub }: any) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
    <div>
      <p className="font-black text-slate-900 mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-400">{sub}</p>
    </div>
    <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-black text-indigo-600 shadow-sm">{value}</span>
  </div>
);

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <h4 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{value}</h4>
      <p className="text-xs font-bold text-slate-500 tracking-tight">{trend}</p>
    </motion.div>
  );
};

export default HODDashboard;
