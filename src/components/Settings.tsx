import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  LogOut,
  HelpCircle,
  Database,
  MapPin,
  ArrowLeft,
  Camera,
  Save,
  CheckCircle2,
  Map as MapIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type SettingsView = 'main' | 'personal-info' | 'assigned-beats' | 'notifications';

export function Settings({ onOpenMap }: { onOpenMap: () => void }) {
  const { theme, themeColor, toggleTheme, setThemeColor } = useTheme();
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const sections = [
    {
      title: 'Profile Settings',
      items: [
        { id: 'personal-info', icon: User, label: 'Personal Information', desc: 'Update your name, email, and profile photo', color: 'text-primary' },
        { id: 'assigned-beats', icon: MapPin, label: 'Assigned Beats', desc: 'View and manage your assigned beats (B1-B10)', color: 'text-tertiary' },
      ]
    },
    {
      title: 'Application',
      items: [
        { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Configure push and email alerts for visits', color: 'text-primary' },
        { id: 'offline', icon: Smartphone, label: 'Offline Access', desc: 'Manage local data storage for field visits', color: 'text-secondary' },
        { id: 'language', icon: Globe, label: 'Language', desc: 'English (India)', color: 'text-on-surface-variant' },
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        { id: 'privacy', icon: Shield, label: 'Privacy Policy', desc: 'How we handle your field data', color: 'text-tertiary' },
        { id: 'sync', icon: Database, label: 'Data Sync', desc: 'Last synced: 10 mins ago', color: 'text-primary' },
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    if (id === 'personal-info' || id === 'assigned-beats' || id === 'notifications') {
      setCurrentView(id as SettingsView);
    }
  };

  const renderMainView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm text-center">
          <div className="relative inline-block mb-4">
            <img 
              src="https://picsum.photos/seed/arjun/200/200" 
              alt="Arjun Mehta" 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setCurrentView('personal-info')}
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-2 border-surface-container-lowest hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Arjun Mehta</h2>
          <p className="text-xs text-on-surface-variant font-medium">Senior Field Executive</p>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">ID: KAE-9901</p>
          
          <button 
            onClick={() => setCurrentView('personal-info')}
            className="w-full mt-6 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container-high transition-all"
          >
            Edit Profile
          </button>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                <span className="text-sm font-bold text-on-surface">Dark Mode</span>
              </div>
              <div className={cn(
                "w-10 h-5 rounded-full relative transition-all",
                theme === 'dark' ? "bg-primary" : "bg-outline-variant/30"
              )}>
                <div className={cn(
                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                  theme === 'dark' ? "left-6" : "left-1"
                )}></div>
              </div>
            </button>

            {/* Theme Colors */}
            <div className="w-full p-3 bg-surface-container-low rounded-xl">
              <span className="text-xs font-bold text-on-surface mb-2 block">Theme Color</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'ruby', code: '#b7003b' },
                  { id: 'blue', code: '#005fbc' },
                  { id: 'green', code: '#0f8241' },
                  { id: 'purple', code: '#6c2bd9' },
                  { id: 'orange', code: '#d94e1b' },
                ].map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setThemeColor(color.id as any)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform",
                      themeColor === color.id ? "scale-110 border-on-surface" : "border-transparent hover:scale-110"
                    )}
                    style={{ backgroundColor: color.code }}
                  />
                ))}
              </div>
            </div>
            <button className="w-full flex items-center gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all text-error">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="md:col-span-2 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{section.title}</h3>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-surface transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl bg-surface-container-low group-hover:bg-surface-container-high transition-colors", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('main')}
          className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black">Personal Information</h2>
      </div>

      <form className="space-y-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              defaultValue="Arjun Mehta" 
              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Employee ID</label>
            <input 
              type="text" 
              defaultValue="KAE-9901" 
              disabled 
              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium opacity-50 cursor-not-allowed" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              defaultValue="arjun.mehta@kad.com" 
              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
            <input 
              type="tel" 
              defaultValue="+91 98765 43210" 
              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Home Base / Region</label>
          <input 
            type="text" 
            defaultValue="Bangalore Central, Karnataka" 
            className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" 
          />
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            onClick={() => setCurrentView('main')}
            className="flex-1 py-4 bg-primary text-white font-black rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          <button 
            onClick={() => setCurrentView('main')}
            className="px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderAssignedBeats = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('main')}
          className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black">Assigned Beats</h2>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center text-white">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black text-on-surface">Primary Beat: B1</p>
              <p className="text-xs text-on-surface-variant font-medium">Indiranagar & Koramangala Region</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'B1', name: 'Indiranagar', venues: 42, status: 'Primary' },
            { id: 'B2', name: 'Koramangala', venues: 38, status: 'Assigned' },
            { id: 'B3', name: 'MG Road', venues: 25, status: 'Backup' },
          ].map((beat) => (
            <div key={beat.id} className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-black shadow-sm">
                  {beat.id}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                  beat.status === 'Primary' ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                )}>
                  {beat.status}
                </span>
              </div>
              <h4 className="font-bold text-on-surface">{beat.name} Region</h4>
              <p className="text-xs text-on-surface-variant mt-1">{beat.venues} Registered Venues</p>
              
              <button 
                onClick={onOpenMap}
                className="w-full mt-4 py-2 bg-surface-container-lowest text-primary font-bold text-xs rounded-lg border border-primary/10 hover:bg-primary/5 transition-all"
              >
                View Beat Map
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6 text-on-surface-variant" />
          </div>
          <h4 className="font-bold text-on-surface">Request New Beat</h4>
          <p className="text-xs text-on-surface-variant max-w-xs mt-1">Need to expand your territory? Request additional beat assignments from your manager.</p>
          <button className="mt-4 px-6 py-2 bg-primary text-white font-bold text-xs rounded-lg shadow-md hover:opacity-90 transition-all">
            Contact Manager
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">System Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">Manage your account preferences and application behavior.</p>
      </header>

      <AnimatePresence mode="wait">
        {currentView === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderMainView()}
          </motion.div>
        )}
        {currentView === 'personal-info' && (
          <motion.div 
            key="personal-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderPersonalInfo()}
          </motion.div>
        )}
        {currentView === 'assigned-beats' && (
          <motion.div 
            key="assigned-beats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderAssignedBeats()}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-6 py-4">
        <button className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Help Center
        </button>
        <span className="text-outline-variant/30">•</span>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Version 2.4.0 (Stable)</p>
      </div>
    </div>
  );
}
