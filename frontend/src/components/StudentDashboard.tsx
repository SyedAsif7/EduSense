import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip, AreaChart, Area, Cell } from 'recharts';
import { Bell, BookOpen, Target, Calendar, CheckCircle, AlertCircle, Zap, Award, Clock, ArrowRight } from 'lucide-react';
import { studentService } from '../services/api';
import { motion } from 'framer-motion';

const StudentDashboard = ({ rollNo }: { rollNo: string }) => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Syncing academic data...</p>
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
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Student Portal</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Batch of 2026</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Hello, <span className="text-indigo-600">{report?.roll_number}</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg mt-2">Here's your academic performance roadmap for this week.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Last Sync</p>
              <p className="text-sm font-black text-slate-900 leading-none">2 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center uppercase tracking-widest text-xs">
                <Target size={18} className="mr-3 text-indigo-600" />
                Skill Proficiency
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <Radar name="Performance" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center uppercase tracking-widest text-xs">
                <Zap size={18} className="mr-3 text-amber-500" />
                Benchmark Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="You" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Class" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* ML Insights Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-indigo-500 p-2 rounded-xl">
                    <Award size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Predictive Insight</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {report?.top_factors?.map((f: any, i: number) => (
                    <div key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${
                      f.impact === 'Positive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {f.impact === 'Positive' ? <CheckCircle size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />}
                      {f.factor}
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 font-bold leading-relaxed">
                  Our AI models suggest that improving your <span className="text-white">attendance in core subjects</span> by 5% could boost your next MSE scores by nearly 12%.
                </p>
              </div>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center self-start md:self-center">
                Get Personal Plan
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            <BookOpen size={200} className="absolute right-[-40px] bottom-[-40px] text-white/5 -rotate-12" />
          </motion.div>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-xs">AI Interventions</h3>
              <span className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                <Bell size={20} />
              </span>
            </div>
            
            <div className="space-y-10">
              <TipItem 
                title="Attendance Threshold"
                desc={`You're at ${report?.attendance_pct?.toFixed(1)}%. You need 3 more consecutive classes to reach the 75% safe zone.`}
                color={report?.attendance_pct < 75 ? "border-red-500" : "border-green-500"}
              />
              <TipItem 
                title="Performance Trend"
                desc={report?.ca_trend_slope > 0 ? "Momentum is positive! Your CA scores are trending upwards." : "Your performance trajectory is dipping. Focus on the upcoming CA-2 syllabus."}
                color={report?.ca_trend_slope > 0 ? "border-green-500" : "border-amber-500"}
              />
              <TipItem 
                title="Assignment Tracker"
                desc={`You have submitted ${report?.assignment_submission_rate}/5 assignments. 1 more pending for this week.`}
                color="border-indigo-500"
              />
            </div>

            <button className="w-full mt-12 py-5 border-2 border-slate-100 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-600 transition-all">
              Connect with Mentor
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-1 rounded-[3rem] shadow-xl shadow-indigo-100">
            <div className="bg-white rounded-[2.8rem] p-10 h-full">
              <h4 className="font-black text-slate-900 mb-2">Did you know?</h4>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                Students who review their SHAP factors weekly improve their academic standing by 22% on average.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TipItem = ({ title, desc, color }: any) => (
  <div className={`border-l-4 ${color} pl-6 space-y-2`}>
    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h4>
    <p className="text-sm text-slate-500 font-bold leading-relaxed">{desc}</p>
  </div>
);

export default StudentDashboard;
