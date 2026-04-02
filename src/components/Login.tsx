import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const carouselItems = [
  {
    tag: 'Feature Focus',
    title: 'Empowering Field Agents',
    description: 'Optimizing every interaction with precision tools designed for the high-stakes field sales environment.'
  },
  {
    tag: 'Real-time Intelligence',
    title: 'Precision Logistics',
    description: 'Track and manage field operations with pinpoint accuracy and real-time data sync across all devices.'
  },
  {
    tag: 'Smart Analytics',
    title: 'Actionable Insights',
    description: 'Convert complex field data into clear, actionable strategies that drive growth and institutional efficiency.'
  }
];

type LoginRole = 'kae' | 'kam';

export const Login: React.FC = () => {
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginRole, setLoginRole] = useState<LoginRole>('kae');

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % carouselItems.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Reset fields when switching role
  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [loginRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(username, password, loginRole);
    setLoading(false);
  };

  const roleConfig = {
    kae: {
      label: 'Field Executive',
      sub: 'KAE Login',
      placeholder: 'agent.name',
      hint: 'Use your assigned credentials',
      accent: 'primary',
    },
    kam: {
      label: 'Manager',
      sub: 'KAM Portal',
      placeholder: 'kam.username',
      hint: 'Manager portal access only',
      accent: 'tertiary',
    },
  };

  const cfg = roleConfig[loginRole];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="w-full h-[25vh] md:h-screen md:w-[45%] lg:w-[40%] bg-primary relative p-8 md:p-12 flex flex-col items-center justify-center md:justify-between overflow-hidden rounded-b-[3rem] md:rounded-b-none md:rounded-r-[4rem] shadow-[0_20px_40px_-15px_rgba(var(--color-primary)/0.3)] md:shadow-[20px_0_60px_-15px_rgba(var(--color-primary)/0.3)] z-50">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary-container opacity-90" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center p-1.5 md:p-2 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-full h-full text-primary fill-current">
                <path d="M12 2L14.5 9H21.5L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2.5 9H9.5L12 2Z" />
              </svg>
            </div>
            <h1 className="text-white text-lg md:text-xl font-bold tracking-tight">BookWedGo KAD CRM</h1>
          </div>
          <p className="text-white/70 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Field Intelligence</p>
        </div>

        <div className="hidden md:flex relative z-10 w-full max-w-2xl flex-col items-center text-center h-80 justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">{carouselItems[currentSlide].tag}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-8 leading-tight tracking-tight">
                {carouselItems[currentSlide].title}
              </h2>
              <p className="text-white/80 text-sm md:text-xl leading-relaxed max-w-lg">{carouselItems[currentSlide].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:flex relative z-10 justify-center gap-4 w-full">
          {carouselItems.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 bg-surface h-[75vh] md:h-screen overflow-y-auto">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-md">

            {/* Role Selector */}
            <div className="mb-8 p-1.5 bg-surface-container-low rounded-2xl flex gap-1">
              {(['kae', 'kam'] as LoginRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setLoginRole(r)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 ${
                    loginRole === r
                      ? 'bg-surface-container-highest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {r === 'kae' ? <Users className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {r === 'kae' ? 'Field Executive' : 'Manager'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={loginRole}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-on-surface mb-1">{cfg.sub}</h2>
                  <p className="text-on-surface-variant font-medium text-sm">{cfg.hint}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest block ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/30 font-medium text-sm"
                        placeholder={cfg.placeholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest block ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-12 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/30 font-medium text-sm"
                        placeholder="••••••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/40 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-error/5 border border-error/20 rounded-xl">
                      <p className="text-error text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                        {error}
                      </p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
                  >
                    {loading ? 'Signing in...' : (<>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>)}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-8 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/10">
          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">© 2026 BOOKWEDGO KAD CRM.</p>
          <div className="flex gap-6">
            <button className="text-[9px] font-bold text-on-surface-variant/40 hover:text-primary uppercase tracking-widest transition-colors">Privacy Policy</button>
            <button className="text-[9px] font-bold text-on-surface-variant/40 hover:text-primary uppercase tracking-widest transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};
