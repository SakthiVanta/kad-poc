import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  UserPlus, 
  MapPin, 
  CheckCircle2, 
  IndianRupee,
  Users,
  Search,
  Plus,
  Clock,
  ShieldCheck,
  Building,
  X,
  UploadCloud,
  Car,
  Wind,
  BedDouble,
  LayoutGrid,
  TrendingUp,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ViewMode = 'dashboard' | 'create';

interface Vendor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNum?: string;
  companyType?: string;
}

interface Mandapam {
  id: string;
  name: string;
  vendorName: string;
  capacity: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  location?: string;
  price?: string;
  parking?: string;
  diningCapacity?: string;
  rooms?: string;
  hasAC?: boolean;
}

const mockVendors: Vendor[] = [
  { id: 'V001', name: 'Ramesh Kumaran', phone: '+91 98765 43210', email: 'ramesh@example.com' },
  { id: 'V002', name: 'Srinivasan Weddings', phone: '+91 99887 76655', email: 'contact@srinivasan.com' },
];

const mockMandapams: Mandapam[] = [
  { id: 'M101', name: 'Grand Royal Mahal', vendorName: 'Ramesh Kumaran', capacity: '1000', status: 'Approved', location: 'T Nagar', hasAC: true },
  { id: 'M102', name: 'Sri Valli Kalyana Mandapam', vendorName: 'Srinivasan Weddings', capacity: '500', status: 'Pending', location: 'Anna Nagar', hasAC: false },
  { id: 'M103', name: 'Emerald Mini Hall', vendorName: 'Srinivasan Weddings', capacity: '200', status: 'Approved', location: 'Adyar', hasAC: true },
];

export function NewListing() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeVendor, setActiveVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isMandapamModalOpen, setIsMandapamModalOpen] = useState(false);

  // Form states
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({ name: '', phone: '', email: '', address: '', gstNum: '', companyType: 'Individual' });
  const [mandapamForm, setMandapamForm] = useState<Partial<Mandapam>>({ name: '', capacity: '', location: '', price: '', parking: '', diningCapacity: '', rooms: '', hasAC: true });

  const [mandapams, setMandapams] = useState<Mandapam[]>(mockMandapams);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filteredVendors = mockVendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.phone.includes(searchQuery) || v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vendorMandapams = activeVendor ? mandapams.filter(m => m.vendorName === activeVendor.name) : [];

  // Stats
  const totalProperties = mandapams.length;
  const approvedProperties = mandapams.filter(m => m.status === 'Approved').length;
  const pendingProperties = mandapams.filter(m => m.status === 'Pending').length;

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name || !vendorForm.phone) return;
    
    const newVendor: Vendor = {
      id: `V00${mockVendors.length + 1}`,
      name: vendorForm.name,
      phone: vendorForm.phone,
      email: vendorForm.email,
      address: vendorForm.address,
      gstNum: vendorForm.gstNum,
      companyType: vendorForm.companyType
    };
    
    mockVendors.push(newVendor);
    setActiveVendor(newVendor);
    setIsVendorModalOpen(false);
    setVendorForm({ name: '', phone: '', email: '', address: '', gstNum: '', companyType: 'Individual' });
    
    setSuccessMsg('Vendor Profile Created!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateMandapam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor || !mandapamForm.name) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newM: Mandapam = {
        id: `M10${mandapams.length + 1}`,
        name: mandapamForm.name!,
        vendorName: activeVendor.name,
        capacity: mandapamForm.capacity || '0',
        location: mandapamForm.location,
        price: mandapamForm.price,
        parking: mandapamForm.parking,
        diningCapacity: mandapamForm.diningCapacity,
        rooms: mandapamForm.rooms,
        hasAC: mandapamForm.hasAC,
        status: 'Pending'
      };
      
      setMandapams([newM, ...mandapams]);
      setIsSubmitting(false);
      setIsMandapamModalOpen(false);
      
      setMandapamForm({ name: '', capacity: '', location: '', price: '', parking: '', diningCapacity: '', rooms: '', hasAC: true });
      
      setSuccessMsg('Mandapam submitted successfully for admin approval!');
      setTimeout(() => {
        setSuccessMsg('');
        setView('dashboard'); // Return to dashboard after successful submission
      }, 4000);
    }, 1500);
  };

  // DASHBOARD VIEW
  if (view === 'dashboard') {
    return (
      <div className="space-y-8 mx-auto pb-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Property Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Properties Listing</h1>
            <p className="text-on-surface-variant text-sm mt-1">Overview of all registered mandapams and their approval status.</p>
          </div>
          <button 
            onClick={() => { setView('create'); setActiveVendor(null); }}
            className="px-6 py-3 bg-primary text-white font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create New Property
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-on-surface">{totalProperties}</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Total Properties</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-on-surface">{approvedProperties}</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Approved</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500/10 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-on-surface">{pendingProperties}</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Pending Approval</p>
            </div>
          </div>
        </div>

        {/* All Properties Table */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-outline-variant/10 bg-surface-container-low/30 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              All Mandapams Directory
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input type="text" placeholder="Search properties..." className="pl-9 pr-4 py-2 bg-surface-container-highest border-none rounded-lg text-xs focus:ring-2 ring-primary/20 w-64 font-medium" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mandapam Name & ID</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vendor Details</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Location</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Capacity</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <AnimatePresence>
                  {mandapams.map((m) => (
                    <motion.tr 
                      key={m.id} 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-surface-container-low/50 transition-colors group"
                    >
                      <td className="p-5">
                        <p className="font-bold text-on-surface">{m.name}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant mt-0.5 tracking-widest uppercase">ID: {m.id}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-on-surface text-sm">{m.vendorName}</p>
                        <p className="text-[10px] font-medium text-on-surface-variant">Verified Vendor</p>
                      </td>
                      <td className="p-5 text-on-surface-variant font-medium text-sm">
                        {m.location || 'N/A'}
                      </td>
                      <td className="p-5">
                        <span className="font-bold text-on-surface">{m.capacity}</span> <span className="text-on-surface-variant text-xs">Pax</span>
                      </td>
                      <td className="p-5 text-right">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                          m.status === 'Approved' ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : 
                          m.status === 'Pending' ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" :
                          "bg-error/10 text-error border border-error/20"
                        )}>
                          {m.status === 'Approved' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {m.status}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {mandapams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                      <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-bold">No properties listed yet.</p>
                      <button onClick={() => setView('create')} className="mt-2 text-primary font-bold hover:underline">Create your first property</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // CREATE VIEW (Vendor Selection & Mandapam Creation)
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
          <Building2 className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Property Creation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">New Mandapam Listing</h1>
        <p className="text-on-surface-variant text-sm mt-1">Select a vendor profile to assign and create properties under their name.</p>
      </header>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-tertiary/10 text-tertiary font-bold rounded-2xl flex items-center gap-3 border border-tertiary/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: VENDOR SELECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col h-[70vh]">
            <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30 sticky top-0 z-10 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Vendors</h3>
              <button 
                onClick={() => setIsVendorModalOpen(true)}
                className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors"
                title="Create New Vendor"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 border-b border-outline-variant/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Search vendors..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl border-none text-xs focus:ring-2 ring-primary/20 font-bold"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {filteredVendors.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-on-surface-variant" />
                  <p className="text-xs font-bold">No vendors found</p>
                </div>
              ) : (
                filteredVendors.map(v => (
                  <button 
                    key={v.id} 
                    onClick={() => setActiveVendor(v)}
                    className={cn(
                      "w-full flex flex-col items-start p-4 rounded-2xl border transition-all text-left",
                      activeVendor?.id === v.id 
                        ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20" 
                        : "border-outline-variant/10 hover:border-primary/30 bg-surface-container-lowest"
                    )}
                  >
                    <div className="flex justify-between w-full mb-1">
                      <p className={cn("font-bold text-sm", activeVendor?.id === v.id ? "text-primary" : "text-on-surface")}>{v.name}</p>
                      <span className="text-[9px] font-black tracking-widest text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">{v.id}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium">{v.phone}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MANDAPAMS FOR SELECTED VENDOR */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!activeVendor ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-[70vh] bg-surface-container-low/50 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-on-surface-variant opacity-50" />
                </div>
                <h3 className="text-lg font-black text-on-surface">Select a Vendor First</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-2 max-w-[250px]">
                  Choose an existing vendor from the list or create a new one to manage and add properties for them.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Active Vendor Header Card */}
                <div className="bg-primary-container p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-white/20">
                        Active Vendor Profile
                      </div>
                      <h2 className="text-3xl font-black">{activeVendor.name}</h2>
                      <div className="flex gap-4 mt-2">
                        <p className="text-sm font-medium flex items-center gap-1 opacity-90">
                          ID: {activeVendor.id}
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1 opacity-90">
                          {activeVendor.phone}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsMandapamModalOpen(true)}
                      className="px-5 py-3 bg-white text-primary font-black text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Mandapam
                    </button>
                  </div>
                </div>

                {/* Mandapams Table */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30">
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
                      <Building className="w-4 h-4 text-primary" />
                      Assigned Properties ({vendorMandapams.length})
                    </h3>
                  </div>
                  
                  {vendorMandapams.length === 0 ? (
                    <div className="p-10 text-center text-on-surface-variant/70">
                      <p className="text-sm font-bold">No properties listed under this vendor yet.</p>
                      <p className="text-xs mt-1">Click 'Add Mandapam' to create one.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mandapam Name</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Location</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Capacity</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Features</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                          <AnimatePresence>
                            {vendorMandapams.map((m) => (
                              <motion.tr 
                                key={m.id} 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="hover:bg-surface-container-low/50 transition-colors group"
                              >
                                <td className="p-4">
                                  <p className="font-bold text-on-surface flex items-center gap-2">
                                    {m.name}
                                  </p>
                                  <p className="text-[10px] font-bold text-on-surface-variant mt-0.5">ID: {m.id}</p>
                                </td>
                                <td className="p-4 text-on-surface-variant font-medium text-xs">
                                  {m.location || 'N/A'}
                                </td>
                                <td className="p-4 text-on-surface-variant font-medium text-xs">
                                  {m.capacity} Pax
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    {m.hasAC && <Wind className="w-3.5 h-3.5 text-primary" title="AC Available" />}
                                    {m.parking && parseInt(m.parking) > 0 && <Car className="w-3.5 h-3.5 text-primary" title="Parking" />}
                                    {m.rooms && parseInt(m.rooms) > 0 && <BedDouble className="w-3.5 h-3.5 text-primary" title="Rooms" />}
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    m.status === 'Approved' ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : 
                                    m.status === 'Pending' ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" :
                                    "bg-error/10 text-error border border-error/20"
                                  )}>
                                    {m.status === 'Approved' ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {m.status}
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* VENDOR MODAL */}
      <AnimatePresence>
        {isVendorModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsVendorModalOpen(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl"><UserPlus className="w-5 h-5" /></div>
                  <h2 className="text-xl font-black">Create New Vendor</h2>
                </div>
                <button onClick={() => setIsVendorModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleCreateVendor} className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Company / Individual Name *</label>
                  <input type="text" required value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 ring-primary/20" placeholder="e.g. Ramesh Kumaran" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mobile Number *</label>
                  <input type="tel" required value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 ring-primary/20" placeholder="+91" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                    <input type="email" value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 ring-primary/20" placeholder="Optional" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vendor Type</label>
                    <select value={vendorForm.companyType} onChange={(e) => setVendorForm({ ...vendorForm, companyType: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 ring-primary/20 text-on-surface cursor-pointer">
                      <option>Individual</option>
                      <option>Private Limited</option>
                      <option>Partnership</option>
                      <option>Trust</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Billing Address</label>
                  <textarea rows={2} value={vendorForm.address} onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 ring-primary/20 custom-scrollbar resize-none" placeholder="Optional" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">GST Number</label>
                  <input type="text" value={vendorForm.gstNum} onChange={(e) => setVendorForm({ ...vendorForm, gstNum: e.target.value })} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-bold uppercase focus:ring-2 ring-primary/20" placeholder="Optional" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 py-3.5 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">Create Vendor Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANDAPAM MODAL */}
      <AnimatePresence>
        {isMandapamModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMandapamModalOpen(false)}
              className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-[32px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-primary-container text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl"><Building className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-2xl font-black leading-tight">Create Property</h2>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-0.5">Linked to: {activeVendor?.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsMandapamModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleCreateMandapam} className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-surface">
                
                {/* Media Upload Section */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Media Upload
                  </h4>
                  <div className="border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-on-surface">Click to upload property images</p>
                    <p className="text-xs text-on-surface-variant mt-1">Recommended: Front facade, Main Hall, Dining area. (Max 5MB each)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Basic Details */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 pb-2">Basic Details</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mandapam Name *</label>
                      <input type="text" required value={mandapamForm.name} onChange={(e) => setMandapamForm({ ...mandapamForm, name: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 ring-primary/20" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Primary Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input type="text" required value={mandapamForm.location} onChange={(e) => setMandapamForm({ ...mandapamForm, location: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pricing (₹/day)</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input type="number" value={mandapamForm.price} onChange={(e) => setMandapamForm({ ...mandapamForm, price: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 pl-9 pr-4 text-sm font-bold focus:ring-2 ring-primary/20" />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hall Type</label>
                        <select value={mandapamForm.hasAC ? 'AC' : 'Non-AC'} onChange={(e) => setMandapamForm({...mandapamForm, hasAC: e.target.value === 'AC'})} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 ring-primary/20 cursor-pointer text-on-surface">
                          <option value="AC">Air Conditioned</option>
                          <option value="Non-AC">Non-AC</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Capacities */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 pb-2">Capacities & Amenities</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Main Hall Pax</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input type="number" value={mandapamForm.capacity} onChange={(e) => setMandapamForm({ ...mandapamForm, capacity: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 pl-9 pr-4 text-sm font-bold focus:ring-2 ring-primary/20" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Dining Pax</label>
                        <input type="number" value={mandapamForm.diningCapacity} onChange={(e) => setMandapamForm({ ...mandapamForm, diningCapacity: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 ring-primary/20" placeholder="Optional" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Parking (Cars)</label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input type="number" value={mandapamForm.parking} onChange={(e) => setMandapamForm({ ...mandapamForm, parking: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 pl-9 pr-4 text-sm font-bold focus:ring-2 ring-primary/20" placeholder="Optional" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Guest Rooms</label>
                        <div className="relative">
                          <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input type="number" value={mandapamForm.rooms} onChange={(e) => setMandapamForm({ ...mandapamForm, rooms: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-3 pl-9 pr-4 text-sm font-bold focus:ring-2 ring-primary/20" placeholder="Optional" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant/10">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-primary text-white font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Building className="w-5 h-5" />
                            Submit Property Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
