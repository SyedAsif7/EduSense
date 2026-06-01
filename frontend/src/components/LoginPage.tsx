import React, { useState } from 'react';
import { Users, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  handleLogin: (username: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin(username, password);
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Users className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">EduSense</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-lg">Predicting success, preventing failure.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl leading-5 focus:outline-none focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all duration-200"
                  placeholder="e.g., faculty_101"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl leading-5 focus:outline-none focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all duration-200"
                  placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all" />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign in to Dashboard'}</span>
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm text-center">
              Don't have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Contact Administrator</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Visual */}
      <div className="hidden lg:flex flex-1 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          className="absolute inset-0 object-cover w-full h-full grayscale"
          alt="Students working"
        />
        
        <div className="relative z-20 flex flex-col justify-center px-16 text-white max-w-2xl">
          <div className="space-y-8">
            <h2 className="text-5xl font-black leading-tight">Advanced Student Performance Analytics</h2>
            <div className="space-y-6">
              <FeatureItem text="Real-time facial recognition attendance" />
              <FeatureItem text="Predictive ML risk scoring (XGBoost + RF)" />
              <FeatureItem text="Automated multi-channel parent alerts" />
              <FeatureItem text="Actionable performance improvement tips" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl z-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full -ml-48 -mb-48 blur-3xl z-20" />
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-4 group">
    <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
      <CheckCircle2 className="text-indigo-300 w-6 h-6" />
    </div>
    <span className="text-xl font-medium text-indigo-50 tracking-wide">{text}</span>
  </div>
);

export default LoginPage;
