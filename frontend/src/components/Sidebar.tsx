import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart2, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  role: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, handleLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['FACULTY', 'HOD', 'STUDENT'] },
    { id: 'risk', label: 'Risk Analysis', icon: <AlertTriangle size={20} />, roles: ['FACULTY'] },
    { id: 'trends', label: 'Dept Trends', icon: <BarChart2 size={20} />, roles: ['HOD'] },
    { id: 'profile', label: 'My Profile', icon: <User size={20} />, roles: ['FACULTY', 'HOD', 'STUDENT'] },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <BarChart2 className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">EduSense</h2>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-11">
          {role} Portal
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.filter(item => item.roles.includes(role)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {(sessionStorage.getItem('full_name') || role)[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{sessionStorage.getItem('full_name') || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{role.toLowerCase()}@edusense.edu</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
