import React, { useState, useEffect } from 'react';
import { studentService, alertService } from '../services/api';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertCircle, 
  CheckCircle,
  MessageSquare,
  Mail,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyDashboard = () => {
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await studentService.getRiskHeatmap();
      setHeatmap(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = heatmap.filter(student => {
    const matchesSearch = student.roll_no.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Class Performance Analysis</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-white/60 font-semibold bg-white/5 backdrop-blur-sm px-3 md:px-4 py-1.5 rounded-full border border-white/10 text-xs md:text-sm">
              <Users size={16} className="mr-2 text-indigo-400" />
              <span>{heatmap.length} Students</span>
            </div>
            <div className="flex items-center text-red-400 font-bold bg-red-500/10 px-3 md:px-4 py-1.5 rounded-full border border-red-500/20 text-xs md:text-sm">
              <AlertCircle size={16} className="mr-2" />
              <span>{heatmap.filter(s => s.risk === 'High').length} High Risk</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-white/5 backdrop-blur-sm p-1 rounded-xl md:rounded-2xl border border-white/10 flex w-full sm:w-auto overflow-x-auto no-scrollbar">
            {['All', 'High', 'Med', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f === 'Med' ? 'Medium' : f)}
                className={`flex-1 sm:flex-none px-4 md:px-5 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  (filter === f || (filter === 'Medium' && f === 'Med')) ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-white/30 group-focus-within:text-indigo-400 transition-colors">
          <Search size={20} md:size={22} />
        </div>
        <input
          type="text"
          placeholder="Search roll number..."
          className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl md:rounded-3xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all duration-300 font-bold text-white text-sm md:text-base placeholder:text-white/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 md:h-80 bg-white/5 rounded-2xl md:rounded-[2.5rem] animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredData.map((student) => (
              <StudentCard 
                key={student.roll_no} 
                student={student} 
                onAlert={(type: string) => sendAlert(student.roll_no, type)} 
                onViewDetails={() => openDetails(student.roll_no)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
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
                      <MetricCard label="Attendance %" value={`${selectedStudent.attendance_pct.toFixed(1)}%`} sub="Threshold: 75%" />
                      <MetricCard label="Avg CA Score" value={selectedStudent.avg_ca_score.toFixed(1)} sub="Class Avg: 12.4" />
                      <MetricCard label="Absence Streak" value={selectedStudent.absent_streak} sub="Consecutive days" />
                      <MetricCard label="Trend Slope" value={selectedStudent.ca_trend_slope.toFixed(2)} sub="Performance trajectory" />
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

const StudentCard = ({ student, onAlert, onViewDetails }: any) => {
  const isHighRisk = student.risk === 'High';
  const isMediumRisk = student.risk === 'Medium';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/[0.04] backdrop-blur-md rounded-[2.5rem] p-7 border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-500 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform duration-500 group-hover:scale-110 ${
            isHighRisk ? 'bg-red-500/20 text-red-400 shadow-red-500/10' : isMediumRisk ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/10' : 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/10'
          }`}>
            {student.roll_no.slice(-2)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight truncate w-32">{student.roll_no}</h3>
            <div className="flex items-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              <Users size={10} className="mr-1" />
              Batch 2026
            </div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
          isHighRisk ? 'bg-red-500/15 text-red-400 border border-red-500/20' : isMediumRisk ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
        }`}>
          {student.risk} Risk
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Confidence</span>
            <span className="text-xs font-bold text-white">{(student.prob * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${student.prob * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isHighRisk ? 'bg-gradient-to-r from-red-500 to-red-400' : isMediumRisk ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricBox label="Att." value="72%" up={false} />
          <MetricBox label="Avg." value="14.2" up={true} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-4 gap-2">
        <MiniAlertBtn icon={<Smartphone size={16}/>} onClick={() => onAlert('SMS')} />
        <MiniAlertBtn icon={<MessageSquare size={16}/>} onClick={() => onAlert('WHATSAPP')} />
        <MiniAlertBtn icon={<Mail size={16}/>} onClick={() => onAlert('EMAIL')} />
        <button 
          onClick={onViewDetails}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
        >
          <Info size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ label, value, sub }: any) => (
  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10">
    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
    <p className="text-[10px] font-medium text-white/40 tracking-tight">{sub}</p>
  </div>
);

const MetricBox = ({ label, value, up }: any) => (
  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-white">{value}</span>
      {up ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
    </div>
  </div>
);

const MiniAlertBtn = ({ icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="p-3 bg-white/5 border border-white/10 text-white/30 rounded-2xl hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
  >
    {icon}
  </button>
);

export default FacultyDashboard;
