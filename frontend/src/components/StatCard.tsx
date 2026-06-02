import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    red: 'bg-red-500/15 text-red-400 border border-red-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    orange: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-md p-6 rounded-xl border border-white/[0.08] flex items-center gap-4 transition-transform hover:scale-[1.02] hover:border-white/15">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white/40">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
