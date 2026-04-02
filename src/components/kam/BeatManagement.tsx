import React, { useState } from 'react';
import {
  Map, Plus, Upload, Search, X, Check, ChevronRight, Building2,
  Users, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldOff,
  Edit2, Trash2, MoreVertical, MapPin, Download, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockBeats, mockKAEs, type Beat, type Mandapam } from '../../data/kamMockData';

type BeatStatus = 'active' | 'inactive';

const statusIcon = (s: Mandapam['status']) => {
  if (s === 'active')   return <CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
  if (s === 'pending')  return <Clock        className="w-3.5 h-3.5 text-amber-500" />;
  return                       <XCircle      className="w-3.5 h-3.5 text-error" />;
};

const statusLabel: Record<Mandapam['status'], string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

export function BeatManagement() {
  const [beats, setBeats]           = useState<Beat[]>(mockBeats);
  const [selectedId, setSelectedId] = useState<string | null>(beats[0]?.id ?? null);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState<'all' | BeatStatus>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showBulk, setShowBulk]     = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  // New beat form
  const [newBeat, setNewBeat] = useState({ name: '', area: '', city: 'Chennai' });

  const showToastMsg = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const selected = beats.find((b) => b.id === selectedId) ?? null;

  const filtered = beats.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: beats.length,
    active: beats.filter((b) => b.status === 'active').length,
    unassigned: beats.filter((b) => b.assignedKAEId === null).length,
    totalMandapams: beats.reduce((s, b) => s + b.mandapams.length, 0),
  };

  // Assign KAE to beat
  const assignKAE = (beatId: string, kaeId: number | null) => {
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, assignedKAEId: kaeId } : b));
    showToastMsg(kaeId ? 'KAE assigned successfully' : 'KAE unassigned');
  };

  // Toggle beat status
  const toggleBeatStatus = (beatId: string) => {
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    showToastMsg('Beat status updated');
  };

  // Remove mandapam from beat
  const removeMandapam = (beatId: string, mandapId: number) => {
    setBeats((prev) => prev.map((b) => b.id === beatId ? { ...b, mandapams: b.mandapams.filter((m) => m.id !== mandapId) } : b));
    showToastMsg('Mandapam removed from beat');
  };

  // Create new beat
  const createBeat = () => {
    if (!newBeat.name.trim()) return;
    const maxCode = beats.length + 1;
    const prefix  = newBeat.city.slice(0, 3).toUpperCase();
    const beat: Beat = {
      id: `B${String(maxCode).padStart(3, '0')}`,
      code: `C${maxCode}-${prefix}`,
      name: newBeat.name,
      area: newBeat.area || newBeat.name,
      city: newBeat.city,
      mandapams: [],
      assignedKAEId: null,
      status: 'active',
    };
    setBeats((prev) => [...prev, beat]);
    setNewBeat({ name: '', area: '', city: 'Chennai' });
    setShowCreate(false);
    setSelectedId(beat.id);
    showToastMsg('Beat created successfully');
  };

  const assignedKAEName = (id: number | null) =>
    id ? (mockKAEs.find((k) => k.id === id)?.name ?? '—') : 'Unassigned';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary text-white shadow-2xl text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-outline-variant/10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-on-surface">Beat Management</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-0.5">
              Manage geographic beats and assign field executives
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulk(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low text-xs font-black uppercase tracking-wide transition-all">
              <Upload className="w-4 h-4" /> Bulk Upload
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wide shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Add Beat
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 md:px-10 py-4 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Beats',    value: stats.total,          color: 'text-on-surface',  bg: 'bg-surface-container-low' },
            { label: 'Active',         value: stats.active,         color: 'text-primary',    bg: 'bg-primary/5' },
            { label: 'Unassigned',     value: stats.unassigned,     color: 'text-amber-600',   bg: 'bg-amber-500/5' },
            { label: 'Total Mandapams',value: stats.totalMandapams, color: 'text-primary',     bg: 'bg-primary/5' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-2xl p-4 border border-outline-variant/10', s.bg)}>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">{s.label}</p>
              <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden px-6 md:px-10 pb-8">

        {/* ── LEFT: Beat List ── */}
        <div className="lg:w-80 xl:w-96 shrink-0 flex flex-col border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm lg:mr-5 mb-5 lg:mb-0">
          {/* Search */}
          <div className="p-3 border-b border-outline-variant/10 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beats..."
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low rounded-xl text-sm font-medium outline-none"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'active', 'inactive'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all',
                    filter === f ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low')}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Beat Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/8">
            {filtered.map((beat) => {
              const isActive = beat.id === selectedId;
              const kae      = mockKAEs.find((k) => k.id === beat.assignedKAEId);
              return (
                <button
                  key={beat.id}
                  onClick={() => setSelectedId(beat.id)}
                  className={cn(
                    'w-full text-left px-4 py-4 transition-all hover:bg-surface-container-low/80',
                    isActive ? 'bg-primary/5 border-l-2 border-primary' : 'border-l-2 border-transparent'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black font-mono bg-surface-container px-2 py-0.5 rounded-lg text-on-surface-variant">{beat.code}</span>
                        <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                          beat.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error')}>
                          {beat.status}
                        </span>
                      </div>
                      <p className="text-sm font-black text-on-surface">{beat.name}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {beat.mandapams.length} mandapams
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {kae ? (
                        <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full truncate max-w-[90px]">{kae.name.split(' ')[0]}</span>
                      ) : (
                        <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">Unassigned</span>
                      )}
                      <ChevronRight className={cn('w-4 h-4 text-on-surface-variant/30 transition-transform', isActive && 'text-primary')} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Beat Detail ── */}
        {selected ? (
          <div className="flex-1 flex flex-col border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm">
            {/* Detail Header */}
            <div className="px-6 py-5 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black font-mono bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant">{selected.code}</span>
                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full',
                      selected.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error')}>
                      {selected.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-on-surface">{selected.name}</h2>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-primary" /> {selected.area}, {selected.city}
                  </p>
                </div>
                <button onClick={() => toggleBeatStatus(selected.id)}
                  className="text-[9px] font-black uppercase tracking-wide px-3 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors shrink-0">
                  {selected.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* KAE Assignment */}
              <div>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-primary" /> KAE Assignment
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <select
                      value={selected.assignedKAEId ?? ''}
                      onChange={(e) => assignKAE(selected.id, e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors appearance-none pr-8"
                    >
                      <option value="">— Unassigned —</option>
                      {mockKAEs.filter((k) => k.status === 'active').map((kae) => (
                        <option key={kae.id} value={kae.id}>
                          {kae.name} ({kae.empId}) — {kae.beatsAssigned} beats
                        </option>
                      ))}
                    </select>
                  </div>
                  {selected.assignedKAEId && (
                    <div className="bg-primary/5 border border-primary/20 px-4 py-3 rounded-xl shrink-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary">Assigned</p>
                      <p className="text-sm font-black text-on-surface">{assignedKAEName(selected.assignedKAEId)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Beat Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total',    value: selected.mandapams.length,                                         color: 'text-on-surface' },
                  { label: 'Active',   value: selected.mandapams.filter((m) => m.status === 'active').length,   color: 'text-primary' },
                  { label: 'BWG',      value: selected.mandapams.filter((m) => m.bwgPromise).length,            color: 'text-primary' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/8 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</p>
                    <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Mandapams Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> Mandapams in this Beat
                  </h3>
                  <button className="text-[9px] font-black uppercase tracking-wide text-primary hover:text-primary/70 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                {selected.mandapams.length === 0 ? (
                  <div className="border-2 border-dashed border-outline-variant/20 rounded-2xl py-12 text-center">
                    <Building2 className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
                    <p className="text-sm font-bold text-on-surface-variant/40">No mandapams in this beat</p>
                    <p className="text-xs text-on-surface-variant/30">Add mandapams to start tracking</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selected.mandapams.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/8 hover:border-outline-variant/20 transition-colors group">
                        {statusIcon(m.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">{m.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              'text-[8px] font-black uppercase tracking-widest',
                              m.status === 'active' ? 'text-primary' : m.status === 'pending' ? 'text-amber-600' : 'text-error'
                            )}>
                              {statusLabel[m.status]}
                            </span>
                            {m.bwgPromise && (
                              <span className="text-[8px] font-black text-primary flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" /> BWG
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeMandapam(selected.id, m.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from beat"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border border-outline-variant/10 rounded-3xl bg-surface-container-lowest">
            <div className="text-center">
              <Map className="w-14 h-14 text-on-surface-variant/20 mx-auto mb-4" />
              <p className="text-sm font-bold text-on-surface-variant/40">Select a beat to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Create Beat Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" onClick={() => setShowCreate(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Create New Beat</h2>
                  <button onClick={() => setShowCreate(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Beat Name <span className="text-error">*</span></label>
                    <input
                      value={newBeat.name}
                      onChange={(e) => setNewBeat((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Adyar"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Area / Locality</label>
                    <input
                      value={newBeat.area}
                      onChange={(e) => setNewBeat((f) => ({ ...f, area: e.target.value }))}
                      placeholder="e.g. Adyar, South Chennai"
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">City</label>
                    <select
                      value={newBeat.city}
                      onChange={(e) => setNewBeat((f) => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors"
                    >
                      {['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Madurai'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 text-[10px] text-on-surface-variant">
                    Beat code will be auto-generated. Mandapams can be added after creation.
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Cancel</button>
                  <button onClick={createBeat} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Create Beat
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-[210] flex items-center justify-center p-6"
            >
              <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                  <h2 className="text-base font-black text-on-surface">Bulk Upload Beats</h2>
                  <button onClick={() => setShowBulk(false)} className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Download Template</p>
                      <p className="text-xs text-on-surface-variant">Beat name, Area, City, KAE Emp ID (optional)</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-xs font-black text-on-surface-variant hover:bg-surface-container-high transition-colors">
                      <Download className="w-4 h-4" /> .xlsx
                    </button>
                  </div>
                  <div className="w-full border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors group cursor-pointer">
                    <Upload className="w-10 h-10 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-bold text-on-surface-variant">Click to upload Excel / CSV</p>
                    <p className="text-xs text-on-surface-variant/50">Each row = one beat. Mandapams can be added after upload.</p>
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
