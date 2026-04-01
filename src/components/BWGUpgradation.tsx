import React, { useState } from 'react';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Store,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface VenueUpgradeData {
  id: string;
  name: string;
  address: string;
  currentTier: 'Standard' | 'Silver' | 'Gold';
  manager: string;
  contact: string;
  bookingsLastMonth: number;
  satisfactionScore: number;
  bwgStatus: 'Eligible' | 'In Progress' | 'Upgraded' | 'Rejected';
}

const mockUpgradeVenues: VenueUpgradeData[] = [
  {
    id: 'V-88122',
    name: 'Crystal Palace',
    address: 'Sector 12, Dwarka, Delhi',
    currentTier: 'Standard',
    manager: 'Suresh Raina',
    contact: '+91 98123 45678',
    bookingsLastMonth: 12,
    satisfactionScore: 96,
    bwgStatus: 'Eligible'
  },
  {
    id: 'V-88145',
    name: 'Grand Royal',
    address: 'MG Road, Gurgaon',
    currentTier: 'Silver',
    manager: 'Anita Desai',
    contact: '+91 98234 56789',
    bookingsLastMonth: 15,
    satisfactionScore: 98,
    bwgStatus: 'In Progress'
  },
  {
    id: 'V-88167',
    name: 'The Heritage',
    address: 'Civil Lines, Delhi',
    currentTier: 'Standard',
    manager: 'Rajesh Khanna',
    contact: '+91 98345 67890',
    bookingsLastMonth: 8,
    satisfactionScore: 92,
    bwgStatus: 'Eligible'
  },
  {
    id: 'V-88189',
    name: 'Blue Lagoon',
    address: 'Rohini Sec 7, Delhi',
    currentTier: 'Standard',
    manager: 'Priya Singh',
    contact: '+91 98456 78901',
    bookingsLastMonth: 11,
    satisfactionScore: 94,
    bwgStatus: 'Eligible'
  }
];

export function BWGUpgradation() {
  const [selectedVenue, setSelectedVenue] = useState<VenueUpgradeData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAgreeable, setIsAgreeable] = useState<boolean | null>(null);
  const [commissionPct, setCommissionPct] = useState<string>('12');

  const filteredVenues = mockUpgradeVenues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedVenue) {
    return (
      <div className="space-y-8 mx-auto">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedVenue(null); setIsAgreeable(null); }}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span>BWG Upgradation</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{selectedVenue.name}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Initiate Tier Upgrade</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Left: Venue Intelligence */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-primary fill-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{selectedVenue.name}</h2>
                  <p className="text-xs text-on-surface-variant font-medium">ID: {selectedVenue.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Current Tier</span>
                  <span className="text-sm font-bold text-on-surface">{selectedVenue.currentTier}</span>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl flex items-center justify-between border border-primary/10">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Target Tier</span>
                  <span className="text-sm font-bold text-primary">BWG Premium</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant/10 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-xs font-medium">{selectedVenue.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-xs font-medium">{selectedVenue.manager}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-widest">
                <TrendingUp className="w-4 h-4 text-primary" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs text-on-surface-variant font-medium">Bookings (Last Month)</p>
                  <p className="text-lg font-black">{selectedVenue.bookingsLastMonth}</p>
                </div>
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(selectedVenue.bookingsLastMonth / 15) * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-on-surface-variant font-medium">Satisfaction Score</p>
                  <p className="text-lg font-black">{selectedVenue.satisfactionScore}%</p>
                </div>
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary" style={{ width: `${selectedVenue.satisfactionScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upgradation Form */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest p-4 md:p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
              <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Upgrade Discussion Outcome</h3>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block text-center">Is the venue agreeable to BWG upgrade?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsAgreeable(true)}
                        className={cn(
                          "flex-1 py-5 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center gap-3",
                          isAgreeable === true 
                            ? "bg-tertiary/10 border-tertiary text-tertiary shadow-lg shadow-tertiary/10" 
                            : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"
                        )}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAgreeable(false)}
                        className={cn(
                          "flex-1 py-5 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center gap-3",
                          isAgreeable === false 
                            ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10" 
                            : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"
                        )}
                      >
                        <AlertCircle className="w-6 h-6" />
                        NO
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isAgreeable === true && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="p-4 md:p-6 bg-tertiary/5 rounded-2xl border border-tertiary/10 space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Agreed Commission Override (%)</label>
                              <span className="px-3 py-1 bg-tertiary text-white font-black rounded-lg text-sm">{commissionPct}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <input 
                                type="range" 
                                min="8" 
                                max="25" 
                                value={commissionPct}
                                onChange={(e) => setCommissionPct(e.target.value)}
                                className="flex-1 h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-tertiary" 
                              />
                            </div>
                            <p className="text-[10px] text-on-surface-variant italic">Standard commission is 8%. BWG Premium allows up to 25% override.</p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Additional Terms / Comments</label>
                            <textarea 
                              rows={3} 
                              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-tertiary/20 resize-none" 
                              placeholder="Any specific terms discussed..."
                            ></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isAgreeable === false && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reason for Denial</label>
                            <textarea 
                              rows={4} 
                              className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20 resize-none" 
                              placeholder="Why is the venue not agreeable to the upgrade?"
                            ></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isAgreeable !== null && (
                  <div className="pt-8 border-t border-surface-container-low flex flex-col md:flex-row gap-4">
                    <button className="flex-1 py-4 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Save & Update BWG Status
                    </button>
                    <button className="px-4 md:px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all">
                      Save Draft
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-2 font-bold">
            <span>CRM Modules</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">BWG Upgradation</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Tier Upgradation Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Identify and upgrade high-performing venues to BWG Premium status.</p>
        </div>
        
        {/* <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 fill-primary" />
            Premium Logic Active
          </div>
        </div> */}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Eligible for Upgrade', value: '12', icon: Zap, color: 'text-primary' },
          { label: 'Upgrades This Month', value: '08', icon: TrendingUp, color: 'text-tertiary' },
          { label: 'Avg. Commission', value: '14.2%', icon: Percent, color: 'text-secondary' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Venue Listing */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Select Venue for Upgradation</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button className="p-2.5 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar max-h-[500px] overflow-y-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-surface-container-low/50 text-on-surface-variant uppercase text-[10px] font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-4 md:px-6 py-4">Venue Details</th>
                <th className="px-4 md:px-6 py-4">Current Tier</th>
                <th className="px-4 md:px-6 py-4">Bookings (LMTD)</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredVenues.map((venue) => (
                <tr 
                  key={venue.id} 
                  onClick={() => setSelectedVenue(venue)}
                  className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{venue.name}</p>
                        <p className="text-xs text-on-surface-variant">{venue.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {venue.currentTier}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-tertiary" />
                      <span className="text-sm font-bold">{venue.bookingsLastMonth} Bookings</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      venue.bwgStatus === 'Eligible' ? "bg-tertiary/10 text-tertiary" : 
                      venue.bwgStatus === 'In Progress' ? "bg-primary/10 text-primary" : 
                      "bg-surface-container-high text-on-surface-variant"
                    )}>
                      {venue.bwgStatus}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/10 group-hover:scale-105 transition-all">
                      Initiate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
