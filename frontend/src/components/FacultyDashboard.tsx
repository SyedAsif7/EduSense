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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Class Performance Analysis</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-500 font-semibold bg-white px-3 py-1 rounded-full border border-slate-200 text-sm shadow-sm">
              <Users size={16} className="mr-2 text-indigo-600" />
              <span>{heatmap.length} Students Total</span>
            </div>
            <div className="flex items-center text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 text-sm shadow-sm">
              <AlertCircle size={16} className="mr-2" />
              <span>{heatmap.filter(s => s.risk === 'High').length} High Risk</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex overflow-hidden">
            {['All', 'High', 'Medium', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
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
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          placeholder="Search by student name or roll number..."
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all duration-300 font-bold text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
                      {selectedStudent.roll_number.slice(-2)}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedStudent.roll_number}</h2>
                      <p className="text-lg font-bold text-slate-400">Department of Computer Engineering</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center uppercase tracking-widest text-xs">
                        <Info size={18} className="mr-2 text-indigo-600" />
                        ML Risk Factors (SHAP Analysis)
                      </h3>
                      <div className="space-y-4">
                        {selectedStudent.top_factors?.map((f: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <span className="font-bold text-slate-700">{f.factor}</span>
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter ${
                              f.impact === 'Positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
                    <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden shadow-2xl shadow-indigo-200">
                      <div className="relative z-10">
                        <h3 className="text-xl font-black mb-4">Intervention Plan</h3>
                        <p className="text-indigo-200 font-medium leading-relaxed mb-8">
                          AI recommends immediate mentor counseling due to declining CA scores and high absence streak.
                        </p>
                        <button className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-50 transition-colors">
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
      className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform duration-500 group-hover:scale-110 ${
            isHighRisk ? 'bg-red-600 text-white shadow-red-200' : isMediumRisk ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-green-500 text-white shadow-green-200'
          }`}>
            {student.roll_no.slice(-2)}
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg tracking-tight truncate w-32">{student.roll_no}</h3>
            <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <Users size={10} className="mr-1" />
              Batch 2026
            </div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
          isHighRisk ? 'bg-red-50 text-red-600 border border-red-100' : isMediumRisk ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
        }`}>
          {student.risk} Risk
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
            <span className="text-xs font-black text-slate-900">{(student.prob * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${student.prob * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isHighRisk ? 'bg-gradient-to-r from-red-600 to-red-400' : isMediumRisk ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-green-600 to-green-400'
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
          className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
        >
          <Info size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ label, value, sub }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-black text-slate-900 mb-1">{value}</h4>
    <p className="text-[10px] font-bold text-slate-400 tracking-tight">{sub}</p>
  </div>
);

const MetricBox = ({ label, value, up }: any) => (
  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-black text-slate-900">{value}</span>
      {up ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
    </div>
  </div>
);

const MiniAlertBtn = ({ icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
  >
    {icon}
  </button>
);

export default FacultyDashboard;
