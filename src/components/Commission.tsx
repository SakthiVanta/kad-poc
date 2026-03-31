import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  IndianRupee,
  Calendar,
  Phone,
  User,
  Store,
  MoreHorizontal,
  UploadCloud,
  Camera,
  Gift,
  Activity,
  CreditCard,
  Smartphone,
  Banknote,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CommissionRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  venueId: string;
  venueName: string;
  vendorName: string;
  vendorContact: string;
  dateOfEvent: string;
  eventType: string;
  bookingValue: number;
  commissionReceivable: number;
  status: 'Due' | 'Follow-up' | 'AFC' | 'Collected' | 'Denied' | 'Cancelled';
  kaeName: string;
  kamName: string;
}

const mockCommissionRecords: CommissionRecord[] = [
  {
    id: 'COM-001',
    customerName: 'Ravi Kumar',
    customerPhone: '9876543210',
    venueId: '5065',
    venueName: 'The Grand Hall',
    vendorName: 'Suresh Raina',
    vendorContact: '9876543211',
    dateOfEvent: '2026-04-25',
    eventType: 'Wedding',
    bookingValue: 200000,
    commissionReceivable: 10000,
    status: 'Due',
    kaeName: 'Sanjay Kumar',
    kamName: 'Rahul Sharma'
  },
  {
    id: 'COM-002',
    customerName: 'Anjali Sharma',
    customerPhone: '9988776655',
    venueId: '5066',
    venueName: 'Emerald Banquet',
    vendorName: 'Anita Desai',
    vendorContact: '9823456789',
    dateOfEvent: '2026-05-12',
    eventType: 'Corporate',
    bookingValue: 150000,
    commissionReceivable: 7500,
    status: 'Follow-up',
    kaeName: 'Sanjay Kumar',
    kamName: 'Rahul Sharma'
  },
  {
    id: 'COM-003',
    customerName: 'Vikram Singh',
    customerPhone: '9123456789',
    venueId: '5067',
    venueName: 'The Heritage',
    vendorName: 'Rajesh Khanna',
    vendorContact: '9834567890',
    dateOfEvent: '2026-03-20',
    eventType: 'Reception',
    bookingValue: 300000,
    commissionReceivable: 15000,
    status: 'AFC',
    kaeName: 'Sanjay Kumar',
    kamName: 'Rahul Sharma'
  }
];

const transactions = [
  { id: 'TXN-99012', venue: 'The Grand Hall', date: '22-Mar-2026', amount: '₹42,500', status: 'Settled', type: 'Credit' },
  { id: 'TXN-99015', venue: 'Emerald Banquet', date: '20-Mar-2026', amount: '₹12,800', status: 'Pending', type: 'Credit' },
  { id: 'TXN-98980', venue: 'Royal Residency', date: '18-Mar-2026', amount: '₹85,000', status: 'Settled', type: 'Credit' },
];

type DispositionType = 
  | 'Commission under follow-up' 
  | 'Commission receivable AFC' 
  | 'Vendor denied' 
  | 'Next booking commission collectible' 
  | 'Booked through us — not interested' 
  | 'Booking not done at all' 
  | 'Event cancelled' 
  | 'Follow-up — new listing' 
  | '';

export function Commission() {
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [isCollected, setIsCollected] = useState<boolean | null>(null);
  const [disposition, setDisposition] = useState<DispositionType>('');
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = mockCommissionRecords.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderActionForm = () => {
    if (isCollected === true) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-4 md:p-6 bg-tertiary/5 rounded-2xl border border-tertiary/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-tertiary" />
            <h4 className="text-sm font-bold text-tertiary uppercase tracking-wider">Log Collection Details</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount Collected</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">₹</span>
                <input 
                  type="number" 
                  defaultValue={selectedRecord?.commissionReceivable}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-8 pr-4 font-bold focus:ring-2 ring-tertiary/20" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date of Collection</label>
              <input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-tertiary/20" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mode of Payment</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'GPay', icon: Smartphone, label: 'GPay' },
                { id: 'Cheque', icon: CreditCard, label: 'Cheque' },
                { id: 'Cash', icon: Banknote, label: 'Cash' },
                { id: 'Scanner', icon: QrCode, label: 'Scanner' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                    paymentMode === mode.id 
                      ? "bg-tertiary/10 border-tertiary text-tertiary" 
                      : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"
                  )}
                >
                  <mode.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Upload Proof (Mandatory)</label>
            <div className="border-2 border-dashed border-tertiary/30 rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center hover:bg-tertiary/5 transition-colors cursor-pointer group">
              <UploadCloud className="w-10 h-10 text-tertiary opacity-30 group-hover:scale-110 group-hover:opacity-100 transition-all mb-2" />
              <p className="text-xs font-bold text-tertiary">Tap to capture or upload payment proof</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Supports Image/PDF from mobile/tablet</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Balance Collectible (if any)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">₹</span>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-8 pr-4 font-bold focus:ring-2 ring-tertiary/20" 
              />
            </div>
          </div>
        </motion.div>
      );
    }

    if (isCollected === false) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-4 md:p-6 bg-primary/5 rounded-2xl border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Set Commission Disposition</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Disposition</label>
            <div className="relative">
              <select 
                value={disposition}
                onChange={(e) => setDisposition(e.target.value as DispositionType)}
                className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="">Choose outcome...</option>
                <option value="Commission under follow-up">Commission under follow-up</option>
                <option value="Commission receivable AFC">Commission receivable AFC</option>
                <option value="Vendor denied">Vendor denied</option>
                <option value="Next booking commission collectible">Next booking commission collectible</option>
                <option value="Booked through us — not interested">Booked through us — not interested</option>
                <option value="Booking not done at all">Booking not done at all</option>
                <option value="Event cancelled">Event cancelled</option>
                <option value="Follow-up — new listing">Follow-up — new listing</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          {(disposition === 'Commission under follow-up' || disposition === 'Commission receivable AFC') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Next Follow-up Date</label>
                <input type="date" className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Next Follow-up Time</label>
                <input type="time" className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20" />
              </div>
            </div>
          )}

          {disposition === 'Vendor denied' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Denial Reason & Escalation Notes</label>
              <textarea rows={4} className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-4 font-medium focus:ring-2 ring-primary/20 resize-none" placeholder="Explain why the vendor denied payment..."></textarea>
              <p className="text-[10px] text-primary font-bold italic">This will be escalated to KAM: {selectedRecord?.kamName}</p>
            </div>
          )}

          {disposition === 'Follow-up — new listing' && (
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <p className="text-xs font-bold text-primary">Opportunity Identified!</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Submitting this will redirect you to the Lead Module to capture new listing details.</p>
            </div>
          )}
        </motion.div>
      );
    }

    return null;
  };

  if (selectedRecord) {
    return (
      <div className="space-y-8 mx-auto">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => { setSelectedRecord(null); setIsCollected(null); setDisposition(''); setPaymentMode(''); }}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] uppercase tracking-widest mb-1 font-bold">
              <span>Commission Settlement</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{selectedRecord.customerName}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Process Commission</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Left: Record Intelligence */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{selectedRecord.customerName}</h2>
                  <p className="text-sm text-on-surface-variant font-medium">{selectedRecord.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Venue Details</p>
                  </div>
                  <p className="text-sm font-bold">{selectedRecord.venueName}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">ID: {selectedRecord.venueId}</p>
                  <div className="mt-3 pt-3 border-t border-outline-variant/10">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Vendor</p>
                    <p className="text-xs font-bold">{selectedRecord.vendorName}</p>
                    <p className="text-[10px] text-on-surface-variant">{selectedRecord.vendorContact}</p>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Event Details</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">{new Date(selectedRecord.dateOfEvent).toLocaleDateString([], { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-on-surface-variant">{selectedRecord.eventType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">Booking Value</p>
                      <p className="text-sm font-bold">₹{selectedRecord.bookingValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-primary-container text-white rounded-2xl shadow-lg shadow-primary/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Commission Receivable</p>
                  <h3 className="text-3xl font-black">₹{selectedRecord.commissionReceivable.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Form */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest p-4 md:p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold">Collection Status</h3>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block text-center">Was the commission collected?</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => { setIsCollected(true); setDisposition(''); }}
                      className={cn(
                        "flex-1 py-5 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center gap-3",
                        isCollected === true 
                          ? "bg-tertiary/10 border-tertiary text-tertiary shadow-lg shadow-tertiary/10" 
                          : "bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high"
                      )}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      YES
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsCollected(false); setPaymentMode(''); }}
                      className={cn(
                        "flex-1 py-5 rounded-2xl border-2 font-black text-lg transition-all flex items-center justify-center gap-3",
                        isCollected === false 
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
                  {renderActionForm()}
                </AnimatePresence>

                {isCollected !== null && (
                  <div className="pt-8 border-t border-surface-container-low flex flex-col md:flex-row gap-4">
                    <button className="flex-1 py-4 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Submit Commission Record
                    </button>
                    <button className="px-4 md:px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all">
                      Save Draft
                    </button>
                  </div>
                )}
              </div>
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
          <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Financial Intelligence</p>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Commission Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-low text-on-surface px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <Download className="w-4 h-4" />
            Statement
          </button>
          <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider">
            KAE: Sanjay Kumar
          </div>
        </div>
      </header>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Wallet Card */}
        <div className="bg-primary-container rounded-3xl p-4 md:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div className="p-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Active Balance</span>
            </div>
            <p className="text-white/60 text-sm font-medium mb-1">Total Settled Commission</p>
            <h2 className="text-5xl font-black mb-10 tracking-tighter">₹4,28,500</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white mb-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">This Month</span>
                </div>
                <p className="text-lg font-bold">₹85,400</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Pending</span>
                </div>
                <p className="text-lg font-bold">₹12,800</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-tertiary" />
                </div>
                <span className="text-xs font-bold text-tertiary">+14% vs Last Month</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Settlement Rate</h4>
              <p className="text-3xl font-black mt-1">98.2%</p>
            </div>
            <div className="mt-4 h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-tertiary" style={{ width: '98.2%' }}></div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-4 md:p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary">Needs Attention</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Disputed Claims</h4>
              <p className="text-3xl font-black mt-1">04</p>
            </div>
            <button className="mt-4 text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Review Disputes <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Commission Records Listing */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Pending Commissions</h2>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Action Required</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search customer or venue..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2">
              <Filter className="w-4 h-4 text-on-surface-variant" />
              <select className="bg-transparent border-none focus:ring-0 text-xs font-bold text-on-surface cursor-pointer">
                <option>All KAEs</option>
                <option>Sanjay Kumar</option>
                <option>Rahul Sharma</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar max-h-[500px] overflow-y-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-surface-container-low/50 text-on-surface-variant uppercase text-[10px] font-black tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-4 md:px-6 py-4">Customer & Venue</th>
                <th className="px-4 md:px-6 py-4">Event Date</th>
                <th className="px-4 md:px-6 py-4">Booking Value</th>
                <th className="px-4 md:px-6 py-4">Commission Due</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredRecords.map((record) => (
                <tr 
                  key={record.id} 
                  onClick={() => setSelectedRecord(record)}
                  className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {record.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{record.customerName}</p>
                        <p className="text-xs text-on-surface-variant">{record.venueName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="text-sm font-bold text-on-surface">
                      {new Date(record.dateOfEvent).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">{record.eventType}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="text-sm font-bold">₹{record.bookingValue.toLocaleString()}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="text-sm font-black text-primary">₹{record.commissionReceivable.toLocaleString()}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      record.status === 'Due' ? "bg-primary/10 text-primary" : 
                      record.status === 'Follow-up' ? "bg-tertiary/10 text-tertiary" : 
                      "bg-surface-container-high text-on-surface-variant"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/10 group-hover:scale-105 transition-all">
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="p-4 md:p-6 border-b border-surface-container-low flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-on-surface">Settlement History</h3>
          <button className="text-xs font-bold text-primary uppercase tracking-widest">View All History</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50 text-on-surface-variant uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-4 md:px-8 py-5">TXN ID</th>
                <th className="px-4 md:px-8 py-5">Venue</th>
                <th className="px-4 md:px-8 py-5">Date</th>
                <th className="px-4 md:px-8 py-5">Amount</th>
                <th className="px-4 md:px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-surface transition-colors group cursor-pointer">
                  <td className="px-4 md:px-8 py-6 text-sm font-bold text-on-surface-variant">{txn.id}</td>
                  <td className="px-4 md:px-8 py-6">
                    <p className="font-bold text-on-surface">{txn.venue}</p>
                  </td>
                  <td className="px-4 md:px-8 py-6 text-sm font-medium text-on-surface-variant">{txn.date}</td>
                  <td className="px-4 md:px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-on-surface">{txn.amount}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-6">
                    <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider bg-tertiary/10 text-tertiary">
                      {txn.status}
                    </span>
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
