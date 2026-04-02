import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Plus, Wallet, Settings as SettingsIcon, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { VenueProfile } from './components/VenueProfile';
import { Login } from './components/Login';
import { KAMSidebar } from './components/kam/KAMSidebar';
import { KAEManagement } from './components/kam/KAEManagement';
import { BeatManagement } from './components/kam/BeatManagement';
import { KAMSettings } from './components/kam/KAMSettings';

// ─── KAM Portal ───────────────────────────────────────────────────────────────
const KAMPortal: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-surface w-full overflow-x-hidden">
        <KAMSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-64 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* KAM Top Bar */}
          <header className="sticky top-0 z-100 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors active:scale-95">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-black text-primary tracking-tight lg:hidden">KAM</h2>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
                title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
                  {user?.name?.charAt(0) ?? 'K'}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface leading-tight">{user?.name}</p>
                  <p className="text-[9px] text-on-surface-variant">Key Account Manager</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/kam/kae-management" element={<KAEManagement />} />
              <Route path="/kam/beat-management" element={<BeatManagement />} />
              <Route path="/kam/settings" element={<KAMSettings />} />
              <Route path="/kam" element={<Navigate to="/kam/kae-management" replace />} />
              <Route path="*" element={<Navigate to="/kam/kae-management" replace />} />
            </Routes>
          </main>

          <footer className="hidden lg:block px-10 py-5 border-t border-outline-variant/10 text-center">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              © 2026 KAD CRM • Key Account Manager Portal
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
};

// ─── KAE Portal ───────────────────────────────────────────────────────────────
const KAEPortal: React.FC = () => {
  const { logout } = useAuth();
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
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
              <Route path="/venue/:id" element={<VenueProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="hidden lg:flex px-10 py-6 border-t border-outline-variant/10 mt-auto items-center justify-between">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              © 2026 KAD CRM • Field Intelligence & Logistics System
            </p>
            <button onClick={logout} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
              <LogOut size={14} /> Logout
            </button>
          </footer>

          {/* Mobile Bottom Nav */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-surface/40 backdrop-blur-2xl border-t border-white/50 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] supports-backdrop-filter:bg-surface/30">
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
                      ? 'relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-primary via-primary to-primary-container text-white shadow-[0_8px_24px_rgb(var(--color-primary)/0.5)] border-[3px] border-white/60 backdrop-blur-3xl transition-all duration-300 active:scale-90 hover:scale-105 z-50'
                      : `p-2 relative flex items-center justify-center transition-all duration-300 active:scale-90 ${isActive ? 'text-primary drop-shadow-[0_2px_12px_rgb(var(--color-primary)/0.4)]' : 'text-on-surface-variant/60 hover:text-on-surface'}`
                  }
                >
                  {({ isActive }) => (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <item.icon className={item.isCenter ? 'w-7 h-7 stroke-[3px]' : `w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.5px]'}`} />
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
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Login />;
  if (role === 'kam')   return <KAMPortal />;
  return <KAEPortal />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
