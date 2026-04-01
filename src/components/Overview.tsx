import React from 'react';
import {
  TrendingUp,
  Lightbulb,
  Wallet,
  Clock,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  ExternalLink,
  History,
  CheckCircle2,
  Users,
  Building2,
  ShieldCheck,
  ShieldOff,
  Map,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { VenueDetailModal } from './VenueDetailModal';
import { DateRangePicker } from './DateRangePicker';

const trafficData = [
  { name: 'MON', traffic: 4200 },
  { name: 'TUE', traffic: 5100 },
  { name: 'WED', traffic: 3800 },
  { name: 'THU', traffic: 7200 },
  { name: 'FRI', traffic: 5900 },
  { name: 'SAT', traffic: 3100 },
  { name: 'SUN', traffic: 6800 },
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
    status: 'Partial',
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

// Targets set by managers — read-only in this portal
const targets = {
  newListings: 50,
  upgrades: 30,
  commissionCollection: 500000,
};

const achieved = {
  newListings: 38,
  upgrades: 22,
  commissionCollection: 420000,
};

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  const met = pct >= 100;
  return (
    <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full', met ? 'bg-tertiary' : 'bg-primary-container')}
      />
    </div>
  );
}

function TargetRow({
  label,
  icon: Icon,
  achievedVal,
  targetVal,
  formatValue,
}: {
  label: string;
  icon: React.ElementType;
  achievedVal: number;
  targetVal: number;
  formatValue: (v: number) => string;
}) {
  const pct = Math.min(100, targetVal > 0 ? Math.round((achievedVal / targetVal) * 100) : 0);
  const met = achievedVal >= targetVal;

  return (
    <div className="bg-surface-container-low/60 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-container/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{label}</span>
        </div>
        <span className={cn(
          'text-[10px] font-black px-2 py-0.5 rounded-full',
          met ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container text-on-surface-variant'
        )}>
          {pct}%
        </span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-black text-on-surface leading-none">{formatValue(achievedVal)}</p>
          <p className="text-[10px] text-on-surface-variant mt-1">Achieved</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-on-surface-variant">{formatValue(targetVal)}</p>
          <p className="text-[10px] text-on-surface-variant mt-1">Target</p>
        </div>
      </div>

      <ProgressBar value={achievedVal} max={targetVal} />
    </div>
  );
}

export function Overview() {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = React.useState<typeof venues[0] | null>(null);
  const [activeBeatIndex, setActiveBeatIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveBeatIndex((prev) => (prev + 1) % venues.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const kpis = [
    { label: 'No. of Vendors', value: '312', icon: Users, color: 'text-primary' },
    { label: 'No. of Halls', value: '248', icon: Building2, color: 'text-primary' },
    { label: 'BWG Promise', value: '186', icon: ShieldCheck, color: 'text-tertiary' },
    { label: 'Non BWG Promise', value: '62', icon: ShieldOff, color: 'text-error' },
    { label: 'No. of Beats', value: '14', icon: Map, color: 'text-primary' },
  ];

  const targetRows = [
    {
      key: 'newListings' as const,
      label: 'New Listings',
      icon: Lightbulb,
      formatValue: (v: number) => Math.round(v).toString(),
    },
    {
      key: 'upgrades' as const,
      label: 'Upgrades',
      icon: TrendingUp,
      formatValue: (v: number) => Math.round(v).toString(),
    },
    {
      key: 'commissionCollection' as const,
      label: 'Commission Collection',
      icon: Wallet,
      formatValue: (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Venue Detail Modal */}
      <VenueDetailModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
      {/* Header */}
      <div className="col-span-1 lg:col-span-3 order-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Field Intelligence Overview</p>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Executive Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker 
            onChange={(range) => console.log('Selected Range:', range)} 
          />
          <button className="bg-primary-container text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Grid — 5 metrics */}
      <div className="col-span-1 lg:col-span-3 order-3 lg:order-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm border-b-4 border-primary/20 flex flex-col gap-3"
          >
            <div className="p-2 bg-primary-container/10 rounded-lg w-fit">
              <kpi.icon className={cn('w-5 h-5', kpi.color)} />
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider leading-tight">{kpi.label}</p>
              <h3 className="text-3xl font-black mt-1 text-on-surface">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Target vs Achieved */}
      <div className="col-span-1 lg:col-span-2 order-4 lg:order-3 bg-surface-container-lowest p-2 md:p-4 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-extrabold text-on-surface tracking-tight">Target vs Achieved</h3>
              <p className="text-on-surface-variant text-sm font-medium">Targets set by your manager</p>
            </div>
            <div className="p-2 bg-primary-container/10 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {targetRows.map((row) => (
              <TargetRow
                // key={row.key}
                label={row.label}
                icon={row.icon}
                achievedVal={achieved[row.key]}
                targetVal={targets[row.key]}
                formatValue={row.formatValue}
              />
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-container" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Target Met</span>
            </div>
          </div>
        </div>

      {/* Active Beat */}
      <div className="col-span-1 lg:col-span-1 order-2 lg:order-4 bg-primary-container p-4 md:p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between overflow-hidden relative min-h-[300px]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">Active Beat</span>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBeatIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Venue ID: {venues[activeBeatIndex].id}</p>
                <h2 className="text-2xl font-black mb-4 truncate">{venues[activeBeatIndex].name}</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-white/60" />
                    <div className="text-sm">
                      <p className="text-white/50 font-medium">Last Visit</p>
                      <p className="font-bold">{venues[activeBeatIndex].lastVisit}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-auto relative z-10">
            <button
              onClick={() => setSelectedVenue(venues[activeBeatIndex] as any)}
              className="w-full py-4 bg-white text-primary-container font-black rounded-xl hover:bg-surface-container-lowest transition-all transform hover:-translate-y-1 shadow-lg">
              View Complete Logs
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {venues.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    idx === activeBeatIndex ? "bg-white w-6" : "bg-white/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Venue Table */}
      <div className="col-span-1 lg:col-span-3 order-5 lg:order-5 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <th className="px-4 md:px-6 py-4">Venue ID</th>
                <th className="px-4 md:px-6 py-4">Venue Name</th>
                <th className="px-4 md:px-6 py-4">Last Visit</th>
                <th className="px-4 md:px-6 py-4 text-center">Suggested</th>
                <th className="px-4 md:px-6 py-4 text-center">Booked</th>
                <th className="px-4 md:px-6 py-4 text-center">Comm. Coll.</th>
                <th className="px-4 md:px-6 py-4 text-center">Pending</th>
                <th className="px-4 md:px-6 py-4 text-center">BWG Traffic</th>
                <th className="px-4 md:px-6 py-4 text-center">BWG Promise</th>
                <th className="px-4 md:px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-surface">
              {venues.map((venue) => (
                <tr
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className="hover:bg-surface transition-colors cursor-pointer group"
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-bold text-on-surface-variant">{venue.id}</td>
                  <td className="px-4 md:px-6 py-4 min-w-[250px]">
                    <div className="flex items-center gap-3">
                      <img src={venue.image} alt={venue.name} className="w-10 h-10 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="truncate">
                        <p className="font-bold text-on-surface truncate">{venue.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{venue.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-medium whitespace-nowrap">{venue.lastVisit}</td>
                  <td className="px-4 md:px-6 py-4 text-center font-bold">{venue.suggested}</td>
                  <td className="px-4 md:px-6 py-4 text-center font-bold">{venue.booked}</td>
                  <td className="px-4 md:px-6 py-4 text-center font-bold text-tertiary">{venue.commCollected}</td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <span className={cn(
                      "font-bold",
                      venue.pendingComm > 0 ? "text-error" : "text-on-surface-variant opacity-40"
                    )}>
                      {venue.pendingComm}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center font-mono text-xs font-bold">{venue.traffic}</td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black uppercase rounded tracking-wider whitespace-nowrap",
                      venue.status === 'Verified' ? "bg-tertiary/10 text-tertiary" : "bg-secondary-container/30 text-secondary"
                    )}>
                      {venue.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <ChevronRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 md:p-6 bg-surface-container-low/30 flex justify-between items-center">
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
