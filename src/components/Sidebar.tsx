import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  ClipboardCheck, 
  Store, 
  Wallet, 
  TrendingUp, 
  UserPlus,
  Settings,
  LogOut,
  MapPin,
  X,
  Search,
  CheckCircle2,
  Navigation,
  FilePlus,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: FilePlus, label: 'New Listing', path: '/new-listing' },
  { icon: CalendarDays, label: 'Block Date', path: '/block-date' },
  { icon: Map, label: 'Home', path: '/beats' },
  { icon: ClipboardCheck, label: 'P1 Visit', path: '/p1-visit' },
  { icon: Store, label: 'General Visit', path: '/general-visit' },
  { icon: Wallet, label: 'Commission', path: '/commission' },
  { icon: TrendingUp, label: 'BWG Upgradation', path: '/bwg' },
  { icon: UserPlus, label: 'Lead Capture', path: '/lead-capture' },
];

const venues = [
  { id: '5065', name: 'The Grand Hall', address: 'MG Road, Bangalore', distance: '0.2 km' },
  { id: '5066', name: 'Emerald Garden', address: 'Indiranagar, Bangalore', distance: '1.5 km' },
  { id: '5067', name: 'Vista Convention', address: 'Whitefield, Bangalore', distance: '3.2 km' },
];

export function Sidebar() {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.id.includes(searchQuery)
  );

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setTimeout(() => {
      setIsCheckInOpen(false);
      setIsCheckedIn(false);
      setSelectedVenue(null);
    }, 2000);
  };

  return (
    <>
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container-lowest p-4 gap-2 z-50 border-r border-outline-variant/10">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white font-black shadow-lg">
            K
          </div>
          <div>
            <h1 className="text-lg font-bold text-on-surface leading-tight tracking-tight">KAD CRM</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-70">Field Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm",
                isActive 
                  ? "bg-primary-container text-white shadow-md font-bold" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-outline-variant/10">
          <button 
            onClick={() => setIsCheckInOpen(true)}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 mb-4 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Check-in at Venue
          </button>
          
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 text-sm font-medium rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
          
          <button className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 text-sm font-medium w-full text-left rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Check-in Modal */}
      <AnimatePresence>
        {isCheckInOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckInOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-primary-container text-white">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Venue Check-in</h3>
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Confirm your arrival at the location</p>
                </div>
                <button 
                  onClick={() => setIsCheckInOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
                {!selectedVenue ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                      <input 
                        type="text" 
                        placeholder="Search nearby venues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary text-sm font-bold text-on-surface"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2">Nearby Venues (GPS Enabled)</p>
                      {filteredVenues.map((venue) => (
                        <button 
                          key={venue.id}
                          onClick={() => setSelectedVenue(venue)}
                          className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5 hover:border-primary/20 transition-all group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                              <Store className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">{venue.name}</p>
                              <p className="text-xs text-on-surface-variant font-medium">{venue.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{venue.distance}</p>
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">ID: {venue.id}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-12 h-12 text-primary" />
                      </div>
                      <h4 className="text-2xl font-black text-on-surface">{selectedVenue.name}</h4>
                      <p className="text-sm text-on-surface-variant font-medium mt-1">{selectedVenue.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Distance</p>
                        <p className="text-lg font-black text-primary">{selectedVenue.distance}</p>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Accuracy</p>
                        <p className="text-lg font-black text-secondary">± 5 meters</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleCheckIn}
                        disabled={isCheckedIn}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3",
                          isCheckedIn 
                            ? "bg-secondary text-white" 
                            : "bg-primary text-white hover:shadow-primary/20"
                        )}
                      >
                        {isCheckedIn ? (
                          <>
                            <CheckCircle2 className="w-6 h-6" />
                            Checked In!
                          </>
                        ) : (
                          <>
                            <Navigation className="w-6 h-6" />
                            Confirm Check-in
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setSelectedVenue(null)}
                        className="w-full py-4 bg-surface-container-low text-on-surface font-bold rounded-2xl text-sm hover:bg-surface-container-high transition-all"
                      >
                        Change Venue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
