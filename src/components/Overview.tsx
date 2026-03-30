import React from 'react';
import { 
  TrendingUp, 
  Lightbulb, 
  CalendarCheck, 
  Wallet, 
  Clock, 
  AlertCircle,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  ExternalLink,
  History,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const data = [
  { name: 'MON', value: 40, traffic: 4200 },
  { name: 'TUE', value: 65, traffic: 5100 },
  { name: 'WED', value: 45, traffic: 3800 },
  { name: 'THU', value: 85, traffic: 7200 },
  { name: 'FRI', value: 55, traffic: 5900 },
  { name: 'SAT', value: 30, traffic: 3100 },
  { name: 'SUN', value: 75, traffic: 6800 },
];

const venues = [
  {
    id: '5065',
    name: 'The Grand Hall',
    location: 'Central Plaza, Hub 4',
    lastVisit: '18-Mar-2026',
    suggested: 4,
    booked: 3,
    commCollected: 2,
    pendingComm: 1,
    traffic: '56,000',
    status: 'Yes',
    image: 'https://picsum.photos/seed/hall/100/100',
    description: 'A premium luxury hall suitable for corporate events and grand weddings. Features state-of-the-art acoustics and a dedicated catering wing.',
    manager: 'Rahul Sharma',
    contact: '+91 98765 43210'
  },
  {
    id: '5068',
    name: 'Emerald Banquet',
    location: 'Green Park, West Wing',
    lastVisit: '16-Mar-2026',
    suggested: 3,
    booked: 2,
    commCollected: 1,
    pendingComm: 1,
    traffic: '42,500',
    status: 'Pending',
    image: 'https://picsum.photos/seed/banquet/100/100',
    description: 'Eco-friendly banquet space with a focus on natural lighting and sustainable event management.',
    manager: 'Priya Patel',
    contact: '+91 87654 32109'
  },
  {
    id: '4921',
    name: 'Royal Residency',
    location: 'Old Town Square',
    lastVisit: '14-Mar-2026',
    suggested: 6,
    booked: 5,
    commCollected: 5,
    pendingComm: 0,
    traffic: '68,200',
    status: 'No',
    image: 'https://picsum.photos/seed/residency/100/100',
    description: 'Heritage residency offering a classic old-world charm combined with modern amenities.',
    manager: 'Vikram Singh',
    contact: '+91 76543 21098'
  }
];

export function Overview() {
  const [selectedVenue, setSelectedVenue] = React.useState<typeof venues[0] | null>(null);

  return (
    <div className="space-y-8">
      {/* Venue Detail Modal */}
      <AnimatePresence>
        {selectedVenue && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVenue(null)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Left: Visuals & Quick Info */}
              <div className="w-full md:w-2/5 bg-primary-container p-8 text-white relative overflow-hidden flex flex-col">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                
                <button 
                  onClick={() => setSelectedVenue(null)}
                  className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <img 
                      src={selectedVenue.image} 
                      alt={selectedVenue.name} 
                      className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-4 border-white/20 mb-6"
                      referrerPolicy="no-referrer"
                    />
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      Venue ID: {selectedVenue.id}
                    </span>
                    <h2 className="text-3xl font-black mt-4 leading-tight">{selectedVenue.name}</h2>
                    <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedVenue.location}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Last Visit</p>
                        <p className="font-bold">{selectedVenue.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Status</p>
                        <p className="font-bold">{selectedVenue.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Traffic Trend</p>
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="traffic" stroke="#ffffff" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Right: Details & Actions */}
              <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-surface-container-lowest">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-on-surface tracking-tight">Venue Intelligence</h3>
                  <button 
                    onClick={() => setSelectedVenue(null)}
                    className="p-2 hover:bg-surface-container-low rounded-full transition-colors hidden md:block"
                  >
                    <X className="w-6 h-6 text-on-surface-variant" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Suggested', value: selectedVenue.suggested, icon: Lightbulb, color: 'text-primary' },
                    { label: 'Booked', value: selectedVenue.booked, icon: CalendarCheck, color: 'text-primary' },
                    { label: 'Collected', value: selectedVenue.commCollected, icon: Wallet, color: 'text-tertiary' },
                    { label: 'Pending', value: selectedVenue.pendingComm, icon: Clock, color: selectedVenue.pendingComm > 0 ? 'text-error' : 'text-on-surface-variant' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className={cn("w-3 h-3", stat.color)} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Venue Description</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{selectedVenue.description}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Manager</h4>
                      <p className="text-sm font-bold">{selectedVenue.manager}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Contact</h4>
                      <p className="text-sm font-bold">{selectedVenue.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-4 bg-primary-container text-white rounded-xl font-black text-sm shadow-lg hover:shadow-primary-container/20 transition-all active:scale-95">
                    <CalendarCheck className="w-4 h-4" />
                    Log Visit
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-surface-container-high text-on-surface rounded-xl font-black text-sm hover:bg-surface-container-highest transition-all active:scale-95">
                    <Wallet className="w-4 h-4" />
                    Collect Comm.
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 border-2 border-primary-container text-primary-container rounded-xl font-black text-sm hover:bg-primary-container/5 transition-all active:scale-95">
                    <TrendingUp className="w-4 h-4" />
                    Upgrade BWG
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-on-surface text-surface-container-lowest rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95">
                    <ExternalLink className="w-4 h-4" />
                    View on Web
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Field Intelligence Overview</p>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Executive Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low shadow-sm rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors">
            <CalendarCheck className="w-4 h-4 mr-2" />
            Mar 01 - Mar 31, 2026
            <ChevronDown className="w-4 h-4 ml-2" />
          </div>
          <button className="bg-primary-container text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Suggested Count', value: '1,248', trend: '+12%', icon: Lightbulb, color: 'text-primary' },
          { label: 'Booked Count', value: '856', trend: '+8.4%', icon: CalendarCheck, color: 'text-primary' },
          { label: 'Commission Collected', value: '₹4.2M', trend: '+21%', icon: Wallet, color: 'text-primary' },
          { label: 'Pending Commissions', value: '₹680K', trend: 'Critical', icon: Clock, color: 'text-error', isCritical: true },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container/10 rounded-lg">
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <span className={cn(
                "font-bold text-xs flex items-center gap-1 px-2 py-1 rounded-full",
                kpi.isCritical ? "text-error bg-error/10" : "text-tertiary bg-tertiary/10"
              )}>
                {kpi.isCritical ? <AlertCircle className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-3xl font-black mt-1">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Mid Section: Analytics and Active Venue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-on-surface tracking-tight">Website Traffic Analytics</h3>
              <p className="text-on-surface-variant text-sm font-medium">Monitoring BWG referral engagement</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-full text-xs font-bold bg-primary-container text-white">Views</button>
              <button className="px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Conversions</button>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--on-surface-variant)' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)', color: 'var(--on-surface)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? 'var(--color-primary-container)' : 'var(--color-primary-container)33'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-primary-container p-8 rounded-2xl shadow-xl text-white flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">Active Beat</span>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Venue ID: 5065</p>
            <h2 className="text-2xl font-black mb-4">The Grand Hall</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div className="text-sm">
                  <p className="text-white/50 font-medium">Last Visit</p>
                  <p className="font-bold">18-Mar-2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-white/60" />
                <div className="text-sm">
                  <p className="text-white/50 font-medium">Location Precision</p>
                  <p className="font-bold">98% System Verified</p>
                </div>
              </div>
            </div>
          </div>
          <button className="relative z-10 w-full py-4 bg-white text-primary-container font-black rounded-xl hover:bg-surface-container-lowest transition-all transform hover:-translate-y-1">
            View Complete Logs
          </button>
        </div>
      </div>

      {/* Venue Table Section */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-extrabold text-on-surface">Venue Performance Dashboard</h3>
            <p className="text-xs text-on-surface-variant font-medium">Detailed KPI breakdown per venue</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search venues..." 
                className="bg-surface-container-low border-none rounded-lg text-sm font-semibold pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 w-64"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
            <select className="bg-surface-container-low border-none rounded-lg text-sm font-semibold px-4 py-2 focus:ring-0">
              <option>Status: All</option>
              <option>Status: Pending</option>
              <option>Status: Verified</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar max-h-[600px] overflow-y-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Venue ID</th>
                <th className="px-6 py-4">Venue Name</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4 text-center">Suggested</th>
                <th className="px-6 py-4 text-center">Booked</th>
                <th className="px-6 py-4 text-center">Comm. Coll.</th>
                <th className="px-6 py-4 text-center">Pending</th>
                <th className="px-6 py-4 text-center">BWG Traffic</th>
                <th className="px-6 py-4 text-center">BWG Promise</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-surface">
              {venues.map((venue) => (
                <tr 
                  key={venue.id} 
                  onClick={() => setSelectedVenue(venue)}
                  className="hover:bg-surface transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-on-surface-variant">{venue.id}</td>
                  <td className="px-6 py-4 min-w-[250px]">
                    <div className="flex items-center gap-3">
                      <img src={venue.image} alt={venue.name} className="w-10 h-10 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="truncate">
                        <p className="font-bold text-on-surface truncate">{venue.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{venue.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{venue.lastVisit}</td>
                  <td className="px-6 py-4 text-center font-bold">{venue.suggested}</td>
                  <td className="px-6 py-4 text-center font-bold">{venue.booked}</td>
                  <td className="px-6 py-4 text-center font-bold text-tertiary">{venue.commCollected}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "font-bold",
                      venue.pendingComm > 0 ? "text-error" : "text-on-surface-variant opacity-40"
                    )}>
                      {venue.pendingComm}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-xs font-bold">{venue.traffic}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black uppercase rounded tracking-wider whitespace-nowrap",
                      venue.status === 'Verified' ? "bg-tertiary/10 text-tertiary" : "bg-secondary-container/30 text-secondary"
                    )}>
                      {venue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ChevronRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low/30 flex justify-between items-center">
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Showing 1-10 of 248 Venues</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-lowest shadow-sm hover:bg-primary-container hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-white shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-lowest shadow-sm hover:bg-primary-container hover:text-white transition-all">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-lowest shadow-sm hover:bg-primary-container hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
