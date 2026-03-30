import React, { useState } from 'react';
import { 
  UserPlus, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp, 
  CheckCircle2,
  ChevronDown,
  Camera,
  UploadCloud,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Calendar,
  User,
  MessageSquare,
  Clock,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface VenueData {
  id: string;
  name: string;
  address: string;
  manager: string;
  contact: string;
}

const mockVenues: VenueData[] = [
  {
    id: 'V-5065',
    name: 'Crystal Palace',
    address: 'Sector 12, Dwarka, Delhi',
    manager: 'Suresh Raina',
    contact: '+91 98123 45678'
  },
  {
    id: 'V-5066',
    name: 'Grand Royal',
    address: 'MG Road, Gurgaon',
    manager: 'Anita Desai',
    contact: '+91 98234 56789'
  },
  {
    id: 'V-5067',
    name: 'The Heritage',
    address: 'Civil Lines, Delhi',
    manager: 'Rajesh Khanna',
    contact: '+91 98345 67890'
  },
  {
    id: 'V-5068',
    name: 'Blue Lagoon',
    address: 'Rohini Sec 7, Delhi',
    manager: 'Priya Singh',
    contact: '+91 98456 78901'
  },
  {
    id: 'V-5069',
    name: 'Golden Tulip',
    address: 'Janakpuri, Delhi',
    manager: 'Amitabh B.',
    contact: '+91 98567 89012'
  }
];

export function LeadCapture() {
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = mockVenues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedVenue) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedVenue(null)}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span>Lead Capture</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{selectedVenue.name}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Capture New Lead</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Venue Context */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{selectedVenue.name}</h2>
                  <p className="text-xs text-on-surface-variant font-medium">ID: {selectedVenue.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-on-surface-variant mt-0.5" />
                  <p className="text-sm font-medium">{selectedVenue.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-sm font-medium">{selectedVenue.manager}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-sm font-medium">{selectedVenue.contact}</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-container p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Lead Routing
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Leads captured here are automatically synced to TC CRM and assigned to the Regional KAM for immediate follow-up.
              </p>
            </div>
          </div>

          {/* Right: Lead Form */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="text" 
                        placeholder="Enter full name" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-11 pr-4 font-medium focus:ring-2 ring-primary/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Customer Nos.</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="tel" 
                        placeholder="+91 00000 00000" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-11 pr-4 font-medium focus:ring-2 ring-primary/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date of Event</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="date" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-11 pr-4 font-medium focus:ring-2 ring-primary/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Event Type</label>
                    <div className="relative">
                      <select className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 font-bold text-on-surface appearance-none focus:ring-2 ring-primary/20 cursor-pointer">
                        <option>Wedding</option>
                        <option>Reception</option>
                        <option>Corporate Event</option>
                        <option>Birthday Party</option>
                        <option>Engagement</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Comments / Requirements</label>
                  <textarea 
                    rows={4} 
                    placeholder="Capture specific customer requirements, budget expectations, or special requests..." 
                    className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20 resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-surface-container-low flex flex-col md:flex-row gap-4">
                  <button className="flex-1 py-4 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Lead to CRM
                  </button>
                  <button className="px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all">
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-2 font-bold">
            <span>CRM Modules</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Lead Capture</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Identify Opportunities</h1>
          <p className="text-on-surface-variant text-sm mt-1">Capture customer leads during your visits and route them to the sales team.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-tertiary/10 text-tertiary px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Lead Quality: 8.5/10
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Leads Captured (Week)', value: '14', icon: UserPlus, color: 'text-primary' },
          { label: 'Conversion Rate', value: '32%', icon: TrendingUp, color: 'text-tertiary' },
          { label: 'Active Venues', value: '250', icon: Store, color: 'text-secondary' },
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
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Select Venue to Capture Lead</h2>
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
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-surface-container-low/50 text-on-surface-variant uppercase text-[10px] font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Venue Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredVenues.map((venue) => (
                <tr 
                  key={venue.id} 
                  onClick={() => setSelectedVenue(venue)}
                  className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="px-6 py-5">
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
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-on-surface">{venue.address}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">{venue.manager}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">{venue.contact}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/10 group-hover:scale-105 transition-all">
                      Capture Lead
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
