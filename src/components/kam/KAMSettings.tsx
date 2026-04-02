import React, { useState } from 'react';
import {
  Bell, Shield, Globe, Moon, Sun, ChevronRight, HelpCircle,
  Database, Key, LogOut, Palette,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type ThemeColor = 'ruby' | 'blue' | 'green' | 'purple' | 'orange';

const COLOR_OPTIONS: { value: ThemeColor; label: string; swatch: string }[] = [
  { value: 'ruby',   label: 'Ruby',   swatch: 'bg-[#C62828]' },
  { value: 'blue',   label: 'Ocean',  swatch: 'bg-[#1565C0]' },
  { value: 'green',  label: 'Forest', swatch: 'bg-[#2E7D32]' },
  { value: 'purple', label: 'Violet', swatch: 'bg-[#6A1B9A]' },
  { value: 'orange', label: 'Amber',  swatch: 'bg-[#E65100]' },
];

// Lifted out of map to avoid hooks-in-loop violation
function NotificationToggle({ label, desc, defaultOn, onSaved }: {
  label: string; desc: string; defaultOn: boolean; onSaved: () => void;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-surface-container-low rounded-2xl gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant leading-snug mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => { setOn(!on); onSaved(); }}
        className={cn(
          'w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0',
          on ? 'bg-primary' : 'bg-outline-variant/40'
        )}
        aria-label={label}
      >
        <motion.div
          animate={{ x: on ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

const NOTIFICATIONS = [
  { label: 'KAE Activity Alerts',    desc: 'Get notified when a KAE logs activity',          defaultOn: true  },
  { label: 'Beat Assignment Updates', desc: 'Notifications when beats are reassigned',         defaultOn: true  },
  { label: 'Approval Requests',       desc: 'New listing or upgrade approval requests',        defaultOn: true  },
  { label: 'Weekly Reports',          desc: 'Automated weekly performance digest',             defaultOn: false },
];

const SECURITY_ITEMS = [
  { icon: Key,      label: 'Change Password', desc: 'Update your login credentials' },
  { icon: Database, label: 'Data Sync',        desc: 'Last synced: 5 mins ago'       },
  { icon: Globe,    label: 'Language',          desc: 'English (India)'               },
];

export function KAMSettings() {
  const { theme, themeColor, toggleTheme, setThemeColor } = useTheme();
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="min-h-screen bg-surface">

      {/* Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-300 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary text-white shadow-2xl text-sm font-bold pointer-events-none"
          >
            ✓ Changes saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="w-full border-b border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 xl:px-16 pt-8 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Settings</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Manage your KAM portal preferences
          </p>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 xl:px-16 py-6 md:py-8 xl:py-10">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-5 md:gap-6 xl:gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
              <div className="h-24 sm:h-28 bg-linear-to-br from-primary to-primary/60 relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
                />
              </div>
              <div className="px-5 sm:px-6 pb-6 relative">
                <div className="absolute -top-10 left-5 sm:left-6 p-1.5 bg-surface-container-lowest rounded-full shadow-lg">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black select-none">
                    {user?.name?.charAt(0) ?? 'K'}
                  </div>
                </div>
                <div className="mt-14 space-y-0.5">
                  <h3 className="text-xl font-black text-on-surface">{user?.name ?? 'KAM User'}</h3>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Key Account Manager</p>
                  <p className="text-sm text-on-surface-variant">{user?.email ?? '—'}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between px-3 py-2.5 bg-surface-container-low rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Portal Role</span>
                    <span className="text-xs font-black text-primary">KAM</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 bg-surface-container-low rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Status</span>
                    <span className="flex items-center gap-1.5 text-xs font-black text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-4 sm:p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Account</p>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error/5 border border-error/10 transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4 md:space-y-5">

            {/* Appearance */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-black text-on-surface flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" /> Appearance
              </h2>

              {/* Dark / Light */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-surface-container-low rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  {theme === 'light'
                    ? <Sun  className="w-5 h-5 text-amber-500 shrink-0" />
                    : <Moon className="w-5 h-5 text-primary shrink-0" />}
                  <div>
                    <p className="text-sm font-bold text-on-surface">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
                    <p className="text-xs text-on-surface-variant">Toggle display theme</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0',
                    theme === 'dark' ? 'bg-primary' : 'bg-outline-variant/40'
                  )}
                  aria-label="Toggle theme"
                >
                  <motion.div
                    animate={{ x: theme === 'dark' ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {/* Color scheme */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Color Scheme</p>
                <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setThemeColor(opt.value); showSaved(); }}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-2xl border-2 transition-all',
                        themeColor === opt.value
                          ? 'border-primary bg-primary/5 scale-105'
                          : 'border-outline-variant/20 hover:border-outline-variant/50'
                      )}
                    >
                      <div className={cn('w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md', opt.swatch)} />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-on-surface-variant leading-none">
                        {opt.label}
                      </span>
                      {themeColor === opt.value && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-5 sm:p-6 space-y-3">
              <h2 className="text-sm font-black text-on-surface flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Notifications
              </h2>
              {NOTIFICATIONS.map((item) => (
                <NotificationToggle
                  key={item.label}
                  label={item.label}
                  desc={item.desc}
                  defaultOn={item.defaultOn}
                  onSaved={showSaved}
                />
              ))}
            </div>

            {/* Security */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-5 sm:p-6 space-y-2.5">
              <h2 className="text-sm font-black text-on-surface flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Security
              </h2>
              {SECURITY_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-3 sm:p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-on-surface">{item.label}</p>
                    <p className="text-xs text-on-surface-variant truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-surface transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* About */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface">KAD CRM — KAM Portal</p>
                <p className="text-[9px] text-on-surface-variant mt-0.5">Version 1.0.0 • © 2026 BookWedGo</p>
              </div>
              <HelpCircle className="w-5 h-5 text-on-surface-variant/30 shrink-0" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
