import React, { useState } from 'react';
import { authService } from './services/api';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import FacultyDashboard from './components/FacultyDashboard';
import HODDashboard from './components/HODDashboard';
import StudentDashboard from './components/StudentDashboard';
import ProfilePage from './components/ProfilePage';
import { Bell, Search, Settings, HelpCircle, Menu } from 'lucide-react';

const App = () => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = async (loginUsername: string, password: string) => {
    try {
      const res = await authService.login({ username: loginUsername, password });
      sessionStorage.setItem('token', res.data.access_token);
      sessionStorage.setItem('role', res.data.role);
      sessionStorage.setItem('username', loginUsername);
      sessionStorage.setItem('full_name', res.data.full_name);
      setToken(res.data.access_token);
      setRole(res.data.role);
      setUsername(loginUsername);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setToken(null);
    setRole(null);
    setUsername(null);
    setShowLogin(false);
  };

  if (!token) {
    return showLogin ? (
      <LoginPage handleLogin={handleLogin} onBack={() => setShowLogin(false)} />
    ) : (
      <LandingPage onLoginClick={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-white overflow-x-hidden">
      <Sidebar 
        role={role!} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center space-x-4 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-xl w-64 lg:w-96 border border-white/10">
              <Search size={18} className="text-white/40" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-white placeholder:text-white/30 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="hidden sm:flex items-center space-x-4 mr-2">
              <button className="text-white/40 hover:text-white/80 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
              </button>
              <button className="hidden lg:block text-white/40 hover:text-white/80 transition-colors">
                <Settings size={20} />
              </button>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden xs:block">
                <p className="text-xs md:text-sm font-bold text-white leading-none mb-1 truncate max-w-[100px] md:max-w-none">
                  {sessionStorage.getItem('full_name')?.split(' ')[0] || 'User'}
                </p>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest leading-none">{role}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                {(sessionStorage.getItem('full_name') || 'U')[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {role === 'FACULTY' && <FacultyDashboard />}
              {role === 'HOD' && <HODDashboard />}
              {role === 'STUDENT' && <StudentDashboard rollNo={username!} />}
            </div>
          )}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'risk' && role === 'FACULTY' && <FacultyDashboard view="risk" />}
          {activeTab === 'trends' && role === 'HOD' && <HODDashboard view="trends" />}
        </main>
      </div>
    </div>
  );
};

export default App;
