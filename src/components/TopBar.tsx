import React, { useState } from 'react';
import { Search, Bell, MapPin, Menu, Sun, Moon, X, CheckCircle2, AlertCircle, Info, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { BeatMap } from './BeatMap';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { id: 1, type: 'Commission', message: 'Pending collection for Vista Hall', time: '10 mins ago', priority: 'high', icon: AlertCircle, color: 'text-primary' },
  { id: 2, type: 'P1 Visit', message: 'New visit assigned: Emerald Garden', time: '1 hour ago', priority: 'medium', icon: Info, color: 'text-tertiary' },
  { id: 3, type: 'BWG', message: 'Upgradation due for Grand Royal', time: '2 hours ago', priority: 'low', icon: CheckCircle2, color: 'text-secondary' },
  { id: 4, type: 'System', message: 'Sync completed successfully', time: '5 hours ago', priority: 'low', icon: CheckCircle2, color: 'text-on-surface-variant' },
];

export function TopBar({ onOpenMap }: { onOpenMap: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 z-40 w-full px-6 py-3 flex justify-between items-center shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-on-surface">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-black text-primary-container tracking-tight lg:hidden">KAD CRM</h2>
        </div>
        
        <div className="flex items-center gap-6 flex-1 justify-end">
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 gap-2">
            <Search className="w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search Venues or IDs..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium placeholder:text-on-surface-variant/50 text-on-surface"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(true)}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border-2 border-surface-container-lowest"></span>
              </button>
            </div>
            
            <button 
              onClick={onOpenMap}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
              title="Open Beat Map"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Arjun Mehta</p>
                <p className="text-[10px] text-on-surface-variant">Senior Field Executive</p>
              </div>
              <img 
                src="https://picsum.photos/seed/arjun/100/100" 
                alt="User profile" 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container/20"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Sheet */}
      <AnimatePresence>
        {isNotifOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-primary-container text-white">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Field Alerts</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">You have 3 unread notifications</p>
                </div>
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", notif.color, "bg-white/50")}>
                        <notif.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{notif.type}</span>
                          <span className="text-[10px] text-on-surface-variant font-medium">{notif.time}</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{notif.message}</p>
                        <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all">
                          Take Action <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30">
                <button className="w-full py-3 bg-on-surface text-surface-container-lowest font-bold rounded-xl text-sm hover:opacity-90 transition-all">
                  Mark All as Read
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
