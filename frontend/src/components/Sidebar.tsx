import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart2, 
  User, 
  LogOut,
  ChevronRight,
  X,
  Info
} from 'lucide-react';

interface SidebarProps {
  role: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  activeTab, 
  setActiveTab, 
  handleLogout,
  isOpen = true,
  onClose
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['FACULTY', 'HOD', 'STUDENT'] },
    { id: 'risk', label: 'Risk Analysis', icon: <AlertTriangle size={20} />, roles: ['FACULTY'] },
    { id: 'trends', label: 'Dept Trends', icon: <BarChart2 size={20} />, roles: ['HOD'] },
    { id: 'profile', label: 'My Profile', icon: <User size={20} />, roles: ['FACULTY', 'HOD', 'STUDENT'] },
    { id: 'about', label: 'About Project', icon: <Info size={20} />, roles: ['FACULTY', 'HOD', 'STUDENT'] },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 flex flex-col h-screen 
        border-r border-white/5 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40" />
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl">
                  <BarChart2 className="text-white w-5 h-5" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">EduSense</h2>
            </div>
            {onClose && (
              <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white p-1">
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest ml-12">
            {role} Portal
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.filter(item => item.roles.includes(role)).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                  : 'hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={activeTab === item.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={16} className="text-indigo-400" />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
                {(sessionStorage.getItem('full_name') || role || 'U')[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{sessionStorage.getItem('full_name') || 'Administrator'}</p>
                <p className="text-xs text-white/40 truncate">{(role || 'user').toLowerCase()}@edusense.edu</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 border border-transparent hover:border-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
