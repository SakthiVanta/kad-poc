import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Map, LogOut, ShieldCheck, X, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: Users,    label: 'KAE Management',  path: '/kam/kae-management' },
  { icon: Map,      label: 'Beat Management', path: '/kam/beat-management' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function KAMSidebar({ isOpen, onClose }: Props) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-150 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/15 flex flex-col z-160 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">BWG KAD</p>
                <p className="text-sm font-black text-on-surface leading-tight">KAM Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 px-4 py-2">Management</p>
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}

          <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50 px-4 py-2 mt-4">Preferences</p>
          <NavLink
            to="/kam/settings"
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200',
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            Settings
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-outline-variant/10">
          <div className="px-4 py-3 rounded-2xl bg-surface-container-low mb-2">
            <p className="text-xs font-black text-on-surface truncate">{user?.name}</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Key Account Manager</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-error/5 hover:text-error transition-all text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
