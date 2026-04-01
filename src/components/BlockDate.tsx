import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Building,
  User,
  Phone,
  CheckCircle2,
  X,
  XCircle,
  LayoutGrid,
  Plus,
  Search,
  ArrowLeft,
  CalendarHeart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ViewMode = 'dashboard' | 'select-mandapam' | 'calendar';
type BlockType = 'morning' | 'evening' | 'full' | 'mukurtham' | null;

const getTypeColor = (type: BlockType) => {
  if (type === 'morning') return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  if (type === 'evening') return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  if (type === 'full') return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  if (type === 'mukurtham') return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  return "";
};

const getTypeLabel = (type: BlockType) => {
  if (type === 'morning') return 'Morning Half';
  if (type === 'evening') return 'Evening Half';
  if (type === 'full') return 'Full Day';
  if (type === 'mukurtham') return 'Mukurtham';
  return '';
};

const getHoverClasses = (type: BlockType, isSelected: boolean) => {
  if (isSelected) {
    if (type === 'morning') return "border-rose-500 ring-4 ring-rose-500/20 shadow-lg scale-[1.02]";
    if (type === 'evening') return "border-emerald-500 ring-4 ring-emerald-500/20 shadow-lg scale-[1.02]";
    if (type === 'full') return "border-purple-500 ring-4 ring-purple-500/20 shadow-lg scale-[1.02]";
    if (type === 'mukurtham') return "border-orange-600 ring-4 ring-orange-600/20 shadow-lg scale-[1.02]";
    return "border-primary ring-4 ring-primary/20 shadow-lg scale-[1.02]";
  }
  
  if (type === 'morning') return "border-outline-variant/10 hover:border-rose-500/50 bg-surface-container-low hover:bg-surface-container-high";
  if (type === 'evening') return "border-outline-variant/10 hover:border-emerald-500/50 bg-surface-container-low hover:bg-surface-container-high";
  if (type === 'full') return "border-outline-variant/10 hover:border-purple-500/50 bg-surface-container-low hover:bg-surface-container-high";
  if (type === 'mukurtham') return "border-outline-variant/10 hover:border-orange-600/50 bg-surface-container-low hover:bg-surface-container-high";
  
  return "border-outline-variant/10 hover:border-primary/50 bg-surface-container-low hover:bg-surface-container-high";
};

const getHoverTextClasses = (type: BlockType) => {
  if (type === 'morning') return "text-on-surface group-hover:text-rose-500";
  if (type === 'evening') return "text-on-surface group-hover:text-emerald-500";
  if (type === 'full') return "text-purple-500 group-hover:text-purple-600";
  if (type === 'mukurtham') return "text-orange-600 group-hover:text-orange-700";
  return "text-on-surface group-hover:text-primary";
};

interface BlockData {
  id: string; // Booking ID
  mandapamId: string;
  mandapamName: string;
  dateStr: string; // e.g., "Mar 12, 2026"
  dayNum: number;
  type: BlockType;
  customerName?: string;
  phone?: string;
}

interface Mandapam {
  id: string;
  name: string;
  vendorName: string;
  location: string;
  capacity: string;
}

const mockMandapams: Mandapam[] = [
  { id: 'M101', name: 'Grand Royal Mahal', vendorName: 'Ramesh Kumaran', capacity: '1000', location: 'T Nagar' },
  { id: 'M102', name: 'Sri Valli Kalyana Mandapam', vendorName: 'Srinivasan Weddings', capacity: '500', location: 'Anna Nagar' },
  { id: 'M103', name: 'Emerald Mini Hall', vendorName: 'Srinivasan Weddings', capacity: '200', location: 'Adyar' },
];

const initialBlocks: BlockData[] = [
  { id: 'B12X1', mandapamId: 'M101', mandapamName: 'Grand Royal Mahal', dateStr: 'Mar 12, 2026', dayNum: 12, type: 'morning', customerName: 'Rajesh Kumar', phone: '9876543210' },
  { id: 'B15X2', mandapamId: 'M101', mandapamName: 'Grand Royal Mahal', dateStr: 'Mar 15, 2026', dayNum: 15, type: 'full', customerName: 'Anitha Sharma', phone: '9988776655' },
  { id: 'B22X3', mandapamId: 'M102', mandapamName: 'Sri Valli Kalyana Mandapam', dateStr: 'Mar 22, 2026', dayNum: 22, type: 'evening', customerName: 'Vikram Singh', phone: '9811223344' }
];

// Simplified mock logic for March 2026
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MARCH_2026_DAYS = 31;
const START_DAY_IDX = 0; // March 1, 2026 is a Sunday

export function BlockDate() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [blocksList, setBlocksList] = useState<BlockData[]>(initialBlocks);
  const [selectedMandapam, setSelectedMandapam] = useState<Mandapam | null>(null);
  
  // Dashboard states
  const [dashboardSearch, setDashboardSearch] = useState('');
  
  // Selection states
  const [mandapamSearch, setMandapamSearch] = useState('');

  // Calendar states
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({ slot: 'full', name: '', phone: '' });

  // Filtering
  const filteredBlocks = blocksList.filter(b => 
    b.mandapamName.toLowerCase().includes(dashboardSearch.toLowerCase()) || 
    b.id.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
    b.customerName?.toLowerCase().includes(dashboardSearch.toLowerCase())
  );

  const filteredMandapams = mockMandapams.filter(m => 
    m.name.toLowerCase().includes(mandapamSearch.toLowerCase()) || m.location.toLowerCase().includes(mandapamSearch.toLowerCase())
  );

  const activeMandapamBlocks = selectedMandapam ? blocksList.filter(b => b.mandapamId === selectedMandapam.id) : [];

  // Convert array to dict for calendar rendering
  const activeBlocksDict: Record<number, BlockData> = {};
  activeMandapamBlocks.forEach(b => {
    activeBlocksDict[b.dayNum] = b;
  });

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    setBookingForm({ slot: 'full', name: '', phone: '' });
  };

  const currentBlock = selectedDate ? activeBlocksDict[selectedDate] : null;

  const handleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedMandapam) return;
    
    const newBooking: BlockData = {
      id: `B${Math.floor(Math.random() * 10000)}`,
      mandapamId: selectedMandapam.id,
      mandapamName: selectedMandapam.name,
      dayNum: selectedDate,
      dateStr: `Mar ${selectedDate}, 2026`,
      type: bookingForm.slot as BlockType,
      customerName: bookingForm.name,
      phone: bookingForm.phone
    };
    
    setBlocksList([...blocksList, newBooking]);
    setSelectedDate(null);
    setView('dashboard'); // Auto-redirect to dashboard after successful booking
  };

  const handleUnblock = () => {
    if (!selectedDate || !currentBlock) return;
    setBlocksList(blocksList.filter(b => b.id !== currentBlock.id));
    setSelectedDate(null);
  };

  // ----------------------------------------------------------------------
  // VIEW 1: DASHBOARD
  // ----------------------------------------------------------------------
  if (view === 'dashboard') {
    return (
      <div className="space-y-8 mx-auto pb-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarHeart className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Availability Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Active Bookings</h1>
            <p className="text-on-surface-variant text-sm mt-1">Overview of all blocked dates and upcoming customer events.</p>
          </div>
          <button 
            onClick={() => { setView('select-mandapam'); setSelectedMandapam(null); }}
            className="px-4 md:px-6 py-3 bg-primary text-white font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </header>

        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
          <div className="px-4 md:px-6 py-5 border-b border-outline-variant/10 bg-surface-container-low/30 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Bookings Directory ({filteredBlocks.length})
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={dashboardSearch}
                onChange={(e) => setDashboardSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-surface-container-highest border-none rounded-lg text-xs focus:ring-2 ring-primary/20 w-64 font-medium" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 p-0">
            {filteredBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-16 text-on-surface-variant/70">
                <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-bold text-sm">No bookings found</p>
                <p className="text-xs mt-1">Click 'New Booking' to block a date for a property.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Booking ID & Date</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mandapam Name</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Customer</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Slot</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <AnimatePresence>
                    {filteredBlocks.map((b) => (
                      <motion.tr 
                        key={b.id} 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="hover:bg-surface-container-low/50 transition-colors group"
                      >
                        <td className="p-5">
                          <p className="font-bold text-primary tracking-widest text-xs">{b.id}</p>
                          <p className="text-sm font-black text-on-surface mt-1">{b.dateStr}</p>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-on-surface text-sm">{b.mandapamName}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-0.5">ID: {b.mandapamId}</p>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-on-surface text-sm">{b.customerName || 'N/A'}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant mt-0.5">{b.phone || 'No phone'}</p>
                        </td>
                        <td className="p-5">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                            getTypeColor(b.type)
                          )}>
                            {getTypeLabel(b.type)}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => {
                              setSelectedMandapam(mockMandapams.find(m => m.id === b.mandapamId) || null);
                              setTimeout(() => setView('calendar'), 0);
                            }}
                            className="text-primary font-bold text-xs hover:underline"
                          >
                            View Calendar
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 2: SELECT MANDAPAM
  // ----------------------------------------------------------------------
  if (view === 'select-mandapam') {
    return (
      <div className="space-y-8 mx-auto pb-10">
        <header>
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Step 1 of 2</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Select a Mandapam</h1>
          <p className="text-on-surface-variant text-sm mt-1">Search and select the property where you want to block a date.</p>
        </header>

        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              value={mandapamSearch}
              onChange={(e) => setMandapamSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl text-sm focus:ring-2 ring-primary/20 font-bold" 
            />
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {filteredMandapams.map(m => (
              <button 
                key={m.id}
                onClick={() => {
                  setSelectedMandapam(m);
                  setView('calendar');
                }}
                className="w-full text-left bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/10 hover:border-primary/30 p-5 rounded-2xl flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-outline-variant/5">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">{m.name}</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-0.5">{m.location} • {m.capacity} Pax</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface-variant border border-outline-variant/10">ID: {m.id}</span>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 3: CALENDAR VIEW FOR SELECTED MANDAPAM
  // ----------------------------------------------------------------------
  return (
    <div className="mx-auto flex flex-col lg:flex-row gap-4 md:gap-8 min-h-[calc(100vh-8rem)]">
      {/* LEFT: CALENDAR */}
      <div className="flex-1 space-y-6">
        <header>
          <button 
            onClick={() => setView('select-mandapam')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Change Mandapam
          </button>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Step 2 of 2: Create Booking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{selectedMandapam?.name}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{selectedMandapam?.location} • ID: {selectedMandapam?.id}</p>
        </header>

        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm p-4 md:p-8">
          {/* Calendar Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-on-surface">March 2026</h2>
              <p className="text-sm font-bold text-primary mt-1">Calendar Overview</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors text-on-surface-variant flex-shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="flex-1 md:flex-none px-5 py-3 bg-surface-container-low hover:bg-surface-container-high font-bold text-sm text-on-surface rounded-xl transition-colors text-center">
                Today
              </button>
              <button className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors text-on-surface-variant flex-shrink-0">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-b from-rose-500/40 via-rose-500/40 via-[30%] to-transparent border-t-2 border-rose-500"></div>
              <span className="text-xs font-bold text-on-surface-variant">Morning Half</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-emerald-500/40 via-emerald-500/40 via-[30%] to-transparent border-b-2 border-emerald-500"></div>
              <span className="text-xs font-bold text-on-surface-variant">Evening Half</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-purple-500/40 via-purple-500/40 via-[30%] to-transparent border-2 border-purple-500"></div>
              <span className="text-xs font-bold text-on-surface-variant">Full Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-orange-600/40 via-orange-600/40 via-[30%] to-transparent border-2 border-orange-600"></div>
              <span className="text-xs font-bold text-on-surface-variant">Mukurtham</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-surface-container-low border border-outline-variant/20"></div>
              <span className="text-xs font-bold text-on-surface-variant">Available</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-4">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[9px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant py-1 md:py-2">
                {d}
              </div>
            ))}
            
            {Array.from({ length: START_DAY_IDX }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-lg md:rounded-2xl bg-surface-container-low/30 border border-dashed border-outline-variant/10"></div>
            ))}

            {Array.from({ length: MARCH_2026_DAYS }).map((_, i) => {
              const day = i + 1;
              const b = activeBlocksDict[day];
              const isSelected = selectedDate === day;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "relative aspect-square rounded-lg md:rounded-2xl border md:border-2 transition-all overflow-hidden group flex flex-col items-center justify-center",
                    getHoverClasses(b?.type || null, isSelected)
                  )}
                >
                  <span className={cn(
                    "text-[13px] md:text-xl font-black z-10 transition-colors",
                    (b?.type === 'full' || b?.type === 'mukurtham') ? "absolute top-1 md:static" : "",
                    getHoverTextClasses(b?.type || null)
                  )}>
                    {day}
                  </span>

                  {/* Morning Block Visual */}
                  {b?.type === 'morning' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-rose-500/20 via-[30%] to-transparent border-t-2 md:border-t-4 border-rose-500 pointer-events-none rounded-lg md:rounded-xl"></div>
                  )}

                  {/* Evening Block Visual */}
                  {b?.type === 'evening' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-emerald-500/20 via-[30%] to-transparent border-b-2 md:border-b-4 border-emerald-500 pointer-events-none"></div>
                  )}

                  {/* Full Block Visual */}
                  {b?.type === 'full' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-purple-500/20 via-[30%] to-transparent border-2 md:border-4 border-purple-500 pointer-events-none rounded-lg md:rounded-xl"></div>
                      <div className="absolute inset-x-0 bottom-1 md:bottom-2 hidden md:flex justify-center text-purple-600 pointer-events-none">
                        <div className="px-1 md:px-2 py-[1px] md:py-0.5 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-[6px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5 md:gap-1 border border-purple-500/20 shadow-sm leading-none">
                          <XCircle className="w-2 md:w-2.5 h-2 md:h-2.5" /> <span className="hidden sm:inline">Blocked</span><span className="sm:hidden">F</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mukurtham Block Visual */}
                  {b?.type === 'mukurtham' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-orange-600/20 via-[30%] to-transparent border-2 md:border-4 border-orange-600 pointer-events-none rounded-lg md:rounded-xl"></div>
                      <div className="absolute inset-x-0 bottom-1 md:bottom-2 hidden md:flex justify-center text-orange-600 pointer-events-none">
                        <div className="px-1 md:px-2 py-[1px] md:py-0.5 bg-surface-container-lowest/80 backdrop-blur-sm rounded-full text-[6px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5 md:gap-1 border border-orange-500/20 shadow-sm leading-none">
                          <CheckCircle2 className="w-2 md:w-2.5 h-2 md:h-2.5" /> <span className="hidden sm:inline">Booked</span><span className="sm:hidden">M</span>
                        </div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION PANEL */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDate(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {selectedDate ? (
          <motion.div 
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 md:inset-x-0 md:mx-auto md:w-full md:max-w-md top-[10vh] bottom-[10vh] z-50 lg:static lg:inset-auto lg:z-auto lg:mx-0 lg:max-w-none w-auto lg:w-[400px] shrink-0 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-2xl lg:shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-outline-variant/10 bg-primary-container text-white relative">
              <button 
                onClick={() => setSelectedDate(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-3xl font-black mt-2">Mar {selectedDate}</h3>
              <p className="font-bold text-white/80 mt-1 uppercase tracking-widest text-xs">2026 • {selectedMandapam?.name}</p>
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
              {currentBlock ? (
                <div className="space-y-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    getTypeColor(currentBlock.type)
                  )}>
                    {currentBlock.type === 'full' || currentBlock.type === 'mukurtham' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {getTypeLabel(currentBlock.type)} Booking
                  </div>

                  <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 pb-2">Booking Details</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{currentBlock.customerName || 'Admin Block'}</p>
                        <p className="text-xs text-on-surface-variant">Customer Name</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{currentBlock.phone || 'N/A'}</p>
                        <p className="text-xs text-on-surface-variant">Contact</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{currentBlock.id}</p>
                        <p className="text-xs text-on-surface-variant">Booking Ref ID</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleUnblock}
                    className="w-full py-4 bg-error/10 text-error font-black text-sm rounded-xl border border-error/20 hover:bg-error/20 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Unblock / Cancel Booking
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBlock} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block px-1">Pick a Slot</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'morning', label: 'Morning Half', time: '06:00 AM - 02:00 PM' },
                        { id: 'evening', label: 'Evening Half', time: '03:00 PM - 11:00 PM' },
                          { id: 'full', label: 'Full Day', time: '24 Hours' },
                          { id: 'mukurtham', label: 'Mukurtham', time: 'Auspicious Only' }
                      ].map(slot => (
                        <label 
                          key={slot.id} 
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                            bookingForm.slot === slot.id ?
                              (slot.id === 'morning' ? "border-rose-500 bg-rose-500/5 shadow-sm" :
                                slot.id === 'evening' ? "border-emerald-500 bg-emerald-500/5 shadow-sm" :
                                  slot.id === 'full' ? "border-purple-500 bg-purple-500/5 shadow-sm" :
                                    "border-orange-500 bg-orange-500/5 shadow-sm")
                              : "border-outline-variant/10 bg-surface-container-low hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-surface">{slot.label}</span>
                            <input 
                              type="radio" 
                              name="slot" 
                              value={slot.id} 
                              checked={bookingForm.slot === slot.id}
                              onChange={(e) => setBookingForm({...bookingForm, slot: e.target.value})}
                              className="w-4 h-4 text-primary focus:ring-primary rounded-full accent-primary" 
                            />
                          </div>
                          <span className="text-xs text-on-surface-variant mt-1 font-medium flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {slot.time}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block px-1">Customer Details <span className="lowercase font-bold opacity-60">(optional)</span></label>
                    
                    <div className="space-y-1.5">
                      <input 
                          type="text"
                        placeholder="Customer Name"
                        value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 ring-primary/20" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <input 
                          type="tel"
                        placeholder="Phone Number"
                        value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 ring-primary/20" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-primary text-white font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Block Date
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="hidden lg:flex w-[400px] shrink-0 bg-surface-container-low/50 rounded-3xl border border-dashed border-outline-variant/30 flex-col items-center justify-center text-center p-4 md:p-8">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CalendarDays className="w-10 h-10 text-on-surface-variant opacity-50" />
            </div>
            <h3 className="text-xl font-black text-on-surface">Select a Date</h3>
              <p className="text-sm font-medium text-on-surface-variant mt-2">
              Tap on any date in the calendar to view its booking details or block a new slot for {selectedMandapam?.name}.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
