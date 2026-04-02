import React, { useState, useRef } from 'react';
import {
  Users, Plus, Upload, Search, Key, Edit2, ToggleLeft, ToggleRight,
  X, Check, Download, AlertCircle, CheckCircle2, ChevronDown, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockKAEs } from '../../data/kamMockData';

type KAE = (typeof mockKAEs)[0];
type Status = 'active' | 'inactive';

// Auto-generate next emp ID
function nextEmpId(list: KAE[]) {
  const max = list.reduce((m, k) => {
    const n = parseInt(k.empId.replace('BWG_KAE_', ''));
    return n > m ? n : m;
  }, 0);
  return `BWG_KAE_${String(max + 1).padStart(3, '0')}`;
}

interface CreateForm {
  empId: string;
  customEmpId: boolean;
  name: string;
  phone: string;
  email: string;
  city: string;
}

const emptyForm = (list: KAE[]): CreateForm => ({
  empId: nextEmpId(list),
  customEmpId: false,
  name: '',
  phone: '',
  email: '',
  city: '',
});

const CITIES = ['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Madurai'];

export function KAEManagement() {
  const [kaeList, setKaeList] = useState<KAE[]>(mockKAEs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [resetId, setResetId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateForm>(emptyForm(kaeList));
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = kaeList.filter((k) => {
    const matchSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.empId.toLowerCase().includes(search.toLowerCase()) ||
      k.phone.includes(search);
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: kaeList.length,
    active: kaeList.filter((k) => k.status === 'active').length,
    inactive: kaeList.filter((k) => k.status === 'inactive').length,
    unassigned: kaeList.filter((k) => k.beatsAssigned === 0).length,
  };

  // Toggle status
  const toggleStatus = (id: number) => {
    setKaeList((prev) =>
      prev.map((k) => k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k)
    );
    showToast('Status updated');
  };

  // Reset password
  const confirmReset = (id: number) => {
    setResetId(null);
    showToast('Password reset to phone number');
  };

  // Create KAE
  const openCreate = () => {
    setForm(emptyForm(kaeList));
    setFormError('');
    setEditId(null);
    setShowCreate(true);
  };

  const openEdit = (kae: KAE) => {
    setForm({ empId: kae.empId, customEmpId: true, name: kae.name, phone: kae.phone, email: kae.email, city: kae.city });
    setEditId(kae.id);
    setFormError('');
    setShowCreate(true);
  };

  const submitForm = () => {
    if (!form.name.trim()) { setFormError('Full name is required'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setFormError('Phone must be 10 digits'); return; }
    if (editId !== null) {
      setKaeList((prev) => prev.map((k) => k.id === editId ? { ...k, ...form } : k));
      showToast('KAE updated successfully');
    } else {
      const newKAE: KAE = {
        id: Math.max(...kaeList.map((k) => k.id)) + 1,
        empId: form.empId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        status: 'active',
        beatsAssigned: 0,
        lastActive: '—',
        createdAt: new Date().toISOString().slice(0, 10),
        department: 'Field Sales',
      };
      setKaeList((prev) => [...prev, newKAE]);
      showToast('KAE created successfully');
    }
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'fixed top-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold',
              toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-outline-variant/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-on-surface">KAE Management</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-0.5">Manage field executives, credentials, and assignments</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulk(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low text-xs font-black uppercase tracking-wide transition-all">
              <Upload className="w-4 h-4" /> Bulk Upload
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wide shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Add KAE
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total KAEs', value: stats.total, color: 'text-on-surface', bg: 'bg-surface-container-low' },
            { label: 'Active', value: stats.active, color: 'text-primary', bg: 'bg-primary/5' },
            { label: 'Inactive', value: stats.inactive, color: 'text-error', bg: 'bg-error/5' },
            { label: 'Unassigned', value: stats.unassigned, color: 'text-amber-600', bg: 'bg-amber-500/5' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-2xl p-5 border border-outline-variant/10', s.bg)}>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{s.label}</p>
              <p className={cn('text-3xl font-black', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, Emp ID or phone..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  'px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all',
                  statusFilter === f ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-surface-container-low border-b border-outline-variant/10">
            {['KAE', 'Emp ID', 'Phone', 'Beats', 'Status', 'Actions'].map((h) => (
              <p key={h} className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-outline-variant/8">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
                <p className="text-sm font-bold text-on-surface-variant/40">No KAEs found</p>
              </div>
            ) : (
              filtered.map((kae) => (
                <div key={kae.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-surface-container-low/50 transition-colors">
                  {/* Name */}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{kae.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{kae.email}</p>
                  </div>
                  {/* Emp ID */}
                  <p className="text-xs font-black text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg w-fit font-mono">{kae.empId}</p>
                  {/* Phone */}
                  <p className="text-sm font-medium text-on-surface-variant">{kae.phone}</p>
                  {/* Beats */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-on-surface">{kae.beatsAssigned}</span>
                    <span className="text-[9px] text-on-surface-variant">beats</span>
                  </div>
                  {/* Status */}
                  <span className={cn(
                    'text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full w-fit',
                    kae.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                  )}>
                    {kae.status}
                  </span>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(kae)} className="w-8 h-8 rounded-xl hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setResetId(kae.id)} className="w-8 h-8 rounded-xl hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-amber-600 transition-colors" title="Reset Password">
                      <Key className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleStatus(kae.id)} className="w-8 h-8 rounded-xl hover:bg-surface-container-low flex items-center justify-center transition-colors" title="Toggle Status">
                      {kae.status === 'active'
                        ? <ToggleRight className="w-4 h-4 text-primary" />
                        : <ToggleLeft className="w-4 h-4 text-on-surface-variant/40" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer count */}
          <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-container-low/50">
            <p className="text-[10px] font-bold text-on-surface-variant">Showing {filtered.length} of {kaeList.length} executives</p>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Drawer ── */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]" onClick={() => setShowCreate(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-[210] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
                <div>
                  <h2 className="text-base font-black text-on-surface">{editId ? 'Edit KAE' : 'Add New KAE'}</h2>
                  <p className="text-xs text-on-surface-variant">
                    {editId ? 'Update executive details' : 'Phone number will be the default password'}
                  </p>
                </div>
                <button onClick={() => setShowCreate(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container text-on-surface-variant">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Emp ID */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Employee ID</label>
                  <div className="flex gap-2">
                    <input
                      value={form.empId}
                      onChange={(e) => setForm((f) => ({ ...f, empId: e.target.value }))}
                      disabled={!form.customEmpId}
                      className={cn(
                        'flex-1 px-4 py-3 rounded-xl border text-sm font-mono font-bold outline-none transition-all',
                        form.customEmpId
                          ? 'bg-surface-container-low border-primary text-on-surface'
                          : 'bg-surface-container border-outline-variant/20 text-on-surface-variant'
                      )}
                    />
                    <button
                      onClick={() => setForm((f) => ({ ...f, customEmpId: !f.customEmpId }))}
                      className={cn(
                        'px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wide border transition-all',
                        form.customEmpId ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20'
                      )}
                    >
                      {form.customEmpId ? 'Auto' : 'Edit'}
                    </button>
                  </div>
                  {!form.customEmpId && <p className="text-[9px] text-on-surface-variant mt-1">Auto-generated — toggle to customize</p>}
                </div>

                {/* Name */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Full Name <span className="text-error">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Rajan Kumar"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Phone Number <span className="text-error">*</span></label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[9px] text-on-surface-variant/60 mt-1 flex items-center gap-1">
                    <Key className="w-3 h-3" /> This will be set as the default password
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="kae@bwg.com"
                    type="email"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">City / Region</label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors appearance-none pr-10"
                    >
                      <option value="">Select city</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 pointer-events-none" />
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-error/5 rounded-xl border border-error/20">
                    <AlertCircle className="w-4 h-4 text-error shrink-0" />
                    <p className="text-xs font-bold text-error">{formError}</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-5 border-t border-outline-variant/10 flex gap-3 shrink-0">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  Cancel
                </button>
                <button onClick={submitForm} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  {editId ? 'Save Changes' : 'Create KAE'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Reset Password Confirm ── */}
      <AnimatePresence>
        {resetId !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setResetId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl p-8 max-w-sm w-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 mx-auto">
                  <Key className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-black text-on-surface text-center mb-2">Reset Password?</h3>
                <p className="text-sm text-on-surface-variant text-center mb-6 leading-relaxed">
                  This will reset the password to the KAE's registered phone number as the default password.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setResetId(null)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
                  <button onClick={() => confirmReset(resetId)} className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bulk Upload Modal ── */}
      <AnimatePresence>
        {showBulk && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowBulk(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Bulk Upload KAEs</h2>
                  <button onClick={() => setShowBulk(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  {/* Template download */}
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Download Template</p>
                      <p className="text-xs text-on-surface-variant">Excel sheet with required columns</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-xs font-black text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <Download className="w-4 h-4" /> .xlsx
                    </button>
                  </div>

                  {/* Upload zone */}
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <Upload className="w-10 h-10 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface">Click to upload or drag & drop</p>
                    <p className="text-xs text-on-surface-variant/60">.xlsx, .xls or .csv — max 5MB</p>
                  </button>

                  {/* Column reference */}
                  <div className="bg-surface-container-low rounded-2xl p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Required Columns</p>
                    <div className="flex flex-wrap gap-2">
                      {['Name', 'Phone', 'Email', 'City', 'Emp ID (optional)'].map((col) => (
                        <span key={col} className="text-[9px] font-bold bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant">{col}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowBulk(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
                  <button className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all">Upload & Preview</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
