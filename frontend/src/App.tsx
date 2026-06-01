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
      <LoginPage handleLogin={handleLogin} />
    ) : (
      <LandingPage onLoginClick={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar 
        role={role!} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200/50">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search (⌘K)" 
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={22} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={22} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{sessionStorage.getItem('full_name') || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-slate-200">
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
          {activeTab === 'trends' && <HODDashboard />}
          {activeTab === 'profile' && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-black mb-2">User Profile</h2>
              <p className="text-slate-500 mb-8">Role: {role}</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Edit Profile</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
