import React, { useState } from 'react';
import { authService } from './services/api';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import FacultyDashboard from './components/FacultyDashboard';
import HODDashboard from './components/HODDashboard';
import StudentDashboard from './components/StudentDashboard';
import { Bell, Search, Settings, HelpCircle, User } from 'lucide-react';

const App = () => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role'));
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

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
    <div className="min-h-screen bg-slate-950 flex font-sans text-white">
      <Sidebar 
        role={role!} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-xl w-96 border border-white/10">
            <Search size={18} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Quick search (⌘K)" 
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-white placeholder:text-white/30 outline-none"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-white/40 hover:text-white/80 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <button className="text-white/40 hover:text-white/80 transition-colors">
              <HelpCircle size={22} />
            </button>
            <button className="text-white/40 hover:text-white/80 transition-colors">
              <Settings size={22} />
            </button>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none mb-1">{sessionStorage.getItem('full_name') || 'User'}</p>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest leading-none">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                {(sessionStorage.getItem('full_name') || 'U')[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <>
              {role === 'FACULTY' && <FacultyDashboard />}
              {role === 'HOD' && <HODDashboard />}
              {role === 'STUDENT' && <StudentDashboard rollNo={username!} />}
            </>
          )}
          {activeTab === 'risk' && <FacultyDashboard />}
          {activeTab === 'trends' && <HODDashboard view="trends" />}
          {activeTab === 'profile' && (
            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">{sessionStorage.getItem('full_name') || 'User'}</h2>
              <p className="text-white/50 mb-2 font-medium">{sessionStorage.getItem('username')}</p>
              <p className="text-indigo-400 text-sm font-semibold mb-8 uppercase tracking-widest">{role}</p>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
                Edit Profile
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
