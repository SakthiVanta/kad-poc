import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Navigation,
  FileText,
  Camera,
  UploadCloud,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  MessageSquare,
  Activity,
  ArrowLeft,
  Calendar,
  IndianRupee,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface P1VisitData {
  id: string;
  customerName: string;
  customerNumber: string;
  timeOfMeeting: string;
  suggestedVenues: string[];
  status: 'Pending' | 'Completed';
  priority: 'P1' | 'P2' | 'P3';
  lastInteraction?: string;
}

const mockVisits: P1VisitData[] = [
  {
    id: 'P1-001',
    customerName: 'Ravi Kumar',
    customerNumber: '+91 98765 43210',
    timeOfMeeting: '2026-03-27T14:30:00',
    suggestedVenues: ['Venue A (Central Mall)', 'Venue B (North Plaza)', 'Venue C (Tech Park)'],
    status: 'Pending',
    priority: 'P1',
    lastInteraction: 'TC Call - 2 Days Ago'
  },
  {
    id: 'P1-002',
    customerName: 'Anjali Sharma',
    customerNumber: '+91 99887 76655',
    timeOfMeeting: '2026-03-27T16:00:00',
    suggestedVenues: ['Venue D (South Hub)', 'Venue E (East Gate)'],
    status: 'Pending',
    priority: 'P1',
    lastInteraction: 'WhatsApp - Today'
  },
  {
    id: 'P1-003',
    customerName: 'Vikram Singh',
    customerNumber: '+91 91234 56789',
    timeOfMeeting: '2026-03-28T11:00:00',
    suggestedVenues: ['Venue A (Central Mall)'],
    status: 'Pending',
    priority: 'P1',
    lastInteraction: 'TC Call - Yesterday'
  },
  {
    id: 'P1-004',
    customerName: 'Sonal Gupta',
    customerNumber: '+91 95555 44444',
    timeOfMeeting: '2026-03-28T13:30:00',
    suggestedVenues: ['Venue B (North Plaza)', 'Venue C (Tech Park)'],
    status: 'Completed',
    priority: 'P1',
    lastInteraction: 'Visit - 1 Day Ago'
  }
];

type DispositionType = 'Booking Success' | 'Alternate Venue Suggested' | 'Not Interested' | 'Customer to Decide Later' | '';

export function P1Visit() {
  const [selectedVisit, setSelectedVisit] = useState<P1VisitData | null>(null);
  const [disposition, setDisposition] = useState<DispositionType>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisits = mockVisits.filter(v => 
    v.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDispositionFields = () => {
    switch (disposition) {
      case 'Booking Success':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/10"
          >
            <div className="col-span-full mb-2">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Booking Confirmation Details</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Date of Event</label>
              <input type="date" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 font-medium transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Type of Event</label>
              <select className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 font-medium appearance-none">
                <option>Wedding</option>
                <option>Corporate Event</option>
                <option>Birthday</option>
                <option>Others</option>
              </select>
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Booking Value (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">₹</span>
                <input type="number" placeholder="0.00" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus:ring-0 pl-8 pr-4 py-3 text-lg font-bold transition-all" />
              </div>
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Comments</label>
              <textarea className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-sm transition-all" rows={3} placeholder="Additional notes..."></textarea>
            </div>
          </motion.div>
        );
      case 'Alternate Venue Suggested':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-tertiary/5 rounded-xl border border-tertiary/10"
          >
            <div className="col-span-full mb-2">
              <p className="text-xs font-bold text-tertiary uppercase tracking-wider">Alternate Proposal Details</p>
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Venue Name</label>
              <input type="text" placeholder="Enter venue name" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-tertiary focus:ring-0 px-4 py-3 font-medium transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Date of Event</label>
              <input type="date" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-tertiary focus:ring-0 px-4 py-3 font-medium transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Type of Event</label>
              <select className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-tertiary focus:ring-0 px-4 py-3 font-medium appearance-none">
                <option>Wedding</option>
                <option>Corporate Event</option>
                <option>Birthday</option>
                <option>Others</option>
              </select>
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Expected Value (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">₹</span>
                <input type="number" placeholder="0.00" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-tertiary focus:ring-0 pl-8 pr-4 py-3 text-lg font-bold transition-all" />
              </div>
            </div>
            <div className="col-span-full space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Comments</label>
              <textarea className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-tertiary focus:ring-0 px-4 py-3 text-sm transition-all" rows={3} placeholder="Why alternate venue?"></textarea>
            </div>
          </motion.div>
        );
      case 'Not Interested':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6 bg-error/5 rounded-xl border border-error/10 space-y-4"
          >
            <div className="mb-2">
              <p className="text-xs font-bold text-error uppercase tracking-wider">Rejection Reason</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Reason for Disinterest</label>
              <textarea className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-error focus:ring-0 px-4 py-3 text-sm transition-all" rows={4} placeholder="Detailed reason for not being interested..."></textarea>
            </div>
          </motion.div>
        );
      case 'Customer to Decide Later':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-6 bg-secondary/5 rounded-xl border border-secondary/10 space-y-4"
          >
            <div className="mb-2">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">Follow-up Schedule</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Follow-up Date</label>
                <input type="date" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 px-4 py-3 font-medium transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase">Follow-up Time</label>
                <input type="time" className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 px-4 py-3 font-medium transition-all" />
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">Note: This will trigger a follow-up alert for both KAE and KAM.</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (selectedVisit) {
    return (
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedVisit(null); setDisposition(''); }}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span>P1 Visit Plan</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{selectedVisit.customerName}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Visit Disposition Entry</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Left Column: Customer Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedVisit.customerName}</h2>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {selectedVisit.customerNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">Meeting Schedule</p>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-bold">{new Date(selectedVisit.timeOfMeeting).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Suggested Venues (KAM)</p>
                  <div className="space-y-2">
                    {selectedVisit.suggestedVenues.map((venue, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {venue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold">{selectedVisit.lastInteraction}</p>
                    <p className="text-[10px] text-on-surface-variant">KAM synced data from TC CRM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Disposition Form */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest p-4 md:p-8 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Outcome Details</h3>
                <span className="text-[10px] font-black uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">Step 2 of 2</span>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Disposition</label>
                  <div className="relative">
                    <select 
                      value={disposition}
                      onChange={(e) => setDisposition(e.target.value as DispositionType)}
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="">Choose outcome...</option>
                      <option value="Booking Success">Booking Success</option>
                      <option value="Alternate Venue Suggested">Alternate Venue Suggested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Customer to Decide Later">Customer to Decide Later</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {renderDispositionFields()}
                </AnimatePresence>

                {disposition && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-6 border-t border-surface-container-low flex flex-col md:flex-row gap-4 md:gap-6 items-center"
                  >
                    <button className="w-full md:w-auto px-12 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Save & Sync to CRM
                    </button>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-[10px] font-medium leading-tight">
                        Disposition will be shared with KAM immediately.
                      </p>
                    </div>
                  </motion.div>
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
            <span className="text-primary">P1 Visit Plan</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Customer Visit Planning</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage and track high-priority customer visits synced from TC CRM.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full flex items-center gap-3">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">Today: {new Date().toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: mockVisits.length, icon: User, color: 'text-primary' },
          { label: 'Pending', value: mockVisits.filter(v => v.status === 'Pending').length, icon: Clock, color: 'text-tertiary' },
          { label: 'Completed', value: mockVisits.filter(v => v.status === 'Completed').length, icon: CheckCircle2, color: 'text-secondary' },
          { label: 'Success Rate', value: '64%', icon: Activity, color: 'text-primary' },
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

      {/* Listing Section */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Active Visit Plans</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search customers..." 
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
                <th className="px-4 md:px-6 py-4">Customer Details</th>
                <th className="px-4 md:px-6 py-4">Meeting Time</th>
                <th className="px-4 md:px-6 py-4">Suggested Venues</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredVisits.map((visit) => (
                <tr 
                  key={visit.id} 
                  onClick={() => visit.status === 'Pending' && setSelectedVisit(visit)}
                  className={cn(
                    "group hover:bg-surface-container-low transition-colors cursor-pointer",
                    visit.status === 'Completed' && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {visit.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{visit.customerName}</p>
                        <p className="text-xs text-on-surface-variant">{visit.customerNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">
                        {new Date(visit.timeOfMeeting).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      {new Date(visit.timeOfMeeting).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {visit.suggestedVenues.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-bold">
                          {v.split(' ')[0]} {v.split(' ')[1]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      visit.status === 'Pending' ? "bg-tertiary/10 text-tertiary" : "bg-secondary/10 text-secondary"
                    )}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    {visit.status === 'Pending' ? (
                      <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/10 group-hover:scale-105 transition-all">
                        Disposition
                      </button>
                    ) : (
                      <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    )}
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
