/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Plus, Wallet, Settings as SettingsIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { BeatPlanning } from './components/BeatPlanning';
import { P1Visit } from './components/P1Visit';
import { GeneralVisit } from './components/GeneralVisit';
import { Commission } from './components/Commission';
import { BWGUpgradation } from './components/BWGUpgradation';
import { LeadCapture } from './components/LeadCapture';
import { Settings } from './components/Settings';
import { BeatMap } from './components/BeatMap';
import { NewListing } from './components/NewListing';
import { BlockDate } from './components/BlockDate';

export default function App() {
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-surface w-full overflow-x-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 flex flex-col min-w-0 h-screen overflow-y-auto relative text-base">
            <TopBar onOpenMap={() => setIsMapOpen(true)} onOpenSidebar={() => setIsSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-8 pb-32 lg:pb-8 min-w-0 w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/new-listing" element={<NewListing />} />
                <Route path="/block-date" element={<BlockDate />} />
                <Route path="/beats" element={<BeatPlanning />} />
                <Route path="/p1-visit" element={<P1Visit />} />
                <Route path="/general-visit" element={<GeneralVisit />} />
                <Route path="/commission" element={<Commission />} />
                <Route path="/bwg" element={<BWGUpgradation />} />
                <Route path="/lead-capture" element={<LeadCapture />} />
                <Route path="/settings" element={<Settings onOpenMap={() => setIsMapOpen(true)} />} />
                <Route path="*" element={<Overview />} />
              </Routes>
            </main>
            
            {/* Desktop Footer (Hidden on Mobile) */}
            <footer className="hidden lg:block px-10 py-6 border-t border-outline-variant/10 text-center mt-auto">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                © 2026 KAD CRM • Field Intelligence & Logistics System
              </p>
            </footer>

            {/* Mobile Blur Bottom Navigation (iPhone Glassmorphism style) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface/40 dark:bg-surface/20 backdrop-blur-[40px] border-t border-white/50 dark:border-white/10 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] supports-[backdrop-filter]:bg-surface/30">
              <nav className="flex justify-around items-center px-4 py-3">
                {[
                  { path: '/', icon: LayoutDashboard },
                  { path: '/beats', icon: Map },
                  { path: '/new-listing', icon: Plus, isCenter: true },
                  { path: '/commission', icon: Wallet },
                  { path: '/settings', icon: SettingsIcon },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      item.isCenter
                        ? `relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary to-primary-container text-white shadow-[0_8px_24px_rgb(var(--color-primary)/0.5)] border-[3px] border-white/60 dark:border-white/20 backdrop-blur-3xl transition-all duration-300 active:scale-90 hover:scale-105 z-50`
                        : `p-2 relative flex items-center justify-center transition-all duration-300 active:scale-90 ${
                            isActive 
                              ? 'text-primary drop-shadow-[0_2px_12px_rgb(var(--color-primary)/0.4)]' 
                              : 'text-on-surface-variant/60 hover:text-on-surface'
                          }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <item.icon className={item.isCenter ? "w-7 h-7 stroke-[3px]" : `w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.5px]'}`} />
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <BeatMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      </Router>
    </ThemeProvider>
  );
}

