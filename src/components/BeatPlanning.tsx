import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Navigation,
  ClipboardCheck,
  Bell,
  Info,
  Phone,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Calendar,
  Wallet,
  UserPlus,
  PlusCircle,
  Search,
  Settings,
  Save,
  Edit3,
  Map as MapIcon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { id: 1, type: 'Commission', message: 'Pending commission collection for Vista Hall (B1)', time: '10 mins ago', priority: 'high' },
  { id: 2, type: 'P1 Visit', message: 'New P1 visit assigned for Emerald Garden (B1)', time: '1 hour ago', priority: 'medium' },
  { id: 3, type: 'BWG', message: 'BWG Upgradation due for Grand Royal (B3)', time: '2 hours ago', priority: 'low' },
];

const initialVendors = [
  {
    id: 'V-88012',
    halls: 3,
    name: 'Vista Hall',
    contacts: ['+91 98765 43210', '+91 98765 43211'],
    zip: '560001',
    bwgPromise: 'Y',
    cooperation: 'Y',
    beatNo: 'B1',
    purpose: 'P1 Visit',
    details: 'Premium venue with high booking rate.',
    proximity: 0.4,
    isNearby: true,
    manager: 'Suresh Kumar',
    address: '12th Main, Indiranagar, Bangalore',
    comments: ''
  },
  {
    id: 'V-88145',
    halls: 5,
    name: 'Grand Royal',
    contacts: ['+91 99912 33445'],
    zip: '560012',
    bwgPromise: 'N',
    cooperation: 'PY',
    beatNo: 'B3',
    purpose: 'BWG Upgradation',
    details: 'Needs infrastructure audit for BWG promise.',
    proximity: 1.2,
    isNearby: false,
    manager: 'Anita Rao',
    address: 'MG Road, Bangalore',
    comments: ''
  },
  {
    id: 'V-88220',
    halls: 2,
    name: 'Emerald Garden',
    contacts: ['+91 98881 12233', '+91 98881 12234'],
    zip: '560001',
    bwgPromise: 'Y',
    cooperation: 'N',
    beatNo: 'B1',
    purpose: 'Commission Visit',
    details: 'Regular vendor, pending commission for Feb.',
    proximity: 0.9,
    isNearby: true,
    manager: 'Ramesh Babu',
    address: 'Koramangala 4th Block, Bangalore',
    comments: ''
  },
  {
    id: 'V-88301',
    halls: 4,
    name: 'Royal Orchid',
    contacts: ['+91 97771 22334'],
    zip: '560038',
    bwgPromise: 'Y',
    cooperation: 'Y',
    beatNo: 'B2',
    purpose: 'General Visit',
    details: 'Annual maintenance check required.',
    proximity: 2.5,
    isNearby: false,
    manager: 'Vikram Singh',
    address: 'Indiranagar 100ft Road, Bangalore',
    comments: ''
  }
];

const purposeOptions = [
  'P1 Visit',
  'Commission Visit',
  'BWG Upgradation',
  'General Visit',
  'New Listing',
  'Lead Generation'
];

const purposeRoutes: Record<string, string> = {
  'P1 Visit': '/p1-visit',
  'Commission Visit': '/commission',
  'BWG Upgradation': '/bwg',
  'General Visit': '/general-visit',
  'New Listing': '/lead-capture',
  'Lead Generation': '/lead-capture'
};

export function BeatPlanning() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(initialVendors);
  const [selectedVendor, setSelectedVendor] = useState<typeof initialVendors[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeat, setSelectedBeat] = useState('All Beats (B1-B10)');
  const [selectedPurpose, setSelectedPurpose] = useState('Purpose Filter');
  const [sortByProximity, setSortByProximity] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [plannedVisits, setPlannedVisits] = useState<typeof initialVendors>([]);

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    vendorId: '',
    vendorName: '',
    halls: '',
    contacts: '',
    zip: '',
    bwgPromise: 'Y',
    cooperation: 'Y',
    beatNo: 'B1'
  });

  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBeat = selectedBeat === 'All Beats (B1-B10)' || v.beatNo === selectedBeat.replace('Beat ', '');
      const matchesPurpose = selectedPurpose === 'Purpose Filter' || v.purpose === selectedPurpose;
      return matchesSearch && matchesBeat && matchesPurpose;
    });

    if (sortByProximity) {
      result.sort((a, b) => a.proximity - b.proximity);
    }

    return result;
  }, [vendors, searchQuery, selectedBeat, selectedPurpose, sortByProximity]);

  const handlePurposeChange = (vendorId: string, purpose: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, purpose } : v));
    const route = purposeRoutes[purpose];
    if (route) {
      // Small delay to show selection before navigating
      setTimeout(() => navigate(route), 300);
    }
  };

  const addToPlan = (vendor: typeof initialVendors[0]) => {
    if (!plannedVisits.find(v => v.id === vendor.id)) {
      setPlannedVisits(prev => [...prev, vendor]);
    }
  };

  const removeFromPlan = (id: string) => {
    setPlannedVisits(prev => prev.filter(v => v.id !== id));
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Updating vendor:', adminForm);
    setIsAdminModalOpen(false);
    // Mock update
    setVendors(prev => prev.map(v => v.id === adminForm.vendorId ? { 
      ...v, 
      name: adminForm.vendorName,
      halls: parseInt(adminForm.halls) || v.halls,
      zip: adminForm.zip,
      bwgPromise: adminForm.bwgPromise,
      cooperation: adminForm.cooperation,
      beatNo: adminForm.beatNo
    } : v));
  };

  return (
    <div className="space-y-8">
      {/* Admin Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-on-surface tracking-tight">Admin: Update Vendor</h3>
                    <p className="text-sm text-on-surface-variant">Modify core vendor and venue details for synchronization.</p>
                  </div>
                  <button onClick={() => setIsAdminModalOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vendor ID (Searchable)</label>
                      <select 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.vendorId}
                        onChange={(e) => {
                          const v = vendors.find(vend => vend.id === e.target.value);
                          if (v) setAdminForm({
                            vendorId: v.id,
                            vendorName: v.name,
                            halls: v.halls.toString(),
                            contacts: v.contacts.join(', '),
                            zip: v.zip,
                            bwgPromise: v.bwgPromise,
                            cooperation: v.cooperation,
                            beatNo: v.beatNo
                          });
                        }}
                      >
                        <option value="">Select Vendor to Edit</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.id} - {v.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vendor Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.vendorName}
                        onChange={(e) => setAdminForm({...adminForm, vendorName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">No. of Halls</label>
                      <input 
                        type="number" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.halls}
                        onChange={(e) => setAdminForm({...adminForm, halls: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Zip Code</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.zip}
                        onChange={(e) => setAdminForm({...adminForm, zip: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">BWG Promise</label>
                      <select 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.bwgPromise}
                        onChange={(e) => setAdminForm({...adminForm, bwgPromise: e.target.value})}
                      >
                        <option value="Y">Yes (Y)</option>
                        <option value="N">No (N)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Co-operation</label>
                      <select 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 font-bold text-sm"
                        value={adminForm.cooperation}
                        onChange={(e) => setAdminForm({...adminForm, cooperation: e.target.value})}
                      >
                        <option value="Y">Yes (Y)</option>
                        <option value="PY">Partially (PY)</option>
                        <option value="N">No (N)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      Update & Sync Portal
                    </button>
                    <button type="button" onClick={() => setIsAdminModalOpen(false)} className="px-4 md:px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vendor Detail Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVendor(null)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Left: Visuals & Quick Info */}
              <div className="w-full md:w-2/5 bg-primary-container p-4 md:p-8 text-white relative overflow-hidden flex flex-col">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black mb-6 border-2 border-white/30 shadow-xl">
                      {selectedVendor.name.charAt(0)}
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      Vendor ID: {selectedVendor.id}
                    </span>
                    <h2 className="text-3xl font-black mt-4 leading-tight">{selectedVendor.name}</h2>
                    <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedVendor.address}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Capacity</p>
                        <p className="font-bold">{selectedVendor.halls} Halls</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Beat Assignment</p>
                        <p className="font-bold">Beat {selectedVendor.beatNo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Manager Details</p>
                      <p className="font-bold text-lg">{selectedVendor.manager}</p>
                      <div className="flex items-center gap-2 mt-1 text-white/70">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{selectedVendor.contacts[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Right: Details & Actions */}
              <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar bg-surface-container-lowest">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-on-surface tracking-tight">Vendor Intelligence</h3>
                  <button 
                    onClick={() => setSelectedVendor(null)}
                    className="p-2 hover:bg-surface-container-low rounded-full transition-colors hidden md:block"
                  >
                    <X className="w-6 h-6 text-on-surface-variant" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-tertiary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">BWG Promise</span>
                    </div>
                    <p className="text-2xl font-black">{selectedVendor.bwgPromise}</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Co-operation</span>
                    </div>
                    <p className="text-2xl font-black">{selectedVendor.cooperation}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Vendor Notes</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{selectedVendor.details}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Contact Numbers</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.contacts.map((num, i) => (
                        <span key={i} className="px-3 py-1 bg-surface-container-low rounded-full text-xs font-bold text-primary flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'P1 Visit')}
                    className="flex items-center justify-center gap-2 py-4 bg-primary-container text-white rounded-xl font-black text-sm shadow-lg hover:shadow-primary-container/20 transition-all active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    P1 Visit
                  </button>
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'Commission Visit')}
                    className="flex items-center justify-center gap-2 py-4 bg-surface-container-high text-on-surface rounded-xl font-black text-sm hover:bg-surface-container-highest transition-all active:scale-95"
                  >
                    <Wallet className="w-4 h-4" />
                    Commission
                  </button>
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'BWG Upgradation')}
                    className="flex items-center justify-center gap-2 py-4 border-2 border-primary-container text-primary-container rounded-xl font-black text-sm hover:bg-primary-container/5 transition-all active:scale-95"
                  >
                    <TrendingUp className="w-4 h-4" />
                    BWG Upgrad.
                  </button>
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'New Listing')}
                    className="flex items-center justify-center gap-2 py-4 bg-on-surface text-surface-container-lowest rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Listing
                  </button>
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'Lead Generation')}
                    className="flex items-center justify-center gap-2 py-4 bg-tertiary text-white rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    Lead Gen.
                  </button>
                  <button 
                    onClick={() => handlePurposeChange(selectedVendor.id, 'General Visit')}
                    className="flex items-center justify-center gap-2 py-4 bg-surface-container-low text-on-surface-variant rounded-xl font-black text-sm hover:bg-surface-container-high transition-all active:scale-95"
                  >
                    <Info className="w-4 h-4" />
                    General Visit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Section */}
      <div className="bg-surface-container-low rounded-3xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Field Notifications
          </h3>
          <button className="text-xs font-bold text-primary hover:underline">Mark all as read</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {notifications.map((notif) => (
            <motion.div 
              key={notif.id}
              whileHover={{ scale: 1.02 }}
              className="min-w-[300px] bg-surface-container-lowest p-4 rounded-2xl shadow-sm border-l-4 border-primary flex gap-3"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notif.priority === 'high' ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
              )}>
                {notif.priority === 'high' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{notif.type}</span>
                  <span className="text-[10px] text-on-surface-variant">{notif.time}</span>
                </div>
                <p className="text-sm font-bold text-on-surface leading-tight">{notif.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Live Beat Tracking • GPS Active</span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Home Dashboard</h2>
          <p className="text-on-surface-variant text-sm max-w-md mt-1">Manage assigned beats, track vendor compliance, and plan proximity-based visits.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsAdminModalOpen(true)}
            className="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-highest transition-all"
          >
            <Settings className="w-4 h-4" />
            Admin Portal
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border-none rounded-full text-sm font-semibold pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/20 w-64"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full flex items-center gap-3">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <select 
              value={selectedBeat}
              onChange={(e) => setSelectedBeat(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface cursor-pointer"
            >
              <option>All Beats (B1-B10)</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i}>Beat B{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full flex items-center gap-3">
            <ClipboardCheck className="w-4 h-4 text-on-surface-variant" />
            <select 
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface cursor-pointer"
            >
              <option>Purpose Filter</option>
              {purposeOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setSortByProximity(!sortByProximity)}
            className={cn(
              "px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all",
              sortByProximity ? "bg-primary text-white shadow-lg" : "bg-surface-container-low text-on-surface"
            )}
          >
            <MapIcon className="w-4 h-4" />
            {sortByProximity ? "Proximity Sorted" : "Sort by Proximity"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Assigned Vendors', value: vendors.length.toString(), trend: '+12%', trendColor: 'text-tertiary' },
          { label: 'Nearby Venues', value: vendors.filter(v => v.proximity < 1).length.toString(), sub: 'Within 1km' },
          { label: 'BWG Pipeline', value: vendors.filter(v => v.bwgPromise === 'N').length.toString(), sub: 'Needs Visit', subColor: 'text-primary' },
          { label: 'Avg. Distance', value: (vendors.reduce((acc, v) => acc + v.proximity, 0) / vendors.length).toFixed(1), sub: 'km / visit', icon: MapPin },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-all relative overflow-hidden">
            {stat.icon && <stat.icon className="absolute right-4 top-4 w-12 h-12 text-on-surface-variant/10" />}
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-on-surface tracking-tighter">{stat.value}</span>
              {stat.trend && <span className={cn("text-xs font-bold", stat.trendColor)}>{stat.trend}</span>}
              {stat.sub && <span className={cn("text-[10px] font-medium", stat.subColor || "text-on-surface-variant")}>{stat.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Table 1: Main Beat Management */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
            1. Beat Management Table
            <span className="text-[10px] font-black px-2 py-0.5 bg-primary-container text-white rounded-full uppercase tracking-widest">Master List (B1-B10)</span>
          </h3>
        </div>

        <div className="bg-surface-container-low rounded-3xl p-1 overflow-x-auto no-scrollbar max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-separate border-spacing-y-1 min-w-[1200px]">
            <thead className="sticky top-0 z-10 bg-surface-container-low">
              <tr className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                <th className="px-4 md:px-6 py-4">Vendor ID</th>
                <th className="px-4 md:px-6 py-4">Halls</th>
                <th className="px-4 md:px-6 py-4">Vendor Name</th>
                <th className="px-4 md:px-6 py-4">Contact Numbers</th>
                <th className="px-4 md:px-6 py-4">Zip Code</th>
                <th className="px-4 md:px-6 py-4 text-center">BWG Promise</th>
                <th className="px-4 md:px-6 py-4 text-center">Co-operation</th>
                <th className="px-4 md:px-6 py-4 text-center">Beat No.</th>
                <th className="px-4 md:px-6 py-4">Purpose of Visit</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredVendors.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  className="bg-surface-container-lowest hover:bg-surface-bright transition-colors group shadow-sm"
                >
                  <td className="px-4 md:px-6 py-4 rounded-l-2xl font-bold text-on-surface-variant">{vendor.id}</td>
                  <td className="px-4 md:px-6 py-4 font-bold">{vendor.halls}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center font-black text-primary text-xs">
                        {vendor.name.charAt(0)}
                      </div>
                      <span className="font-bold text-on-surface">{vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      {vendor.contacts.map((num, i) => (
                        <span key={i} className="text-[11px] font-medium text-on-surface-variant">{num}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 font-medium">{vendor.zip}</td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black border",
                      vendor.bwgPromise === 'Y' ? "bg-tertiary/10 text-tertiary border-tertiary/20" : "bg-error/10 text-error border-error/20"
                    )}>{vendor.bwgPromise}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black border",
                      vendor.cooperation === 'Y' ? "bg-tertiary/10 text-tertiary border-tertiary/20" : 
                      vendor.cooperation === 'PY' ? "bg-secondary-container/30 text-secondary border-secondary/20" :
                      "bg-error/10 text-error border-error/20"
                    )}>{vendor.cooperation}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center font-black text-primary">{vendor.beatNo}</td>
                  <td className="px-4 md:px-6 py-4">
                    <select 
                      value={vendor.purpose}
                      onChange={(e) => handlePurposeChange(vendor.id, e.target.value)}
                      className="bg-surface-container-low text-[11px] font-bold py-2 px-3 rounded-lg border-none focus:ring-1 ring-primary-container outline-none cursor-pointer w-full"
                    >
                      <option>Select Purpose</option>
                      {purposeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 md:px-6 py-4 rounded-r-2xl text-right">
                    <button 
                      onClick={() => addToPlan(vendor)}
                      disabled={plannedVisits.some(v => v.id === vendor.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ml-auto",
                        plannedVisits.some(v => v.id === vendor.id) 
                          ? "bg-tertiary/10 text-tertiary cursor-not-allowed" 
                          : "bg-primary text-white hover:opacity-90 active:scale-95"
                      )}
                    >
                      {plannedVisits.some(v => v.id === vendor.id) ? <CheckCircle2 className="w-3 h-3" /> : <PlusCircle className="w-3 h-3" />}
                      {plannedVisits.some(v => v.id === vendor.id) ? "Planned" : "Add to Plan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 2: Planned Visits / Route Optimization */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
            2. Route Optimization Table
            <span className="text-[10px] font-black px-2 py-0.5 bg-tertiary text-white rounded-full uppercase tracking-widest">Active Visit Plan</span>
          </h3>
          {plannedVisits.length > 0 && (
            <button 
              onClick={() => setPlannedVisits([])}
              className="text-xs font-bold text-error hover:underline"
            >
              Clear Plan
            </button>
          )}
        </div>

        <div className="bg-surface-container-low rounded-3xl p-1 overflow-x-auto no-scrollbar">
          {plannedVisits.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border-2 border-dashed border-outline-variant/20">
              <Navigation className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-on-surface">No visits planned yet</h4>
              <p className="text-sm text-on-surface-variant mx-auto mt-1">Add vendors from the Beat Management table to start optimizing your field route.</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-1 min-w-[1200px]">
              <thead className="bg-surface-container-low">
                <tr className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  <th className="px-4 md:px-6 py-4">Sequence</th>
                  <th className="px-4 md:px-6 py-4">Halls</th>
                  <th className="px-4 md:px-6 py-4">Vendor Name</th>
                  <th className="px-4 md:px-6 py-4">Contacts</th>
                  <th className="px-4 md:px-6 py-4">Zip Code</th>
                  <th className="px-4 md:px-6 py-4 text-center">BWG Status</th>
                  <th className="px-4 md:px-6 py-4 text-center">Co-op Status</th>
                  <th className="px-4 md:px-6 py-4">Purpose</th>
                  <th className="px-4 md:px-6 py-4">Comments</th>
                  <th className="px-4 md:px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {plannedVisits.map((vendor, index) => (
                  <tr key={vendor.id} className="bg-surface-container-lowest shadow-sm">
                    <td className="px-4 md:px-6 py-4 rounded-l-2xl">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 font-bold">{vendor.halls}</td>
                    <td className="px-4 md:px-6 py-4 font-bold text-on-surface">{vendor.name}</td>
                    <td className="px-4 md:px-6 py-4 text-[11px] text-on-surface-variant">{vendor.contacts[0]}</td>
                    <td className="px-4 md:px-6 py-4 font-medium">{vendor.zip}</td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <span className="text-[10px] font-black">{vendor.bwgPromise}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <span className="text-[10px] font-black">{vendor.cooperation}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded">
                        {vendor.purpose}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <input 
                        type="text" 
                        placeholder="Add field notes..."
                        className="bg-transparent border-none focus:ring-0 text-xs w-full placeholder:text-on-surface-variant/30"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-4 rounded-r-2xl text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(purposeRoutes[vendor.purpose] || '/')}
                          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeFromPlan(vendor.id)}
                          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 h-[400px] rounded-3xl overflow-hidden relative shadow-inner border border-outline-variant/10">
          <img 
            src="https://picsum.photos/seed/map/1200/600?grayscale" 
            alt="Map" 
            className="w-full h-full object-cover opacity-50 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {plannedVisits.map((v, i) => (
              <div key={v.id} className="relative" style={{ transform: `translate(${(i-1)*100}px, ${(i-1)*50}px)` }}>
                <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute -inset-3"></div>
                <div className="relative flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary fill-primary" />
                  <div className="absolute -top-8 bg-on-surface text-surface px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap shadow-xl">
                    {i + 1}. {v.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 bg-surface-container-lowest/90 backdrop-blur p-4 rounded-2xl border border-outline-variant/20 shadow-2xl max-w-[240px]">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Live Route Intelligence</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-bold text-on-surface">Planned Stops: {plannedVisits.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <span className="text-xs font-bold text-on-surface">Total Distance: {(plannedVisits.length * 1.5).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-4 md:p-8 rounded-3xl flex flex-col justify-center gap-4 md:gap-6 shadow-sm border border-outline-variant/10">
          <div>
            <h4 className="text-xl font-black text-on-surface mb-2 tracking-tight">Route Optimization</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">AI-suggested sequence to minimize travel time and maximize visit efficiency based on GPS data.</p>
          </div>
          <div className="space-y-4">
            {plannedVisits.length > 0 ? (
              plannedVisits.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <div className="flex-1 border-b border-dashed border-outline-variant/30 pb-3">
                    <p className="text-sm font-black text-on-surface">{v.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{v.purpose}</p>
                      <span className="text-[10px] text-outline-variant">•</span>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{v.proximity} km away</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 opacity-30">
                <Navigation className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No Active Route</p>
              </div>
            )}
          </div>
          <button 
            disabled={plannedVisits.length === 0}
            className="mt-2 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
          >
            <Navigation className="w-5 h-5" />
            Start Field Navigation
          </button>
        </div>
      </section>
    </div>
  );
}
