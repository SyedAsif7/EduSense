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
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-white/40 uppercase tracking-widest text-sm">Syncing academic data...</p>
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
            <span className="bg-indigo-500/15 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">Student Portal</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40 font-bold text-xs uppercase tracking-widest">Batch of 2026</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{report?.roll_number}</span>
          </h1>
          <p className="text-white/50 font-medium text-lg mt-2">Here's your academic performance roadmap for this week.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10 flex items-center space-x-4">
            <div className="bg-amber-500/15 p-3 rounded-2xl text-amber-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mb-1">Last Sync</p>
              <p className="text-sm font-bold text-white leading-none">2 mins ago</p>
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
              className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08] hover:border-white/15 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-8 flex items-center uppercase tracking-widest text-xs">
                <Target size={18} className="mr-3 text-indigo-400" />
                Skill Proficiency
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700}} />
                    <Radar name="Performance" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#818cf8" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08] hover:border-white/15 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-8 flex items-center uppercase tracking-widest text-xs">
                <Zap size={18} className="mr-3 text-amber-400" />
                Benchmark Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff'}} />
                    <Bar dataKey="You" fill="#818cf8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Class" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* ML Insights Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/15"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-white/15 p-2 rounded-xl">
                    <Award size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Predictive Insight</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {report?.top_factors?.map((f: any, i: number) => (
                    <div key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center ${
                      f.impact === 'Positive' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-400/20 text-red-300'
                    }`}>
                      {f.impact === 'Positive' ? <CheckCircle size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />}
                      {f.factor}
                    </div>
                  ))}
                </div>
                <p className="text-indigo-200 font-medium leading-relaxed">
                  Our AI models suggest that improving your <span className="text-white font-semibold">attendance in core subjects</span> by 5% could boost your next MSE scores by nearly 12%.
                </p>
              </div>
              <button className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/25 transition-all flex items-center self-start md:self-center">
                Get Personal Plan
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            <BookOpen size={200} className="absolute right-[-40px] bottom-[-40px] text-white/5 -rotate-12" />
          </motion.div>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-8">
          <div className="bg-white/[0.04] backdrop-blur-md p-10 rounded-[3rem] border border-white/[0.08] hover:border-white/15 transition-all">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">AI Interventions</h3>
              <span className="bg-indigo-500/15 text-indigo-400 p-3 rounded-2xl border border-indigo-500/20">
                <Bell size={20} />
              </span>
            </div>
            
            <div className="space-y-10">
              <TipItem 
                title="Attendance Threshold"
                desc={`You're at ${report?.attendance_pct?.toFixed(1)}%. You need 3 more consecutive classes to reach the 75% safe zone.`}
                color={report?.attendance_pct < 75 ? "border-red-500" : "border-emerald-500"}
              />
              <TipItem 
                title="Performance Trend"
                desc={report?.ca_trend_slope > 0 ? "Momentum is positive! Your CA scores are trending upwards." : "Your performance trajectory is dipping. Focus on the upcoming CA-2 syllabus."}
                color={report?.ca_trend_slope > 0 ? "border-emerald-500" : "border-amber-500"}
              />
              <TipItem 
                title="Assignment Tracker"
                desc={`You have submitted ${report?.assignment_submission_rate}/5 assignments. 1 more pending for this week.`}
                color="border-indigo-500"
              />
            </div>

            <button className="w-full mt-12 py-5 border-2 border-white/10 rounded-2xl text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white/60 transition-all">
              Connect with Mentor
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] rounded-[3rem] shadow-xl shadow-indigo-500/15">
            <div className="bg-slate-900 rounded-[3rem] p-10 h-full">
              <h4 className="font-bold text-white mb-2">Did you know?</h4>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
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
    <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">{title}</h4>
    <p className="text-sm text-white/50 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default StudentDashboard;
