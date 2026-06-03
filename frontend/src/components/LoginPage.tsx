import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  GraduationCap, Eye, EyeOff, User, Lock, ArrowLeft,
  AlertCircle, CheckCircle2, Loader2, Fingerprint,
  Sparkles, ShieldCheck
} from 'lucide-react';

/* ─── Floating Input Component ─── */
interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  id, label, type, value, onChange, icon, endAdornment,
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <div className="flex items-end">
        <div className="mr-3 pb-2.5 transition-colors duration-300"
          style={{ color: active ? '#a5b4fc' : 'rgba(255,255,255,0.4)' }}
        >
          {icon}
        </div>
        <div className="relative flex-1">
          <label
            htmlFor={id}
            className="absolute left-0 pointer-events-none transition-all duration-300 ease-out"
            style={{
              top: active ? '-20px' : '8px',
              fontSize: active ? '11px' : '15px',
              color: active ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
              fontWeight: active ? 600 : 400,
              letterSpacing: active ? '0.8px' : '0',
              textTransform: active ? 'uppercase' : 'none',
            }}
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent outline-none text-white placeholder-transparent"
            style={{
              padding: '8px 0',
              fontSize: '15px',
              paddingRight: endAdornment ? '36px' : '0',
              caretColor: '#818cf8',
            }}
            autoComplete={type === 'password' ? 'current-password' : 'username'}
          />
        </div>
        {endAdornment && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
      </div>
      {/* Bottom line */}
      <div className="h-[2px] w-full relative overflow-hidden rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

/* ─── Main LoginPage ─── */
interface LoginPageProps {
  handleLogin: (username: string, password: string) => Promise<void>;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ handleLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shaking, setShaking] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* 3D tilt */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotX = useSpring(useTransform(mouseY, [-200, 200], [6, -6]), springConfig);
  const rotY = useSpring(useTransform(mouseX, [-200, 200], [-6, 6]), springConfig);

  /* Mouse Move for 3D Tilt - Throttled for performance */
  const lastMove = useRef(0);
  const onMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMove.current < 16) return; // ~60fps throttle
    lastMove.current = now;

    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(x - centerX);
    mouseY.set(y - centerY);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => onMouseMove(e);
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  /* Submit */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await handleLogin(username, password);
      setIsLoading(false);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => setExiting(true), 600);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Login error:', err);
      
      if (!err.response) {
        setError('Network error: Cannot reach the server. Please ensure the backend is running.');
      } else if (err.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        const status = err.response.status;
        let msg = 'An unexpected error occurred.';
        
        if (typeof err.response.data === 'string') {
          msg = err.response.data.slice(0, 100); // Show start of HTML/text error
        } else if (err.response.data?.msg) {
          msg = err.response.data.msg;
        } else if (err.response.data?.error) {
          msg = err.response.data.error;
        } else {
          msg = err.message;
        }
        
        setError(`Error ${status}: ${msg}`);
      }
      
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const titleLetters = useMemo(() => 'Welcome Back'.split(''), []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-slate-950">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/background_poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
          onCanPlayThrough={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          <source src="/background_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />
      </div>

      {/* Ambient glow accents */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px]" />
      </div>

      {/* ─── Back to Home Button ─── */}
      <motion.button
        className="fixed top-4 md:top-6 left-4 md:left-6 z-50 flex items-center space-x-2 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: 'spring' }}
        onClick={onBack}
      >
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-white/10 group-hover:bg-white/10 group-hover:border-indigo-500/30 transition-all duration-300 shadow-lg shadow-black/10">
          <ArrowLeft size={16} md:size={18} className="text-white/60 group-hover:text-indigo-400 transition-colors" />
        </div>
        <span className="hidden sm:inline-block text-[13px] font-medium text-white/0 group-hover:text-white/80 transition-all duration-300 -ml-1">
          Back to Home
        </span>
      </motion.button>

      {/* Card container */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 md:px-6"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          ref={wrapperRef}
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={
            exiting
              ? { opacity: 0, y: -60, scale: 0.85 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: exiting ? 0.5 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ─── Glass Card ─── */}
          <motion.div
            className={`w-full max-w-[430px] ${shaking ? 'login-shake' : ''}`}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
              padding: '0',
            }}
          >
            {/* ─── Header ─── */}
            <div className="relative overflow-hidden rounded-t-[28px] p-8 md:p-10"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06), rgba(255,255,255,0.02))',
              }}
            >
              {/* Decorative glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-500/8 blur-2xl" />

              {/* Logo row */}
              <motion.div
                className="flex items-center space-x-3 mb-6 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40" />
                  <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="text-white font-bold text-lg tracking-tight block leading-tight">EduSense</span>
                  <span className="text-[10px] font-semibold text-indigo-400/60 uppercase tracking-[2px]">Portal</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="relative z-10 mb-2"
                style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {titleLetters.map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 200 }}
                    style={{
                      animation: 'letterFloat 2.5s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h2>

              <motion.p
                className="text-white/50 text-sm font-light relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Sign in to access your academic dashboard
              </motion.p>

              {/* Live badge */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
              >
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-white/50 font-medium">Secure</span>
              </motion.div>
            </div>

            {/* ─── Divider ─── */}
            <div className="mx-10 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            {/* ─── Body ─── */}
            <div style={{ padding: '28px 40px 36px' }}>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center space-x-2.5 rounded-xl px-4 py-3"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.15)' }}
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-white/85 text-[13px] font-medium">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center space-x-2.5 rounded-xl px-4 py-3"
                      style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.15)' }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white/85 text-[13px] font-medium">{success}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center mb-6 overflow-hidden"
                  >
                    <div className="flex items-center space-x-3 bg-indigo-500/10 rounded-xl px-5 py-2.5 border border-indigo-500/15">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      <span className="text-indigo-300/80 text-sm font-medium">Authenticating...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-7">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FloatingInput
                    id="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={setUsername}
                    icon={<User size={18} />}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FloatingInput
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    icon={<Lock size={18} />}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/40 hover:text-indigo-400 transition-all duration-200 p-1 rounded-lg hover:bg-white/5"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </motion.div>

                {/* Remember me */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none group"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    <div
                      className="w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all duration-200"
                      style={{
                        borderColor: rememberMe ? '#818cf8' : 'rgba(255,255,255,0.15)',
                        background: rememberMe ? 'linear-gradient(135deg, #818cf8, #a78bfa)' : 'transparent',
                        boxShadow: rememberMe ? '0 0 12px rgba(129,140,248,0.3)' : 'none',
                      }}
                    >
                      {rememberMe && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/45 text-[13px] group-hover:text-white/65 transition-colors font-medium">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-indigo-400/60 text-[13px] hover:text-indigo-400 transition-colors font-medium">
                    Forgot password?
                  </a>
                </motion.div>

                {/* Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full overflow-hidden rounded-2xl font-semibold text-white text-[15px] tracking-wide transition-all duration-300 group disabled:cursor-not-allowed"
                    style={{
                      padding: '14px 30px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: isLoading
                        ? '0 4px 15px rgba(99, 102, 241, 0.15)'
                        : '0 8px 30px rgba(99, 102, 241, 0.3)',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.45)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isLoading
                        ? '0 4px 15px rgba(99, 102, 241, 0.15)'
                        : '0 8px 30px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Sign In</span>
                        </>
                      )}
                    </span>
                    {/* Shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
                        animation: 'btnShimmer 2s infinite',
                      }}
                    />
                  </button>
                </motion.div>
              </form>

              {/* Sign Up Link */}
              <motion.div
                className="text-center mt-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <span className="text-white/35 text-[13px] font-light">Don't have an account? </span>
                <a href="#" className="text-indigo-400 text-[13px] font-semibold hover:text-indigo-300 transition-colors">
                  Contact Admin
                </a>
              </motion.div>
            </div>

            {/* ─── Footer ─── */}
            <div className="rounded-b-[28px] px-10 py-3.5 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center space-x-1.5">
                <Sparkles size={10} className="text-indigo-500/40" />
                <span className="text-white/20 text-[11px] font-medium tracking-wide">
                  EduSense &copy; 2026 &middot; Secure Portal
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
